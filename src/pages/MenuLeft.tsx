import React from 'react';
import { Layout, Menu, Dropdown, Typography } from 'antd';
import { UserOutlined, TrophyOutlined, LogoutOutlined, LockOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Sider, Header, Content } = Layout;

interface UserInfo {
  fullName: string;
  role: number;
}

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  let user: UserInfo = { fullName: '', role: -1 };
  try {
    const rawUser = localStorage.getItem('user');
    if (rawUser) user = JSON.parse(rawUser);
  } catch {
    console.error('Không đọc được user từ localStorage');
  }

  const role = user?.role ?? -1;
  console.log('🎯 Role hiện tại:', role);

  const handleMenuClick = ({ key }: any) => {
    if (key === 'logout') {
      if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.clear();
        navigate('/login');
      }
    } else {
      navigate(key);
    }
  };

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      {/* <Menu.Item key="/change-password" icon={<LockOutlined />}>Đổi mật khẩu</Menu.Item> */}
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>Đăng xuất</Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" width={200}>
        <Menu
          mode="inline"
          theme="dark"
          onClick={handleMenuClick}
          selectedKeys={[location.pathname]}
        >
          <Menu.Item key="/profile" icon={<UserOutlined />}>Thông tin cá nhân</Menu.Item>
          {user.role === 0 && (
            <Menu.Item key="/criteria-management" icon={<TrophyOutlined />}>
              Quản lý tiêu chí
            </Menu.Item>
          )}
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '0 12px', display: 'flex', justifyContent: 'space-between' }}>
          <img src="/cofer-avt.jpg" alt="logo1" height={60} />
          <Dropdown overlay={userMenu}>
            <div style={{ cursor: 'pointer' }}>
              {user.fullName || 'Tài khoản'}
            </div>
          </Dropdown>
        </Header>

        <Content style={{ padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
