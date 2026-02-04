import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { HomeOutlined, UserAddOutlined, LoginOutlined, ExclamationCircleOutlined} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // ใช้สำหรับบอกว่าตอนนี้อยู่หน้าไหน เมนูจะได้ไฮไลท์ถูก
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const menuItems = [
    { label: 'Login', key: '/', icon: <LoginOutlined /> },
    { label: 'Home', key: '/home', icon: <HomeOutlined /> },
    { label: 'Register', key: '/register', icon: <UserAddOutlined /> },
    { label: 'Main', key: '/MainPage', icon: <ExclamationCircleOutlined /> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
<Header 
  style={{ 
    display: 'flex', 
    alignItems: 'center', 
    padding: '0 20px',
    background: '#001529', // กำหนดสีพื้นหลังให้ชัดเจน
    position: 'sticky', 
    top: 0, 
    zIndex: 1000, 
    width: '100%' 
  }}
>
  {/* ส่วน Logo */}
  <div style={{ 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: '20px', 
    marginRight: 'auto', // สำคัญ! คำสั่งนี้จะดัน Menu ไปขวาสุดโดยอัตโนมัติ
    whiteSpace: 'nowrap'
  }}>
    TATON COMPANY
  </div>

  {/* ส่วน Menu */}
  <Menu
    theme="dark"
    mode="horizontal"
    selectedKeys={[location.pathname]}
    items={menuItems}
    onClick={(e) => navigate(e.key)}
    style={{ 
      minWidth: '300px', // กำหนดความกว้างขั้นต่ำ เพื่อไม่ให้เมนูหาย
      justifyContent: 'flex-end', // จัดตัวหนังสือในเมนูให้ชิดขวา
      borderBottom: 'none',
      background: 'transparent' // ให้กลืนไปกับ Header
    }}
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