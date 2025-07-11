import React, { useState } from 'react';
import { Upload, Button, message, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { RcFile } from 'antd/es/upload';
import axios from 'axios';

const { Text } = Typography;

const ImportExcel: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: RcFile) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');

      await axios.post('https://localhost:7044/api/Students/Import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      message.success('Import sinh viên thành công!');
      onSuccess?.();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Import thất bại!');
    } finally {
      setUploading(false);
    }

    return false; // ngăn antd tự upload
  };

  const props: UploadProps = {
    accept: '.xlsx',
    showUploadList: false,
    beforeUpload: handleUpload,
  };

  return (
    <div>
      <Text strong>📥 Nhập danh sách sinh viên từ Excel</Text>
      <Upload {...props}>
        <Button icon={<UploadOutlined />} loading={uploading}>
          Chọn file Excel
        </Button>
      </Upload>
    </div>
  );
};

export default ImportExcel;
