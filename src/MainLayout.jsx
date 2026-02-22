import React, { useState } from 'react';
import { Layout, Menu, theme, Drawer, Button, Grid } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  UserAddOutlined, 
  LoginOutlined, 
  ExclamationCircleOutlined,
  MenuOutlined // ไอคอน 3 ขีดสำหรับ Mobile
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { useBreakpoint } = Grid; // Hook สำหรับเช็คขนาดหน้าจอ

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint(); // เช็ค Breakpoint (sm, md, lg, xl, xxl)
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  
  // State สำหรับ Mobile Drawer
  const [openDrawer, setOpenDrawer] = useState(false);
  // State สำหรับ Desktop Sider (ย่อ/ขยาย)
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { label: 'LandingPage', key: '/', icon: <LoginOutlined /> },
    { label: 'Home', key: '/home', icon: <HomeOutlined /> },
    { label: 'Main', key: '/MainPage', icon: <ExclamationCircleOutlined /> },
  ];

  // ฟังก์ชันคลิกเมนู (ใช้ร่วมกันทั้ง Mobile และ Desktop)
  const handleMenuClick = (e) => {
    navigate(e.key);
    if (!screens.md) {
        setOpenDrawer(false); // ปิด Drawer เมื่อเลือกเมนูบนมือถือ
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      
      {/* --- Header --- */}
      <Header 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 20px',
          background: '#076fd0', 
          position: 'sticky', 
          top: 0, 
          zIndex: 1000, 
          width: '100%',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          
          {/* ปุ่ม Hamburger (แสดงเฉพาะตอนจอเล็ก !screens.md) */}
          {!screens.md && (
            <Button 
                type="text" 
                icon={<MenuOutlined style={{ color: 'white', fontSize: '20px' }} />} 
                onClick={() => setOpenDrawer(true)}
            />
          )}

          <div style={{ 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: '20px', 
            whiteSpace: 'nowrap'
          }}>
            TATON COMPANY
          </div>
        </div>
      </Header>

      <Layout>
        {/* --- 1. Sider สำหรับ Desktop (ซ่อนเมื่อจอเล็ก) --- */}
        {screens.md && (
            <Sider 
            width={200}
            collapsible 
            collapsed={collapsed} 
            onCollapse={(value) => setCollapsed(value)}
            style={{ 
                background: colorBgContainer,
                height: 'calc(100vh - 64px)', 
                position: 'fixed', 
                left: 0,
                top: 64, 
                zIndex: 999,
                overflow: 'auto'
            }}
            >
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={handleMenuClick}
                style={{ height: '100%', borderRight: 0 }}
            />
            </Sider>
        )}

        {/* --- 2. Drawer สำหรับ Mobile (แสดงเมื่อกดปุ่ม Hamburger) --- */}
        <Drawer
            title="เมนูหลัก"
            placement="left"
            onClose={() => setOpenDrawer(false)}
            open={openDrawer}
            styles={{ body: { padding: 0 } }} // เอา Padding ออกเพื่อให้เมนูชิดขอบ
            width={250}
        >
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={handleMenuClick}
                style={{ borderRight: 0 }}
            />
        </Drawer>

        {/* --- 3. Content --- */}
        <Layout style={{ 
            padding: '24px 24px', 
            // คำนวณ Margin ซ้าย:
            // ถ้าเป็น Desktop (screens.md) ให้เว้นระยะตาม Sider (80 หรือ 200)
            // ถ้าเป็น Mobile ให้เป็น 0 (เพราะ Sider หายไปแล้ว)
            marginLeft: screens.md ? (collapsed ? 80 : 200) : 0, 
            transition: 'all 0.2s' 
        }}>
          
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
             <Outlet />
          </Content>

          <Footer style={{ textAlign: 'center' }}>
            Taton Company ©{new Date().getFullYear()} Created by React + Ant Design
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;