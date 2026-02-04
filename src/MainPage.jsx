import React, { useEffect, useState } from 'react';
import { Card, Button, Avatar, Image, Typography, Space, Popconfirm, message, Skeleton, Empty } from 'antd';
import { DeleteOutlined, EditOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { db } from './firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const { Text, Title } = Typography;

const MainPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. ส่วนดึงข้อมูล (Logic เดิม)
  const fetchData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "post_collection"));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      // เรียงจาก ใหม่ -> เก่า
      items.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setData(items);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "post_collection", id));
      message.success("ลบโพสต์สำเร็จ");
      fetchData();
    } catch (error) {
      message.error("ลบไม่สำเร็จ");
    }
  };

  // 2. ฟังก์ชันแปลงเวลาให้สวยงาม
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleString('th-TH', {
      day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}> {/* จัดกึ่งกลางหน้าจอ */}
      
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
        <Title level={3}>ฟีดข่าวสาร</Title>
        <Button onClick={fetchData}>รีเฟรช</Button>
      </div>

      {loading ? (
        // แสดง Skeleton ตอนโหลด
        <Card bordered={false} style={{ marginBottom: 16 }}><Skeleton avatar active /></Card>
      ) : data.length === 0 ? (
        <Empty description="ยังไม่มีโพสต์" />
      ) : (
        // 3. วนลูปข้อมูลสร้าง Card
        data.map((item) => (
          <Card
            key={item.id}
            bordered={false} // <--- จุดสำคัญ: ปิดเส้นขอบ
            style={{ 
              marginBottom: 24, 
              borderRadius: '12px', // มุมโค้งมน
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)' // เงาบางๆ ให้ดูลอยขึ้นมา
            }}
            actions={[ // ปุ่มด้านล่าง Card
              <Popconfirm
                title="ลบโพสต์นี้?"
                onConfirm={() => handleDelete(item.id)}
                okText="ลบ"
                cancelText="ยกเลิก"
              >
                <DeleteOutlined key="delete" style={{ color: 'red' }} />
              </Popconfirm>
            ]}
          >
            {/* ส่วนหัว Card (รูปโปรไฟล์ + ชื่อ + เวลา) */}
            <Card.Meta
              avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />}
              title={item.ownername || "ไม่ระบุชื่อ"}
              description={
                <Space>
                  <ClockCircleOutlined style={{ fontSize: '12px' }} />
                  <span style={{ fontSize: '12px' }}>{formatTime(item.timestamp)}</span>
                </Space>
              }
            />

            {/* ส่วนเนื้อหาข้อความ */}
            <div style={{ marginTop: '16px', fontSize: '16px', lineHeight: '1.6' }}>
              {item.postinfo}
            </div>

            {/* ส่วนรูปภาพ (ถ้ามี) */}
            {item.postimg && (
              <div style={{ marginTop: '16px' }}>
                <Image
                  src={item.postimg}
                  alt="Post Image"
                  style={{ 
                    borderRadius: '8px', 
                    maxHeight: '400px', 
                    objectFit: 'cover',
                    width: '100%' 
                  }}
                />
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
};

export default MainPage;