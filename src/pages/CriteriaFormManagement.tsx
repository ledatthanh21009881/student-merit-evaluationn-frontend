import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  message,
  Checkbox,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface CriteriaForm {
  criteriaFormID: number;
  formName: string;
  academicYearStart: number;
  semester: string;
  description: string;
  startDate: string;
  endDate: string;
  formType: string;
  isActive: boolean;
}

const CriteriaFormManagement: React.FC = () => {
  const [formList, setFormList] = useState<CriteriaForm[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CriteriaForm | null>(null);
  const [form] = Form.useForm();

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const y = currentYear + i;
    return { label: y.toString(), value: y };
  });

  const semesterOptions = [
    { label: 'Học kỳ 1', value: 'HK1' },
    { label: 'Học kỳ 2', value: 'HK2' },
  ];

  const handleOpenModal = (record?: CriteriaForm) => {
    if (record) {
      setEditing(record);
      form.setFieldsValue({
        ...record,
        dateRange: [dayjs(record.startDate), dayjs(record.endDate)],
      });
    } else {
      setEditing(null);
      form.resetFields();
    }
    setModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const startYear = values.academicYearStart;
      const rangeStart = values.dateRange[0].year();

      if (rangeStart < startYear) {
        message.error('Ngày bắt đầu không được nhỏ hơn năm học bắt đầu.');
        return;
      }

      const newForm: CriteriaForm = {
        criteriaFormID: editing?.criteriaFormID || Date.now(),
        formName: values.formName,
        academicYearStart: values.academicYearStart,
        semester: values.semester,
        description: values.description,
        formType: values.formType,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        isActive: values.isActive,
      };

      if (editing) {
        setFormList(prev => prev.map(f => (f.criteriaFormID === editing.criteriaFormID ? newForm : f)));
        message.success('Cập nhật thành công');
      } else {
        setFormList(prev => [...prev, newForm]);
        message.success('Tạo mới thành công');
      }
      setModalOpen(false);
    });
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xoá',
      onOk: () => {
        setFormList(prev => prev.filter(f => f.criteriaFormID !== id));
        message.success('Đã xoá');
      },
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>📄 Quản lý biểu mẫu đánh giá</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm biểu mẫu</Button>
      <Table
        dataSource={formList}
        rowKey="criteriaFormID"
        pagination={false}
        style={{ marginTop: 20 }}
        columns={[
          { title: 'Tên biểu mẫu', dataIndex: 'formName' },
          { title: 'Năm học', dataIndex: 'academicYearStart' },
          { title: 'Học kỳ', dataIndex: 'semester' },
          { title: 'Thời gian', render: (_, r) => `${r.startDate} → ${r.endDate}` },
          { title: 'Loại', dataIndex: 'formType' },
          { title: 'Trạng thái', dataIndex: 'isActive', render: val => val ? '✅' : '🚫' },
          {
            title: 'Thao tác',
            render: (_, record) => (
              <Space>
                <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>Sửa</Button>
                <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.criteriaFormID)}>Xoá</Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editing ? 'Cập nhật biểu mẫu' : 'Thêm biểu mẫu'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="formName" label="Tên biểu mẫu" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="academicYearStart" label="Năm học bắt đầu" rules={[{ required: true }]}> <Select options={yearOptions} /> </Form.Item>
          <Form.Item name="semester" label="Học kỳ" rules={[{ required: true }]}> <Select options={semesterOptions} /> </Form.Item>
          <Form.Item name="description" label="Mô tả"> <Input.TextArea rows={2} /> </Form.Item>
          <Form.Item name="formType" label="Loại biểu mẫu" rules={[{ required: true }]}> <Select options={[
            { value: 'DRL', label: 'Điểm rèn luyện' },
            { value: 'SV5T', label: 'Sinh viên 5 tốt' },
            { value: 'TNTTLTLB', label: 'Tiên tiến làm theo lời Bác' },
          ]} />
          </Form.Item>
          <Form.Item name="dateRange" label="Thời gian áp dụng" rules={[{ required: true }]}> <RangePicker style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="isActive" valuePropName="checked"> <Checkbox>Kích hoạt biểu mẫu</Checkbox> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CriteriaFormManagement;
