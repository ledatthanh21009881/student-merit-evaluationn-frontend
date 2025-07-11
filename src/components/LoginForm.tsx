import React from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';

const { Title, Text } = Typography;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      await login(values);
      const user = JSON.parse(localStorage.getItem('user')!);

      message.success('Đăng nhập thành công!');

      // Điều hướng vào trang profile cho tất cả role
      if ([0, 1, 2, 3, 4].includes(user.role)) {
        navigate('/profile');
      } else {
        message.error('Vai trò không hợp lệ');
      }
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || 'Đăng nhập thất bại!';
      message.error(errMsg);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#C6E2FF' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', padding: 40, borderRadius: 12, width: 400 }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>ĐĂNG NHẬP</Title>
          <Text type="secondary">Trang đăng nhập dành cho tất cả người dùng</Text>

          <Form onFinish={onFinish} layout="vertical" style={{ marginTop: 24 }}>
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
            >
              <Input placeholder="Mã số sinh viên hoặc tên đăng nhập" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password placeholder="Mật khẩu..." />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Text>Chưa có tài khoản? </Text>
            <Link to="/register">Đăng ký ngay</Link>
            <br />
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, background: '#C6E2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="../cofer-avt.jpg" alt="Login" style={{ width: '80%', maxWidth: 300 }} />
      </div>
    </div>
  );
};

export default LoginForm;
