import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Avatar, Image, Typography, Space, Popconfirm, message, Input } from 'antd';
import { DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { db } from './firebase';
import {  deleteDoc, doc, updateDoc } from 'firebase/firestore';

const { TextArea } = Input;

const editPage = () => {
  const location = useLocation(); // 1. เรียกใช้ Hook เพื่อดูข้อมูลใน URL/State
  const navigate = useNavigate();

  const receivedData = location.state;
  const [loading, setLoading] = useState(false);
  const [newText, setNewText] = useState(receivedData.text ? receivedData.text : '');

  if (!receivedData) {
    return <div>ไม่พบข้อมูล (คุณอาจพิมพ์ URL เข้ามาตรงๆ)</div>;
  }
const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "post_collection", id));
      
      message.success("ลบโพสต์สำเร็จ");
      
      // เปลี่ยนจากการเรียก fetchData() เป็นการสั่งถอยกลับหน้าก่อนหน้า
      // หรือ navigate('/home'); ตามความเหมาะสมของโปรเจกต์คุณ
      navigate(-1); 
      
    } catch (error) {
      console.error("Delete Error:", error);
      message.error("ลบไม่สำเร็จ: " + error.message);
    } finally {
      setLoading(false);
    }
  };
    const handleSubmit = async (id) => {
      try {
      setLoading(true);
      const docRef = doc(db, "post_collection", id);
      // สั่งอัปเดตเฉพาะ field "text"
      await updateDoc(docRef, {
        postinfo: newText,
        // updated_at: new Date() // (Optional) ถ้าอยากเก็บเวลาแก้ไขล่าสุดด้วย ให้เปิดบรรทัดนี้
      });

      message.success("แก้ไขโพสต์สำเร็จ");
      navigate(-1); // บันทึกเสร็จให้ย้อนกลับไปหน้าก่อนหน้า (หรือจะ redirect ไปหน้า Home)
      } catch (error) {
        message.error("ลบไม่สำเร็จ: " + error.message);
      } finally {
        setLoading(false);
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
          <Card
            key={receivedData.id}
            bordered={false} // <--- จุดสำคัญ: ปิดเส้นขอบ
            style={{ 
              marginBottom: 24, 
              borderRadius: '12px', // มุมโค้งมน
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)' // เงาบางๆ ให้ดูลอยขึ้นมา
            }}
            actions={[ // ปุ่มด้านล่าง Card
              <Button
                title="แก้ไขเสร็จสิ้น?"
                onClick={() => handleSubmit(receivedData.id)}
                okText="ใช่"
                cancelText="ไม่"
              >
                <CheckOutlined key="submit" style={{ color: 'green' }} />
              </Button>,
                            <Popconfirm
                title="ลบโพสต์นี้?"
                onConfirm={() => handleDelete(receivedData.id)}
                okText="ลบ"
                cancelText="ยกเลิก"
              >
                <DeleteOutlined key="delete" style={{ color: 'red' }} />
              </Popconfirm>
            ]}
          >
            {/* ส่วนหัว Card (รูปโปรไฟล์ + ชื่อ + เวลา) */}
            <Card.Meta
              avatar={<Avatar src={receivedData.userimg} // ใส่ลิงก์รูปตรงนี้
                              icon={"<UserOutlined />"}      // ถ้าไม่มีรูป หรือรูปเสีย มันจะโชว์ไอคอนนี้แทน (Fallback)
                              style={{ backgroundColor: '#fde3cf', color: '#f56a00' }} 
                      />}
              title={receivedData.ownername || "ไม่ระบุชื่อ"}
              // description={
              //   <Space>
              //     <ClockCircleOutlined style={{ fontSize: '12px' }} />
              //     <span style={{ fontSize: '12px' }}>{formatTime(receivedData.time)}</span>
              //   </Space>
              // }
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

            {/* ส่วนรูปภาพ (ถ้ามี) */}
            {receivedData.img && (
              <div style={{ marginTop: '16px' }}>
                <Image
                  src={receivedData.img}
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
    </div>
  );
};

export default editPage;