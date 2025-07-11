import React from 'react';
import { Button, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const TestUI: React.FC = () => {
    const showToast = () => {
        message.success('Đã thêm sinh viên!');
        console.log('Toast clicked');
    };

    const showModal = () => {
        console.log('Modal clicked');
        Modal.confirm({
            title: 'Bạn chắc chắn chứ?',
            icon: <ExclamationCircleOutlined />,
            content: 'Đây là hộp thoại xác nhận hiển thị khi bạn click.',
            okText: 'Đúng rồi',
            cancelText: 'Không',
            onOk: () => {
                console.log('Bạn đã chọn: OK');
            },
            onCancel: () => {
                console.log('Bạn đã chọn: Hủy');
            },
        });
    };

    return (
        <div style={{ display: 'flex', gap: 16, padding: 20 }}>
            <Button type="primary" onClick={showToast}>
                Test Toast
            </Button>
            <Button onClick={showModal}>
                Test Modal
            </Button>
        </div>
    );
};

export default TestUI;
