import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  getAllCriteriaTypes,
  createCriteriaType,
  updateCriteriaType,
  deleteCriteriaType,
  CriteriaTypeResponse,
  CriteriaTypeRequest,
} from '../services/CriteriaTypeService';

const { Title } = Typography;

const CriteriaTypeManagement = () => {
  const [data, setData] = useState<CriteriaTypeResponse[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<CriteriaTypeResponse | null>(null);
  const [editing, setEditing] = useState<CriteriaTypeResponse | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const res = await getAllCriteriaTypes();
      setData(res);
    } catch {
      message.error('Không thể tải danh sách loại tiêu chí');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (record?: CriteriaTypeResponse) => {
    setEditing(record || null);
    form.setFieldsValue({
      criteriaTypeName: record?.criteriaTypeName || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: CriteriaTypeRequest = {
        criteriaTypeName: values.criteriaTypeName,
      };

      if (editing) {
        await updateCriteriaType(editing.criteriaTypeID, payload);
        message.success('Cập nhật thành công');
      } else {
        await createCriteriaType(payload);
        message.success('Tạo mới thành công');
      }

      setModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Lỗi xử lý dữ liệu');
    }
  };

  const handleDelete = (record: CriteriaTypeResponse) => {
    setSelectedToDelete(record);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedToDelete) return;

    try {
      console.log('🛰️ Gửi DELETE với ID:', selectedToDelete.criteriaTypeID);
      await deleteCriteriaType(selectedToDelete.criteriaTypeID);
      message.success('Đã xoá loại tiêu chí thành công');
      fetchData();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (msg?.includes('REFERENCE') || msg?.includes('conflicted')) {
        message.error('Không thể xoá vì đang có tiêu chí thuộc loại này.');
      } else {
        message.error(msg || 'Lỗi khi xoá loại tiêu chí');
      }
    } finally {
      setDeleteModalOpen(false);
      setSelectedToDelete(null);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>📚 Quản lý loại tiêu chí</Title>

      <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
        Thêm loại tiêu chí
      </Button>

      <Table
        dataSource={data}
        rowKey="criteriaTypeID"
        style={{ marginTop: 20 }}
        columns={[
          { title: 'Tên loại tiêu chí', dataIndex: 'criteriaTypeName' },
          {
            title: 'Thao tác',
            render: (_, record) => (
              <Space>
                <Button icon={<EditOutlined />} onClick={() => openModal(record)}>
                  Sửa
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => {
                    console.log('🧨 Click nút xoá:', record);
                    handleDelete(record);
                  }}
                >
                  Xoá
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Cập nhật loại tiêu chí' : 'Thêm loại tiêu chí'}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="criteriaTypeName"
            label="Tên loại tiêu chí"
            rules={[{ required: true, message: 'Vui lòng nhập tên loại tiêu chí' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={deleteModalOpen}
        title="Xác nhận xoá loại tiêu chí"
        onCancel={() => setDeleteModalOpen(false)}
        onOk={confirmDelete}
        okText="Xoá"
        cancelText="Huỷ"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xoá loại tiêu chí <strong>{selectedToDelete?.criteriaTypeName}</strong>?</p>
      </Modal>
    </div>
  );
};

export default CriteriaTypeManagement;
