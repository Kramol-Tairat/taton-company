import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Avatar, Image, Typography, Space, Popconfirm, message, Skeleton, Empty } from 'antd';
import { DeleteOutlined, EditOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { db } from './firebase';
import { collection, getDocs, getDoc, deleteDoc, doc } from 'firebase/firestore';

const { Text, Title } = Typography;

const editPage = () => {
  const location = useLocation(); // 1. เรียกใช้ Hook เพื่อดูข้อมูลใน URL/State
  const navigate = useNavigate();

  const receivedData = location.state;

  if (!receivedData) {
    return <div>ไม่พบข้อมูล (คุณอาจพิมพ์ URL เข้ามาตรงๆ)</div>;
  }
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
            <div style={{ marginTop: '16px', fontSize: '16px', lineHeight: '1.6' }}>
              {receivedData.text}
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