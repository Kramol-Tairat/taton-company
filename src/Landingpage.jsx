import React from 'react';
import { Layout, Typography, Button, Row, Col, Card, Space } from 'antd';
import { RocketOutlined, SafetyOutlined, ThunderboltOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const LandingPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('userid');
  const tokenusername = localStorage.getItem('username');

  // ส่วนแสดงผลปุ่มบน Header
  const headerSection = token ? (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{tokenusername}</span>
      <Button type="primary" size="small" onClick={() => navigate('/home')}>ไปที่หน้าหลัก</Button>
    </div>
  ) : (
    <Space>
      <Button type="text" onClick={() => navigate('/login')} style={{ fontWeight: '500' }}>
        เข้าสู่ระบบ
      </Button>
      <Button 
        type="primary" 
        onClick={() => navigate('/register')} 
        style={{ borderRadius: '6px' }}
        className="hide-mobile" // เราสามารถใช้ CSS ซ่อนในจอเล็กมากได้
      >
        สมัครสมาชิก
      </Button>
    </Space>
  );

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      
      {/* --- 1. Header (Responsive Navbar) --- */}
      <Header 
        style={{ 
          background: '#fff', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '0 5%', // ใช้ % แทน px เพื่อความยืดหยุ่น
          boxShadow: '0 2px 8px #f0f1f2',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        <div style={{ 
          fontSize: 'clamp(18px, 4vw, 24px)', // ปรับขนาดตัวอักษรตามขนาดจอ
          fontWeight: '900', 
          color: '#076fd0', 
          letterSpacing: '1px',
          whiteSpace: 'nowrap' 
        }}>
          TATON COMPANY
        </div>
        <div>
          {headerSection}
        </div>
      </Header>

      <Content>
        {/* --- 2. Hero Section --- */}
        <div style={{ 
          padding: 'clamp(60px, 10vw, 120px) 20px', // ลด Padding บนมือถืออัตโนมัติ
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)' 
        }}>
          <Title level={1} style={{ 
            fontSize: 'clamp(2rem, 8vw, 3.5rem)', // ปรับขนาดตามจอ
            color: '#1f1f1f', 
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            ยินดีต้อนรับเข้าสู่เว็บไซต์ <br/> 
            <span style={{ color: '#076fd0' }}>Taton Company</span>
          </Title>
          <Paragraph style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
            color: '#666', 
            maxWidth: '650px', 
            margin: '0 auto 40px' 
          }}>
            แพลตฟอร์มโซเชียลที่ช่วยให้คุณสอบถามข้อมูล และเปลี่ยนความเห็น เกี่ยวกับ ด้านไอที และ เทคโนโลยีคอมพิวเตอร์ด้านต่างๆ จากผู้ใช้อื่น ได้อย่างง่ายดาย ปลอดภัย และรวดเร็วที่สุด
          </Paragraph>
          <Button 
            type="primary" 
            size="large" 
            onClick={() => navigate('/register')} 
            style={{ 
              height: 'auto', 
              padding: '12px 40px', 
              fontSize: '1.1rem', 
              borderRadius: '28px', 
              boxShadow: '0 4px 14px 0 rgba(7,111,208,0.39)',
              whiteSpace: 'normal' // กันข้อความตัดในมือถือ
            }}
          >
            เริ่มต้นใช้งานฟรี
          </Button>
        </div>

        {/* --- 3. Features Section --- */}
        <div style={{ padding: '60px 20px', background: '#fff', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Title level={2} style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>ทำไมต้องเลือกใช้แอปของเรา?</Title>
            <Paragraph style={{ color: '#888' }}>ฟีเจอร์ที่ออกแบบมาเพื่อประสบการณ์ที่ดีที่สุดของคุณ</Paragraph>
          </div>
          
          {/* gutter={[horizontal, vertical]} - ใส่ vertical gutter เพื่อให้ Card ไม่ติดกันเมื่อ stack */}
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} hoverable style={{ textAlign: 'center', background: '#fafafa', borderRadius: '16px', height: '100%' }}>
                <RocketOutlined style={{ fontSize: '40px', color: '#076fd0', marginBottom: '20px' }} />
                <Title level={4}>รวดเร็ว ทันใจ</Title>
                <Paragraph style={{ color: '#666' }}>อัปโหลดรูปภาพและโพสต์ข้อความได้ทันที โหลดฟีดข่าวลื่นไหลไม่มีสะดุด</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} hoverable style={{ textAlign: 'center', background: '#fafafa', borderRadius: '16px', height: '100%' }}>
                <SafetyOutlined style={{ fontSize: '40px', color: '#52c41a', marginBottom: '20px' }} />
                <Title level={4}>ปลอดภัย 100%</Title>
                <Paragraph style={{ color: '#666' }}>ข้อมูลส่วนตัวและรหัสผ่านของคุณถูกเข้ารหัสและเก็บรักษาอย่างปลอดภัย</Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} hoverable style={{ textAlign: 'center', background: '#fafafa', borderRadius: '16px', height: '100%' }}>
                <ThunderboltOutlined style={{ fontSize: '40px', color: '#faad14', marginBottom: '20px' }} />
                <Title level={4}>ใช้งานง่าย</Title>
                <Paragraph style={{ color: '#666' }}>ดีไซน์สะอาดตา จัดวางเมนูเป็นระเบียบ ไม่ว่าใครก็ใช้งานได้ทันที</Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      {/* --- 4. Footer --- */}
      <Footer style={{ textAlign: 'center', background: '#001529', color: 'rgba(255,255,255,0.65)', padding: '40px 20px' }}>
        <Title level={4} style={{ color: '#fff', marginBottom: '16px' }}>TATON COMPANY</Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '0' }}>
          ระบบนี้พัฒนาด้วย React.js, Ant Design และ Firebase
        </Paragraph>
        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', fontSize: '12px' }}>
          © {new Date().getFullYear()} Taton Company. All rights reserved.
        </div>
      </Footer>
      
    </Layout>
  );
};

export default LandingPage;