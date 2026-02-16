import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Avatar, Image, Typography, Space, Popconfirm, message, Input } from 'antd';
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { db } from './firebase';
import {  addDoc, collection } from 'firebase/firestore';

const { TextArea } = Input;

const commentPage = () => {

  const token = localStorage.getItem('userid');
  const location = useLocation();
  const navigate = useNavigate();

  if (!token) {
      window.location.href = "/";
      return;
  };

  const receivedData = location.state;
  const [loading, setLoading] = useState(false);
  const [newText, setNewText] = useState(receivedData.text ? receivedData.text : '');

  if (!receivedData) {
    return <div>ไม่พบข้อมูล (คุณอาจพิมพ์ URL เข้ามาตรงๆ)</div>;
  }
  const handleSubmit = async (id) => {
    try {
      await addDoc(collection(db, "comment_collection"), {
        commentowner: token,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      message.error("คอมเมนท์ไม่สำเร็จมีบางอย่างผิดพลาด");
    } finally {
      setLoading(false);
    }
  };
    const handleCancel = () => {
      navigate(-1);
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
          <Card
            key={receivedData.id}
            bordered={false} // <--- จุดสำคัญ: ปิดเส้นขอบ
            style={{ 
              marginBottom: 24, 
              borderRadius: '12px', // มุมโค้งมน
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)' // เงาบางๆ ให้ดูลอยขึ้นมา
            }}
            actions={[ // ปุ่มด้านล่าง Card
              <Popconfirm
                title="แก้ไขเสร็จสิ้น?"
                onConfirm={() => handleSubmit(receivedData.id)}
                okText="ใช่"
                cancelText="ไม่"
              >
                <CheckOutlined key="submit" style={{ color: 'green' }} />
              </Popconfirm>,
                            <Popconfirm
                title="ยกเลิก?"
                onConfirm={() => handleCancel()}
                okText="ใช่"
                cancelText="ไม่ "
              >
                <DeleteOutlined key="delete" style={{ color: 'red' }} />
              </Popconfirm>
            ]}
          >
            <Card.Meta
              avatar={<Avatar src={receivedData.userimg} // ใส่ลิงก์รูปตรงนี้
                              icon={"<UserOutlined />"}      // ถ้าไม่มีรูป หรือรูปเสีย มันจะโชว์ไอคอนนี้แทน (Fallback)
                              style={{ backgroundColor: '#fde3cf', color: '#f56a00' }} 
                      />}
              title={receivedData.ownername || "ไม่ระบุชื่อ"}
            />

            {/* ส่วนเนื้อหาข้อความ */}
            <div style={{ marginTop: '16px' }}>
              <TextArea 
                value={newText} 
                onChange={(e) => setNewText(e.target.value)} // อัปเดต State เมื่อพิมพ์
                autoSize={{ minRows: 3, maxRows: 10 }} // ปรับขนาดอัตโนมัติ
                placeholder="แก้ไขข้อความของคุณ..."
                style={{ fontSize: '16px', borderRadius: '8px' }}
              />
            </div>
          </Card>
    </div>
  );
};

export default commentPage;