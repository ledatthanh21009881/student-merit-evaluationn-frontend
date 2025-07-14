import React, { JSX, useEffect, useState } from 'react';
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
  Tabs,
  Tree,
  Typography,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  getAllCriteriaForms,
  getCriteriaFormById,
  createCriteriaForm,
  updateCriteriaForm,
  deleteCriteriaForm,
  CriteriaFormRequest,
  CriteriaFormResponse,
} from '../services/criteriaFormService';
import { getAllCriteria, CriteriaResponse } from '../services/criteriaService';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Title } = Typography;

// Hàm chuyển số thành số La Mã
const toRoman = (num: number): string => {
  const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  return romans[num - 1] || `${num}`;
};

// Hàm chuyển số thành chữ cái (a, b, c, ...)
const toAlphabet = (index: number): string => {
  return String.fromCharCode(97 + index);
};

const CriteriaFormManagement: React.FC = () => {
  const [formList, setFormList] = useState<CriteriaFormResponse[]>([]);
  const [criteriaFlat, setCriteriaFlat] = useState<CriteriaResponse[]>([]);
  const [criteriaTreeData, setCriteriaTreeData] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showDetail, setShowDetail] = useState<any | null>(null);
  const [editing, setEditing] = useState<CriteriaFormResponse | null>(null);
  const [selectedToDelete, setSelectedToDelete] = useState<CriteriaFormResponse | null>(null);
  const [form] = Form.useForm();

  // Tạo danh sách năm học
  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `${new Date().getFullYear() + i}`,
    value: new Date().getFullYear() + i,
  }));

  // Tạo danh sách học kỳ
  const semesterOptions = [
    { label: 'Học kỳ 1', value: 'HK1' },
    { label: 'Học kỳ 2', value: 'HK2' },
  ];

  // Lấy danh sách tiêu chí
  const fetchCriteria = async () => {
    try {
      const res = await getAllCriteria();
      console.log('Dữ liệu tiêu chí từ API:', res);
      setCriteriaFlat(flattenCriteria(res));
      setCriteriaTreeData(mapTree(res));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tiêu chí:', error);
      message.error('Không thể tải danh sách tiêu chí.');
    }
  };

  // Lấy danh sách biểu mẫu
  const fetchData = async () => {
    try {
      const res = await getAllCriteriaForms();
      console.log('Dữ liệu biểu mẫu từ API:', res);
      setFormList(res);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách biểu mẫu:', error);
      message.error('Không thể tải danh sách biểu mẫu.');
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchCriteria();
    fetchData();
  }, []);

  // Chuyển danh sách tiêu chí thành dạng phẳng
  const flattenCriteria = (list: CriteriaResponse[]): CriteriaResponse[] => {
    return list.reduce((acc: CriteriaResponse[], item) => {
      acc.push(item);
      if (item.children && item.children.length > 0) {
        acc.push(...flattenCriteria(item.children));
      }
      return acc;
    }, []);
  };

  // Chuyển danh sách tiêu chí thành dạng cây
  const mapTree = (list: CriteriaResponse[]): any[] => {
    return list.map((item, index) => {
      const isParent = item.level === 1;
      const prefix = isParent ? `${toRoman(index + 1)}. ` : '';
      return {
        title: prefix + item.criteriaName,
        key: item.criteriaID,
        children: item.children && item.children.length > 0
          ? item.children.map((child, cIndex) => ({
              title: `${toAlphabet(cIndex)}. ${child.criteriaName}`,
              key: child.criteriaID,
            }))
          : [],
      };
    });
  };

  // Mở modal thêm/sửa biểu mẫu
  const handleOpenModal = async (record?: CriteriaFormResponse) => {
    if (record) {
      try {
        const detail = await getCriteriaFormById(record.criteriaFormID);
        console.log('Dữ liệu chi tiết biểu mẫu:', detail);
        setEditing(detail);
        const ids = detail.selectedCriteriaIds
          ?? detail.selectedCriteria?.map(c => c.criteriaID)
          ?? [];
        setCheckedKeys(ids);

        form.setFieldsValue({
          formName: detail.formName || '',
          academicYearStart: detail.academicYearStart || null,
          semester: detail.semester === 'Học kỳ 1' || detail.semester === 'HK1' ? 'HK1' :
                    detail.semester === 'Học kỳ 2' || detail.semester === 'HK2' ? 'HK2' : '',
          formType: detail.formType === 'DRL' || detail.formType === 'Điểm rèn luyện' ? 'DRL' :
                    detail.formType === 'SV5T' || detail.formType === 'Sinh viên 5 tốt' ? 'SV5T' :
                    detail.formType === 'TNTTLTLB' || detail.formType === 'Tiên tiến làm theo lời Bác' ? 'TNTTLTLB' :
                    detail.formType === 'Thi đua' ? 'Thi đua' : '',
          description: detail.description || '',
          isActive: detail.isActive || false,
          dateRange: detail.startDate && detail.endDate
            ? [dayjs(detail.startDate, 'YYYY-MM-DDTHH:mm:ss'), dayjs(detail.endDate, 'YYYY-MM-DDTHH:mm:ss')]
            : undefined,
          timelines: detail.timelines?.map(t => ({
            ...t,
            startDate: dayjs(t.startDate, 'YYYY-MM-DDTHH:mm:ss'),
            endDate: dayjs(t.endDate, 'YYYY-MM-DDTHH:mm:ss'),
          })) || [],
        });
      } catch (error) {
        console.error('Lỗi khi tải chi tiết biểu mẫu:', error);
        message.error('Không thể tải thông tin biểu mẫu. Vui lòng thử lại!');
      }
    } else {
      setEditing(null);
      form.resetFields();
      setCheckedKeys([]);
      console.log('Mở modal tạo mới, reset form và checkedKeys');
    }
    setModalOpen(true);
  };

  // Xử lý submit biểu mẫu
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Dữ liệu form trước khi submit:', values);
      const payload: CriteriaFormRequest = {
        ...values,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        selectedCriteriaIds: checkedKeys,
        timelines: values.timelines?.map((t: any) => ({
          ...t,
          startDate: t.startDate.format('YYYY-MM-DD'),
          endDate: t.endDate.format('YYYY-MM-DD'),
        })) || [],
      };
      if (editing) {
        await updateCriteriaForm(editing.criteriaFormID, payload);
        message.success('Cập nhật thành công');
      } else {
        await createCriteriaForm(payload);
        message.success('Tạo mới thành công');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Lỗi khi submit biểu mẫu:', error);
      message.error('Có lỗi xảy ra khi lưu biểu mẫu. Vui lòng kiểm tra lại!');
    }
  };

  // Xử lý mở modal xóa
  const handleDelete = (record: CriteriaFormResponse) => {
    setSelectedToDelete(record);
    setDeleteModalOpen(true);
    console.log('🧨 Mở modal xóa cho biểu mẫu ID:', record.criteriaFormID);
  };

  // Xác nhận xóa
  const confirmDelete = async () => {
    if (!selectedToDelete) return;

    try {
      console.log('🛰️ Gửi DELETE với ID:', selectedToDelete.criteriaFormID);
      await deleteCriteriaForm(selectedToDelete.criteriaFormID);
      message.success('Đã xoá biểu mẫu thành công');
      fetchData();
    } catch (err: any) {
      console.error('Lỗi khi xóa biểu mẫu:', err.response?.data || err.message);
      const msg = err?.response?.data?.message || 'Lỗi khi xoá biểu mẫu';
      if (msg?.includes('REFERENCE') || msg?.includes('conflicted')) {
        message.error('Không thể xoá vì biểu mẫu đang được sử dụng.');
      } else {
        message.error(msg);
      }
    } finally {
      setDeleteModalOpen(false);
      setSelectedToDelete(null);
      console.log('✅ Hoàn tất thao tác xóa hoặc hủy');
    }
  };

  // Render cây tiêu chí
  const renderCriteriaTree = (criteriaList: CriteriaResponse[]) => {
    return (
      <ul style={{ paddingLeft: 20 }}>
        {criteriaList.map((c, i) => (
          <li key={c.criteriaID}>
            <strong>{toRoman(i + 1)}. {c.criteriaName}</strong>
            {c.children && c.children.length > 0 && (
              <ul style={{ paddingLeft: 20 }}>
                {c.children.map((child, j) => (
                  <li key={child.criteriaID}>
                    {toAlphabet(j)}. {child.criteriaName}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };

  // Render chi tiết biểu mẫu
  const renderDetail = (record: CriteriaFormResponse): JSX.Element => {
    const criteriaMap = new Map<number, CriteriaResponse>();
    criteriaFlat.forEach(item => criteriaMap.set(item.criteriaID, item));
    const selected = record.selectedCriteriaIds || record.selectedCriteria?.map(c => c.criteriaID) || [];
    const grouped: Record<number, CriteriaResponse & { children: CriteriaResponse[] }> = {};

    selected.forEach(id => {
      const item = criteriaMap.get(id);
      if (item) {
        if (item.level === 1) {
          grouped[id] = { ...item, children: [] };
        } else if (item.level === 2 && item.parentID && criteriaMap.has(item.parentID)) {
          if (!grouped[item.parentID]) {
            const parent = criteriaMap.get(item.parentID)!;
            grouped[item.parentID] = { ...parent, children: [] };
          }
          grouped[item.parentID].children.push(item);
        }
      }
    });

    const criteriaTree = renderCriteriaTree(Object.values(grouped));
    return (
      <div>
        <Title level={5}>📌 Tiêu chí áp dụng:</Title>
        {criteriaTree}

        {record.timelines && record.timelines.length > 0 && (
          <>
            <Title level={5} style={{ marginTop: 20 }}>📅 Thời gian thực hiện:</Title>
            <ul style={{ paddingLeft: 20 }}>
              {record.timelines.map((t, i) => (
                <li key={i} style={{ marginBottom: 10 }}>
                  <strong>{t.stepName}</strong> ({t.roleTarget})<br />
                  {dayjs(t.startDate).format('DD/MM/YYYY')} → {dayjs(t.endDate).format('DD/MM/YYYY')}<br />
                  {t.description && <em>{t.description}</em>}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>📄 Quản lý biểu mẫu đánh giá</Title>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
        Thêm biểu mẫu
      </Button>

      <Table
        dataSource={formList}
        rowKey="criteriaFormID"
        style={{ marginTop: 20 }}
        pagination={false}
        columns={[
          { title: 'Tên biểu mẫu', dataIndex: 'formName' },
          { title: 'Năm học', dataIndex: 'academicYearStart' },
          { title: 'Học kỳ', dataIndex: 'semester' },
          { title: 'Thời gian', render: (_, r) => `${r.startDate} → ${r.endDate}` },
          { title: 'Loại', dataIndex: 'formType' },
          {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            render: val => (val ? '✅' : '🚫'),
          },
          {
            title: 'Thao tác',
            render: (_, record) => (
              <Space>
                <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>
                  Sửa
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleDelete(record)}
                >
                  Xoá
                </Button>
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => {
                    if (criteriaFlat.length === 0) {
                      fetchCriteria().then(() => setShowDetail(record));
                    } else {
                      setShowDetail(record);
                    }
                  }}
                >
                  Chi tiết
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editing ? 'Cập nhật biểu mẫu' : 'Tạo biểu mẫu mới'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSubmit}
        width={800}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thông tin biểu mẫu" key="1">
            <Form form={form} layout="vertical">
              <Form.Item
                name="formName"
                label="Tên biểu mẫu"
                rules={[{ required: true, message: 'Vui lòng nhập tên biểu mẫu!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="academicYearStart"
                label="Năm học bắt đầu"
                rules={[{ required: true, message: 'Vui lòng chọn năm học!' }]}
              >
                <Select options={yearOptions} />
              </Form.Item>
              <Form.Item
                name="semester"
                label="Học kỳ"
                rules={[{ required: true, message: 'Vui lòng chọn học kỳ!' }]}
              >
                <Select options={semesterOptions} />
              </Form.Item>
              <Form.Item
                name="formType"
                label="Loại biểu mẫu"
                rules={[{ required: true, message: 'Vui lòng chọn loại biểu mẫu!' }]}
              >
                <Select
                  options={[
                    { value: 'DRL', label: 'Điểm rèn luyện' },
                    { value: 'SV5T', label: 'Sinh viên 5 tốt' },
                    { value: 'TNTTLTLB', label: 'Tiên tiến làm theo lời Bác' },
                    { value: 'Thi đua', label: 'Thi đua' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="description" label="Mô tả">
                <Input.TextArea rows={2} />
              </Form.Item>
              <Form.Item
                name="dateRange"
                label="Thời gian áp dụng"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian áp dụng!' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="isActive" valuePropName="checked">
                <Checkbox>Kích hoạt biểu mẫu</Checkbox>
              </Form.Item>
              <Form.List name="timelines" initialValue={[{}]}>
                {(fields, { add, remove }) => (
                  <>
                    <Title level={5}>🕒 Các bước thực hiện</Title>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} style={{ border: '1px solid #eee', padding: 16, marginBottom: 12, borderRadius: 8 }}>
                        <Form.Item
                          {...restField}
                          name={[name, 'stepName']}
                          label="Tên bước"
                          rules={[{ required: true, message: 'Vui lòng nhập tên bước!' }]}
                        >
                          <Input placeholder="Ví dụ: Sinh viên nộp hồ sơ" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'roleTarget']}
                          label="Vai trò thực hiện"
                          rules={[{ required: true, message: 'Vui lòng nhập vai trò!' }]}
                        >
                          <Input placeholder="Ví dụ: Sinh viên" />
                        </Form.Item>
                        <Form.Item {...restField} name={[name, 'description']} label="Mô tả">
                          <Input.TextArea placeholder="Mô tả thêm về bước này..." />
                        </Form.Item>
                        <Form.Item label="Thời gian thực hiện">
                          <Space>
                            <Form.Item
                              name={[name, 'startDate']}
                              rules={[{ required: true, message: 'Chọn ngày bắt đầu!' }]}
                            >
                              <DatePicker placeholder="Bắt đầu" />
                            </Form.Item>
                            <Form.Item
                              name={[name, 'endDate']}
                              rules={[{ required: true, message: 'Chọn ngày kết thúc!' }]}
                            >
                              <DatePicker placeholder="Kết thúc" />
                            </Form.Item>
                          </Space>
                        </Form.Item>
                        <Button danger onClick={() => remove(name)}>Xoá bước này</Button>
                      </div>
                    ))}
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                      Thêm bước timeline
                    </Button>
                  </>
                )}
              </Form.List>
            </Form>
          </TabPane>

          <TabPane tab="Chọn tiêu chí" key="2">
            <Tree
              checkable
              treeData={criteriaTreeData}
              checkedKeys={checkedKeys}
              onCheck={(keys) => setCheckedKeys(keys as number[])}
              defaultExpandAll
            />
          </TabPane>
        </Tabs>
      </Modal>

      <Modal
        title="Xác nhận xoá biểu mẫu"
        open={deleteModalOpen}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedToDelete(null);
          console.log('🛑 Hủy thao tác xóa cho ID:', selectedToDelete?.criteriaFormID);
        }}
        onOk={confirmDelete}
        okText="Xoá"
        cancelText="Huỷ"
        okButtonProps={{ danger: true }}
      >
        <p>
          Bạn có chắc chắn muốn xoá biểu mẫu <strong>{selectedToDelete?.formName}</strong> (ID: {selectedToDelete?.criteriaFormID})?
        </p>
      </Modal>

      <Modal
        title="Chi tiết tiêu chí được áp dụng"
        open={!!showDetail}
        onCancel={() => setShowDetail(null)}
        footer={null}
      >
        {showDetail && renderDetail(showDetail)}
      </Modal>
    </div>
  );
};

export default CriteriaFormManagement;