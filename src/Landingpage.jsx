import React from 'react';
import { Layout, Typography, Button, Row, Col, Card } from 'antd';
import { RocketOutlined, SafetyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const LandingPage = () => {
  const navigate = useNavigate();
  let headerSection;
  const token = localStorage.getItem('userid');
  const tokenusername = localStorage.getItem('username');
  if (token) {
    headerSection = (
    <div className="header">
      <h1>{tokenusername}</h1>
    </div>
  );
    // window.location.href = "/home";
  }else {
        headerSection = (
          <>
          <Button type="text" onClick={() => navigate('/login')} style={{ fontWeight: '500' }}>
            เข้าสู่ระบบ
          </Button>
          <Button type="primary" onClick={() => navigate('/register')} style={{ marginLeft: '10px', borderRadius: '6px' }}>
            สมัครสมาชิก
          </Button>
          </>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      
      {/* --- 1. Header (Navbar) --- */}
      <Header 
        style={{ 
          background: '#fff', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '0 50px', 
          boxShadow: '0 2px 8px #f0f1f2',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        <div style={{ fontSize: '24px', fontWeight: '900', color: '#076fd0', letterSpacing: '1px' }}>
          TATON COMPANY
        </div>
        <div>
          {headerSection}
        </div>
      </Header>

      <Content>
        {/* --- 2. Hero Section (ส่วนแรกที่คนเห็น) --- */}
        <div style={{ 
          padding: '120px 20px', 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)' 
        }}>
          <Title level={1} style={{ fontSize: '3.5rem', color: '#1f1f1f', marginBottom: '24px' }}>
            ยินดีต้อนรับเข้าสู้เว็บไซต์ <br/> <span style={{ color: '#076fd0' }}>Taton Company</span>
          </Title>
          <Paragraph style={{ fontSize: '1.2rem', color: '#666', maxWidth: '650px', margin: '0 auto 40px' }}>
            แพลตฟอร์มโซเชียลที่ช่วยให้คุณแบ่งปันเรื่องราว รูปภาพ และพูดคุยกับเพื่อนๆ ได้อย่างง่ายดาย ปลอดภัย และรวดเร็วที่สุด
          </Paragraph>
          <Button 
            type="primary" 
            size="large" 
            onClick={() => navigate('/register')} 
            style={{ height: '56px', padding: '0 48px', fontSize: '1.2rem', borderRadius: '28px', boxShadow: '0 4px 14px 0 rgba(7,111,208,0.39)' }}
          >
            เริ่มต้นใช้งานฟรี
          </Button>
        </div>

        {/* --- 3. Features Section (จุดเด่น) --- */}
        <div style={{ padding: '80px 20px', background: '#fff', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Title level={2}>ทำไมต้องเลือกใช้แอปของเรา?</Title>
            <Paragraph style={{ color: '#888', fontSize: '1.1rem' }}>ฟีเจอร์ที่ออกแบบมาเพื่อประสบการณ์ที่ดีที่สุดของคุณ</Paragraph>
          </div>
          
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} hoverable style={{ textAlign: 'center', background: '#fafafa', borderRadius: '16px', height: '100%' }}>
                <RocketOutlined style={{ fontSize: '48px', color: '#076fd0', marginBottom: '24px' }} />
                <Title level={4}>รวดเร็ว ทันใจ</Title>
                <Paragraph style={{ color: '#666' }}>อัปโหลดรูปภาพและโพสต์ข้อความได้ทันที โหลดฟีดข่าวลื่นไหลไม่มีสะดุด</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} hoverable style={{ textAlign: 'center', background: '#fafafa', borderRadius: '16px', height: '100%' }}>
                <SafetyOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '24px' }} />
                <Title level={4}>ปลอดภัย 100%</Title>
                <Paragraph style={{ color: '#666' }}>ข้อมูลส่วนตัวและรหัสผ่านของคุณถูกเข้ารหัสและเก็บรักษาอย่างปลอดภัย</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} hoverable style={{ textAlign: 'center', background: '#fafafa', borderRadius: '16px', height: '100%' }}>
                <ThunderboltOutlined style={{ fontSize: '48px', color: '#faad14', marginBottom: '24px' }} />
                <Title level={4}>ใช้งานง่าย</Title>
                <Paragraph style={{ color: '#666' }}>ดีไซน์สะอาดตา (Clean UI) จัดวางเมนูเป็นระเบียบ ไม่ว่าใครก็ใช้งานได้ทันที</Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      {/* --- 4. Footer --- */}
      <Footer style={{ textAlign: 'center', background: '#001529', color: 'rgba(255,255,255,0.65)', padding: '60px 20px 40px' }}>
        <Title level={4} style={{ color: '#fff', marginBottom: '16px' }}>TATON COMPANY</Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.45)' }}>
          ระบบนี้พัฒนาด้วย React.js, Ant Design และ Firebase
        </Paragraph>
        <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          © {new Date().getFullYear()} Taton Company. All rights reserved.
        </div>
      </Footer>
      
    </Layout>
  );
};

export default LandingPage;