import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { HomeOutlined, UserAddOutlined, LoginOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ใช้สำหรับบอกว่าตอนนี้อยู่หน้าไหน เมนูจะได้ไฮไลท์ถูก
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const menuItems = [
    { label: 'Login', key: '/', icon: <LoginOutlined /> },
    { label: 'Home', key: '/home', icon: <HomeOutlined /> },
    { label: 'Register', key: '/register', icon: <UserAddOutlined /> },
    { label: 'PostList', key: '/PostList', icon: <UserAddOutlined /> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: 'white', marginRight: '1250px', fontWeight: 'bold', fontSize: '18px' }}>
          TATON COMPANY
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]} // ไฮไลท์เมนูตาม URL ปัจจุบัน
          items={menuItems}
          onClick={(e) => navigate(e.key)}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      
      <Content style={{ padding: '24px 48px' }}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: '80vh',
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* Outlet คือส่วนที่จะนำเนื้อหาจาก App, Home, Register มาแสดง */}
          <Outlet />
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        Taton Company ©{new Date().getFullYear()} Created by React + Ant Design
      </Footer>
    </Layout>
  );
};

export default MainLayout;