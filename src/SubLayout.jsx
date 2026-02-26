import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  UserOutlined, 
  FileTextOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const SubLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  // กำหนดรายการเมนูสำหรับปุ่มด้านบน
  const menuItems = [
    { 
      label: 'กลับหน้าหลัก', 
      key: '/home', 
      icon: <ArrowLeftOutlined /> 
    },
    { 
      label: 'User List', 
      key: '/Admin/', 
      icon: <UserOutlined /> 
    },
    { 
      label: 'Post List', 
      key: '/Admin/PostList', 
      icon: <FileTextOutlined /> 
    },
  ];

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* --- Header ด้านบนที่มีปุ่มเมนู --- */}
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: colorBgContainer, // ใช้สีขาวตาม Theme
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px'
      }}>
        <div className="demo-logo" style={{ fontWeight: 'bold', marginRight: '24px' }}>
          ADMIN PANEL
        </div>
        
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]} // ทำให้ปุ่มเป็นสีฟ้าตาม Path ปัจจุบัน
          items={menuItems}
          onClick={handleMenuClick}
          style={{ flex: 1, minWidth: 0 }} // ยืดเมนูให้เต็มพื้นที่
        />
      </Header>

      <Layout style={{ padding: '24px' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* ส่วนแสดงเนื้อหาของแต่ละ Page */}
          <Outlet />
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          Taton Company ©{new Date().getFullYear()} Created by React + Ant Design
        </Footer>
      </Layout>
    </Layout>
  );
};

export default SubLayout;