import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Typography,
  Select,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { TextArea } = Input;
export type CriteriaType = 'diem_ren_luyen' | '5_tot' | 'tien_tien_lam_theo_loi_bac';

interface Criteria {
  key: string;
  name: string;
  description?: string;
  maxScore?: number;
  level?: number;
  children?: Criteria[];
  type?: CriteriaType;
}

const initialData: Criteria[] = [
  {
    key: '1',
    name: 'I. Đánh giá về ý thức học tập',
    maxScore: 30,
    level: 1,
    type: 'diem_ren_luyen',
    children: [
      {
        key: '1-1',
        name: 'Chuyên cần',
        description: 'Đi học đúng giờ, không bỏ tiết. Vi phạm 1 lần trừ 3 điểm.',
        maxScore: 20,
        type: 'diem_ren_luyen',
      },
      {
        key: '1-2',
        name: 'Thực hiện nghĩa vụ học tập',
        description: 'Nộp bài tập đúng hạn. Vi phạm 1 lần trừ 2 điểm.',
        maxScore: 5,
        type: 'diem_ren_luyen',
      },
      {
        key: '1-3',
        name: 'Học lại, thi lại',
        description: 'Học lại, thi lại một môn trừ tối đa 5 điểm.',
        maxScore: 5,
        type: 'diem_ren_luyen',
      },
    ],
  },
  {
    key: '2',
    name: 'II. Chấp hành nội quy, quy chế',
    maxScore: 25,
    level: 1,
    type: 'diem_ren_luyen',
    children: [
      {
        key: '2-1',
        name: 'Thực hiện đầy đủ thủ tục hành chính',
        description: 'Hoàn thành kê khai, đăng ký.',
        maxScore: 10,
        type: 'diem_ren_luyen',
      },
      {
        key: '2-2',
        name: 'Tham gia sinh hoạt công dân',
        description: 'Sinh hoạt đầu năm, giữa kỳ...',
        maxScore: 5,
        type: 'diem_ren_luyen',
      },
      {
        key: '2-3',
        name: 'Không vi phạm nội quy',
        description: 'Không bị nhắc nhở, đóng học phí đầy đủ...',
        maxScore: 10,
        type: 'diem_ren_luyen',
      },
    ],
  },
  {
    key: '3',
    name: 'III. Tham gia hoạt động chính trị, xã hội, thể thao...',
    maxScore: 20,
    level: 1,
    type: 'diem_ren_luyen',
    children: [
      {
        key: '3-1',
        name: 'Tham gia hoạt động tình nguyện, thể thao...',
        description: 'Từ đoàn trường, khoa, lớp, CTXH...',
        maxScore: 12,
        type: 'diem_ren_luyen',
      },
      {
        key: '3-2',
        name: 'Tham gia tổ chức phong trào',
        description: 'Làm BTC, cán sự, cộng tác viên...',
        maxScore: 8,
        type: 'diem_ren_luyen',
      },
    ],
  },
  {
    key: '4',
    name: 'IV. Phẩm chất công dân và quan hệ cộng đồng',
    maxScore: 15,
    level: 1,
    type: 'diem_ren_luyen',
    children: [
      {
        key: '4-1',
        name: 'Chấp hành pháp luật',
        description: 'Không vi phạm pháp luật, nội quy',
        maxScore: 5,
        type: 'diem_ren_luyen',
      },
      {
        key: '4-2',
        name: 'Tích cực hoạt động cộng đồng',
        description: 'Tuyên truyền pháp luật, bảo vệ môi trường...',
        maxScore: 3,
        type: 'diem_ren_luyen',
      },
      {
        key: '4-3',
        name: 'Là cán bộ Đoàn, CLB, đội nhóm...',
        description: 'Sinh hoạt đều, có vai trò tích cực',
        maxScore: 2,
        type: 'diem_ren_luyen',
      },
      {
        key: '4-4',
        name: 'Mối quan hệ tốt với tập thể',
        description: 'Không gây mất đoàn kết...',
        maxScore: 5,
        type: 'diem_ren_luyen',
      },
    ],
  },
  {
    key: '5',
    name: 'V. Thành tích đặc biệt',
    maxScore: 10,
    level: 1,
    type: 'diem_ren_luyen',
    children: [
      {
        key: '5-1',
        name: 'Tham gia đầy đủ tổng kết, họp lớp, khoa...',
        description: 'Không bị trừ điểm',
        maxScore: 5,
        type: 'diem_ren_luyen',
      },
      {
        key: '5-2',
        name: 'Có thành tích học tập, rèn luyện, phong trào',
        description: 'Giấy khen, giải thưởng...',
        maxScore: 5,
        type: 'diem_ren_luyen',
      },
    ],
  },
];


