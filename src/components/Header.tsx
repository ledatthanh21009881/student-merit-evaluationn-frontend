import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // kiểm tra xem có token trong localStorage hay không.

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      navigate(key);
    }
  };
  // Tạo một mảng menuItems chứa các mục menu. Nếu có token, thêm mục "Đăng xuất" vào menu.

  const menuItems = [
    { label: 'Trang chủ', key: '/' },
    { label: 'Quản lý sinh viên', key: '/students' },
    ...(token ? [{ label: 'Đăng xuất', key: 'logout' }] : [])
  ];
  // Nếu có token, thêm mục "Đăng xuất" vào menu.

  return (
    <Header>
      <Menu
        theme="dark"
        mode="horizontal"
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Header>
  );
};

export default AppHeader;
