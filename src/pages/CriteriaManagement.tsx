  import React, { useEffect, useState } from 'react';
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
    Checkbox,
    message,
  } from 'antd';
  import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
  import type { ColumnsType } from 'antd/es/table';
  import {
    getAllCriteria,
    createCriteria,
    updateCriteria,
    deleteCriteria,
    getAllCriteriaTypes,
    CriteriaRequest,
    CriteriaResponse,
    CriteriaTypeItem,
  } from '../services/criteriaService';

  const { Title } = Typography;
  const { TextArea } = Input;
  const toRoman = (num: number): string => {
    const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return romans[num - 1] || `${num}`;
  };

  const toAlphabet = (index: number): string => {
    return String.fromCharCode(97 + index); // 97 = 'a'
  };

  const CriteriaManagement = () => {
    const [data, setData] = useState<CriteriaResponse[]>([]);
    const [criteriaTypes, setCriteriaTypes] = useState<CriteriaTypeItem[]>([]);
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<CriteriaResponse | null>(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
      try {
        const res = await getAllCriteria();
        setData(res);
      } catch {
        message.error('Lỗi khi tải tiêu chí');
      }
    };

    const fetchCriteriaTypes = async () => {
      try {
        const res = await getAllCriteriaTypes();
        setCriteriaTypes(res);
        if (res.length > 0 && selectedType === null) {
          setSelectedType(res[0].criteriaTypeID); // mặc định chọn loại đầu tiên
        }
      } catch {
        message.error('Lỗi khi tải loại tiêu chí');
      }
    };

    useEffect(() => {
      fetchData();
      fetchCriteriaTypes();
    }, []);

    const openModal = (record?: CriteriaResponse | null, parentID?: number | null) => {
      const editingData = record ? { ...record, parentID: record.parentID } : parentID ? { parentID } as any : null;
      setEditing(editingData);
      form.setFieldsValue({
        criteriaName: record?.criteriaName || '',
        description: record?.description || '',
        maxScore: record?.maxScore || 0,
        isStudentScored: record?.isStudentScored ?? true,
        isAdminScored: record?.isAdminScored ?? false,
        isUploadOnly: record?.isUploadOnly ?? false,
        isActive: record?.isActive ?? true,
      });
      setModalOpen(true);
    };

    const handleDelete = async (record: CriteriaResponse) => {
      try {
        await deleteCriteria(record.criteriaID);
        message.success('Đã xoá thành công');
        fetchData();
      } catch {
        message.error('Xoá thất bại');
      }
    };

    const handleSubmit = async () => {
      try {
        const values = await form.validateFields();
        const isChild = editing?.parentID || editing?.level === 2;
        const payload: CriteriaRequest = {
          criteriaName: values.criteriaName,
          description: isChild ? values.description : '',
          maxScore: isChild ? values.maxScore : 0,
          level: isChild ? 2 : 1,
          isStudentScored: isChild ? values.isStudentScored : false,
          isAdminScored: isChild ? values.isAdminScored : false,
          isUploadOnly: isChild ? values.isUploadOnly : false,
          isActive: isChild ? values.isActive : true,
          criteriaTypeID: selectedType!,
          parentID: editing?.parentID || null,
        };

        if (editing?.criteriaID) {
          await updateCriteria(editing.criteriaID, payload);
          message.success('Cập nhật thành công');
        } else {
          await createCriteria(payload);
          message.success('Tạo mới thành công');
        }

        setModalOpen(false);
        fetchData();
      } catch (error) {
        message.error('Lỗi xử lý dữ liệu');
      }
    };

    const filterByType = (list: CriteriaResponse[], typeID: number): CriteriaResponse[] => {
      return list
        .filter(item => item.criteriaTypeName && criteriaTypes.find(c => c.criteriaTypeID === typeID)?.criteriaTypeName === item.criteriaTypeName)
        .map(item => ({
          ...item,
          key: item.criteriaID.toString(),
          children: item.children ? filterByType(item.children, typeID) : undefined,
        }));
    };

    const columns: ColumnsType<CriteriaResponse> = [
      {
        title: 'Tên tiêu chí',
        key: 'criteriaName',
        render: (_, record, index) => {
          if (record.level === 1) {
            return `${toRoman(index + 1)}. ${record.criteriaName}`;
          } else if (record.level === 2 && record.parentID) {
            return `${toAlphabet(index)}. ${record.criteriaName}`;
          }
          return record.criteriaName; // Không đánh số nếu không thuộc level 1 hoặc 2
        },
      },
      { title: 'Mô tả', dataIndex: 'description', key: 'description' },
      { title: 'Điểm tối đa', dataIndex: 'maxScore', key: 'maxScore' },
      {
        title: 'Thao tác',
        key: 'action',
        render: (_, record) => (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => openModal(record)}>Sửa</Button>
            <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>Xoá</Button>
            <Button onClick={() => openModal(null, record.criteriaID)}>➕ Con</Button>
          </Space>
        ),
        width: 220,
      },
    ];

    const handleMutualExclusion = (field: 'isStudentScored' | 'isAdminScored') => {
      const current = form.getFieldValue(field);
      if (field === 'isStudentScored') {
        form.setFieldsValue({ isStudentScored: current, isAdminScored: !current });
      } else {
        form.setFieldsValue({ isStudentScored: !current, isAdminScored: current });
      }
    };

    const isEditingChild = editing?.level === 2 || editing?.parentID;

    return (
      <div style={{ padding: 24 }}>
        <Title level={3}>📋 Quản lý tiêu chí</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal(null)}>
          Thêm tiêu chí cha
        </Button>

        <Select
          value={selectedType ?? undefined}
          onChange={value => setSelectedType(value)}
          style={{ width: 300, marginBottom: 16, marginLeft: 16 }}
          options={criteriaTypes.map(type => ({
            label: type.criteriaTypeName,
            value: type.criteriaTypeID,
          }))}
        />

        <Table
          columns={columns}
          dataSource={selectedType ? filterByType(data, selectedType) : []}
          pagination={false}
          expandable={{ defaultExpandAllRows: true }}
          rowKey="criteriaID"
          style={{ marginTop: 20 }}
        />

        <Modal
          open={modalOpen}
          title={
            editing?.criteriaID
              ? 'Cập nhật tiêu chí'
              : editing?.parentID
              ? 'Thêm tiêu chí con'
              : 'Thêm tiêu chí cha'
          }
          onCancel={() => setModalOpen(false)}
          onOk={handleSubmit}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="criteriaName" label="Tên tiêu chí" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            {isEditingChild && (
              <>
                <Form.Item name="description" label="Mô tả">
                  <TextArea rows={3} />
                </Form.Item>
                <Form.Item name="maxScore" label="Điểm tối đa" rules={[{ required: true }]}>
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="isStudentScored" valuePropName="checked">
                  <Checkbox onChange={() => handleMutualExclusion('isStudentScored')}>
                    Cho phép sinh viên tự đánh giá
                  </Checkbox>
                </Form.Item>
                <Form.Item name="isAdminScored" valuePropName="checked">
                  <Checkbox onChange={() => handleMutualExclusion('isAdminScored')}>
                    Cho phép Admin đánh giá
                  </Checkbox>
                </Form.Item>
                <Form.Item name="isUploadOnly" valuePropName="checked">
                  <Checkbox>Chỉ được upload minh chứng</Checkbox>
                </Form.Item>
                <Form.Item name="isActive" valuePropName="checked">
                  <Checkbox>Kích hoạt tiêu chí</Checkbox>
                </Form.Item>
              </>
            )}
          </Form>
        </Modal>
      </div>
    );
  };

  export default CriteriaManagement;
