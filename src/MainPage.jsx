import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Avatar, Image, Typography, Space, Popconfirm, message, Skeleton, Empty } from 'antd';
import { EditOutlined, ClockCircleOutlined, CommentOutlined, HeartOutlined, HeartFilled, UserOutlined } from '@ant-design/icons';
import { db } from './firebase';
import { collection, getDocs, getDoc, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove} from 'firebase/firestore';

const { Title } = Typography;

const MainPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userid'); // ดึง ID ผู้ใช้มารอไว้เลย

  // 1. ส่วนดึงข้อมูล
  const fetchData = async () => {
        setLoading(true);
        try {
          const querySnapshot = await getDocs(collection(db, "post_collection"));
          
          // ใช้ Promise.all เพื่อรอให้ดึงรูปโปรไฟล์ของทุกโพสต์เสร็จพร้อมกัน
          const postsWithUserImg = await Promise.all(
            querySnapshot.docs.map(async (postDoc) => {
              const postData = postDoc.data();
              let userImg = null;

              // ดึงรูปโปรไฟล์จาก test_usercollection โดยใช้ postowner
              if (postData.postowner) {
                const userDocRef = doc(db, "test_usercollection", postData.postowner); 
                const userDocSnap = await getDoc(userDocRef); 
                if (userDocSnap.exists()) {
                  userImg = userDocSnap.data().userimg; 
                }
              }

              return {
                id: postDoc.id,
                ...postData,
                userimg: userImg,
                // --- แก้ไขจุดที่ 1: ป้องกัน Error ถ้าไม่มี likes ให้ใส่ [] แทน ---
                likes: Array.isArray(postData.likes) ? postData.likes : [] 
              }; 
            })
          );

          // เรียงลำดับตามเวลา
          postsWithUserImg.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)); 
          setData(postsWithUserImg);
        } catch (error) {
          console.error("Error fetching posts:", error);
          message.error("โหลดข้อมูลไม่สำเร็จ");
        } finally {
          setLoading(false);
        }
      };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (postData) => {
    navigate('/editPage', { 
      state: { 
        id: postData.id,
        postowner: postData.postowner,
        ownername: postData.ownername,
        text: postData.postinfo,
        time: postData.timestamp,
        img: postData.postimg,
        userimg: postData.userimg
      } 
    });
  };

  const handleComment = (postData) => {
    navigate('/CommentPage', { 
      state: { 
        id: postData.id,
        userimg: postData.userimg,
        postimg: postData.postimg,
        postinfo: postData.postinfo,
        timestamp: postData.timestamp,
        ownername: postData.ownername,
      } 
    });
  };

  const handleLike = async (post) => {
    if (!currentUserId) {
      message.warning("กรุณาล็อกอินก่อนกดไลค์");
      return;
    }

    // --- แก้ไขจุดที่ 2: ใช้ Optional Chaining ?. ป้องกัน Error ---
    const isLiked = post.likes?.includes(currentUserId);
    const postRef = doc(db, "post_collection", post.id);

    // อัปเดต UI ทันที (Optimistic Update) เพื่อความลื่นไหล
    const newData = data.map(item => {
        if (item.id === post.id) {
            let newLikes = [...item.likes];
            if (isLiked) {
                newLikes = newLikes.filter(id => id !== currentUserId);
            } else {
                newLikes.push(currentUserId);
            }
            return { ...item, likes: newLikes };
        }
        return item;
    });
    setData(newData);

    try {
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUserId)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUserId)
        });
      }
      // ไม่ต้อง fetchData() ซ้ำแล้วเพราะเราอัปเดต UI ไปแล้วข้างบน
    } catch (error) {
      console.error("Like Error:", error);
      message.error("เกิดข้อผิดพลาดในการกดไลค์");
      fetchData(); // ถ้า Error ให้โหลดข้อมูลจริงกลับมาคืน
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    if (typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toLocaleString('th-TH', {
          day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit'
        });
    }
    return '';
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}> 
      
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>ฟีดข่าวสาร</Title>
        <Button onClick={fetchData}>รีเฟรช</Button>
      </div>

      {loading ? (
        <Card bordered={false} style={{ marginBottom: 16 }}><Skeleton avatar active /></Card>
      ) : data.length === 0 ? ( 
        <Empty description="ยังไม่มีโพสต์" />
      ) : (
        data.map((item) => (
          <Card
            key={item.id}
            bordered={false} 
            style={{ 
              marginBottom: 24, 
              borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)' 
            }}
            actions={[ 
              <Button type="text" onClick={() => handleLike(item)} key="like">
                {/* --- แก้ไขจุดที่ 3: เช็ค Array.isArray หรือใช้ ?. เพื่อความชัวร์ --- */}
                {Array.isArray(item.likes) && item.likes.includes(currentUserId) ? (
                    <HeartFilled style={{ color: 'red' }} /> 
                ) : (
                    <HeartOutlined /> 
                )}
                <span style={{ marginLeft: 8 }}>
                    {Array.isArray(item.likes) ? item.likes.length : 0}
                </span>
              </Button>,
              <Popconfirm
                title="แก้ไขโพสต์นี้?"
                onConfirm={() => handleEdit(item)}
                okText="แก้ไข"
                cancelText="ยกเลิก"
                disabled={item.postowner !== currentUserId} // ปิดการกดถ้าไม่ใช่เจ้าของโพสต์
              >
                {/* แสดงปุ่มแก้ไขเฉพาะเจ้าของโพสต์ (Optional) */}
                <Button type="text" disabled={item.postowner !== currentUserId}>
                    <EditOutlined key="edit" style={{ color: item.postowner === currentUserId ? '#faad14' : 'gray' }} />
                </Button>
              </Popconfirm>,
              <Button type="text" onClick={() => handleComment(item)} key="comment">
                <CommentOutlined style={{ color: '#1890ff' }} />
              </Button>
            ]}
          >
            <Card.Meta
              avatar={<Avatar src={item.userimg} icon={<UserOutlined />} style={{ backgroundColor: '#fde3cf', color: '#f56a00' }} />}
              title={item.ownername || "ไม่ระบุชื่อ"}
              description={
                <Space>
                  <ClockCircleOutlined style={{ fontSize: '12px' }} />
                  <span style={{ fontSize: '12px' }}>{formatTime(item.timestamp)}</span>
                </Space>
              }
            />

            <div style={{ marginTop: '16px', fontSize: '16px', lineHeight: '1.6' }}>
              {item.postinfo}
            </div>

            {item.postimg && (
              <div style={{ marginTop: '16px' }}>
                <Image
                  src={item.postimg}
                  alt="Post Image"
                  style={{ borderRadius: '8px', maxHeight: '400px', objectFit: 'cover', width: '100%' }}
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