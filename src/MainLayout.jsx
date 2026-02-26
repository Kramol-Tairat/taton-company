import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Drawer, Button, Grid, Avatar, Typography, Divider, Space } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  LoginOutlined, 
  ExclamationCircleOutlined,
  MenuOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { db } from './firebase'; // นำเข้า db เพื่อดึงข้อมูลถ้าจำเป็น
import { doc, getDoc } from 'firebase/firestore';

const { Header, Content, Footer, Sider } = Layout;
const { useBreakpoint } = Grid;
const { Text } = Typography;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  
  const [openDrawer, setOpenDrawer] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  // State สำหรับข้อมูลผู้ใช้
  const [userInfo, setUserInfo] = useState({ name: 'Guest', img: null });

  // ดึงข้อมูลผู้ใช้จาก localStorage/Firestore
  useEffect(() => {
    const userId = localStorage.getItem('userid');
    if (userId) {
      const fetchUser = async () => {
        const docRef = doc(db, "test_usercollection", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserInfo({
            name: docSnap.data().username,
            img: docSnap.data().userimg
          });
        }
      };
      fetchUser();
    }
  }, []);

  const menuItems = [
    { label: 'LandingPage', key: '/', icon: <LoginOutlined /> },
    { label: 'Home', key: '/home', icon: <HomeOutlined /> },
    { label: 'Main', key: '/MainPage', icon: <ExclamationCircleOutlined /> },
  ];

  const handleMenuClick = (e) => {
    navigate(e.key);
    if (!screens.md) setOpenDrawer(false);
  };

  // --- ส่วนประกอบโปรไฟล์ (สร้างเป็นฟังก์ชันเพื่อใช้ซ้ำ) ---
  const ProfileSection = ({ isCollapsed }) => (
    <div style={{ 
      padding: isCollapsed ? '20px 0' : '20px', 
      textAlign: 'center',
      transition: 'all 0.2s',
      background: '#fafafa'
    }}>
      <Avatar 
        size={isCollapsed ? 32 : 64} 
        src={userInfo.img} 
        icon={<UserOutlined />} 
        style={{ backgroundColor: '#1890ff', marginBottom: isCollapsed ? 0 : 10 }}
      />
      {!isCollapsed && (
        <div style={{ marginTop: 8 }}>
          <Text strong style={{ display: 'block' }}>{userInfo.name}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>ผู้ใช้งาน</Text>
        </div>
      )}
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', alignItems: 'center', padding: '0 20px', background: '#076fd0', 
        position: 'sticky', top: 0, zIndex: 1000, width: '100%', justifyContent: 'space-between' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {!screens.md && (
            <Button 
              type="text" 
              icon={<MenuOutlined style={{ color: 'white', fontSize: '20px' }} />} 
              onClick={() => setOpenDrawer(true)}
            />
          )}
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>TATON COMPANY</div>
        </div>
      </Header>

      <Layout>
        {screens.md && (
          <Sider 
            width={200}
            collapsible 
            collapsed={collapsed} 
            onCollapse={(value) => setCollapsed(value)}
            style={{ 
              background: colorBgContainer, height: 'calc(100vh - 64px)', 
              position: 'fixed', left: 0, top: 64, zIndex: 999, overflow: 'auto' 
            }}
          >
            {/* เพิ่มโปรไฟล์ใน Sider */}
            <ProfileSection isCollapsed={collapsed} />
            <Divider style={{ margin: '0' }} />
            
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
              style={{ borderRight: 0 }}
            />
          </Sider>
        )}

        <Drawer
          title="เมนูหลัก"
          placement="left"
          onClose={() => setOpenDrawer(false)}
          open={openDrawer}
          styles={{ body: { padding: 0 } }}
          width={250}
        >
          {/* เพิ่มโปรไฟล์ใน Drawer */}
          <ProfileSection isCollapsed={false} />
          <Divider style={{ margin: '0' }} />
          
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ borderRight: 0 }}
          />
        </Drawer>

        <Layout style={{ 
          padding: '24px 24px', 
          marginLeft: screens.md ? (collapsed ? 80 : 200) : 0, 
          transition: 'all 0.2s' 
        }}>
          <Content style={{ padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG, minHeight: 280 }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Taton Company ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;