const CriteriaManagement = () => {
  const [data, setData] = useState<Criteria[]>(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Criteria | null>(null);
  const [selectedType, setSelectedType] = useState<CriteriaType>('diem_ren_luyen');
  const [form] = Form.useForm();

  const openModal = (record?: Criteria | null, parentKey?: string) => {
    setEditing(record ? { ...record, parentKey } : { parentKey } as any);
    form.setFieldsValue(record || {});
    setModalOpen(true);
  };

  const handleDelete = (record: Criteria, parentKey?: string) => {
    if (parentKey) {
      setData(prev =>
        prev.map(d =>
          d.key === parentKey
            ? {
                ...d,
                children: d.children?.filter(c => c.key !== record.key),
              }
            : d
        )
      );
    } else {
      setData(prev => prev.filter(d => d.key !== record.key));
    }
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const newItem: Criteria = {
        key: editing?.key || Date.now().toString(),
        ...values,
        type: selectedType,
      };
      if (editing?.key) {
        if ((editing as any).parentKey) {
          setData(prev =>
            prev.map(d =>
              d.key === (editing as any).parentKey
                ? {
                    ...d,
                    children: d.children?.map(c =>
                      c.key === editing.key ? newItem : c
                    ),
                  }
                : d
            )
          );
        } else {
          setData(prev => prev.map(d => (d.key === editing.key ? newItem : d)));
        }
      } else {
        if ((editing as any)?.parentKey) {
          setData(prev =>
            prev.map(d =>
              d.key === (editing as any).parentKey
                ? {
                    ...d,
                    children: [...(d.children || []), newItem],
                  }
                : d
            )
          );
        } else {
          setData(prev => [...prev, { ...newItem, children: [] }]);
        }
      }
      setModalOpen(false);
    });
  };

  const columns: ColumnsType<Criteria> = [
    {
      title: 'Tên tiêu chí',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Điểm tối đa',
      dataIndex: 'maxScore',
      key: 'maxScore',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)}>
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record)}
          >
            Xoá
          </Button>
          <Button onClick={() => openModal(null, record.key)}>➕ Con</Button>
        </Space>
      ),
      width: 220,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>📋 Quản lý tiêu chí</Title>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
        Thêm tiêu chí
      </Button>
      <Select
        value={selectedType}
        onChange={(value) => setSelectedType(value)}
        style={{ width: 300, marginBottom: 16 }}
        options={[
            { label: 'Điểm rèn luyện', value: 'diem_ren_luyen' },
            { label: 'Sinh viên 5 tốt', value: '5_tot' },
            { label: 'SV tiên tiến làm theo lời Bác', value: 'tien_tien_lam_theo_loi_bac' },
        ]}
        />
      <Table
        columns={columns}
        dataSource={data.filter(item => item.type === selectedType)}
        pagination={false}
        expandable={{ defaultExpandAllRows: true }}
        rowKey="key"
        style={{ marginTop: 20 }}
      />

      <Modal
        open={modalOpen}
        title={editing?.key ? 'Cập nhật tiêu chí' : 'Thêm tiêu chí'}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên tiêu chí"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="maxScore"
            label="Điểm tối đa"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CriteriaManagement;
