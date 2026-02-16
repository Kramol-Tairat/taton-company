import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Empty, Button, Avatar, Image, Typography, Space, Popconfirm, message, Input, Skeleton } from 'antd';
import { ArrowLeftOutlined, CheckOutlined, ClockCircleOutlined, UserOutlined} from '@ant-design/icons';
import { db } from './firebase';
import { getDocs, addDoc, collection, serverTimestamp, query,  where, getDoc, doc } from 'firebase/firestore';

const { TextArea } = Input;

const commentPage = () => {

  const token = localStorage.getItem('userid');
  const location = useLocation();
  const navigate = useNavigate();

  const receivedData = location.state;
  const [loading, setLoading] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [OwnerData, setOwnerData] = useState([]);
  const [newText, setNewText] = useState(''); 
  let MyuserImg = '';
  let MyuserName = '';

        const GetOwnerData = async () => {
            const userDocRef = doc(db, "test_usercollection", token); //ระบุตำแหน่ง doc
            const userDocSnap = await getDoc(userDocRef); //ดึงข้อมูล
            if (userDocSnap.exists()) {//เช็คว่ามีอยู่ไหม
              MyuserImg = userDocSnap.data().userimg; //เอาข้อมูลยัดลง userImg ที่สร้างไว้
              MyuserName = userDocSnap.data().username;
            }
            setOwnerData({
              OwnerImage: MyuserImg,
              OwnerName: MyuserName,
            });
        };

  if (!token) {
      window.location.href = "/";
      return null;
  }else {
    GetOwnerData();
  };

  if (!receivedData) {
    return <div>ไม่พบข้อมูล (คุณอาจพิมพ์ URL เข้ามาตรงๆ)</div>;
  }

  const fetchData = async () => {
          setLoading(true);
          try {
            const CommentCollection = collection(db, "comment_collection")
            const q = query(CommentCollection, where("commentpost", "==", receivedData.id));
            const querySnapshot = await getDocs(q);
  
            // ใช้ Promise.all เพื่อรอให้ดึงรูปโปรไฟล์ของทุกโพสต์เสร็จพร้อมกัน
            const comment = await Promise.all(
              querySnapshot.docs.map(async (commentDoc) => {
                const commentData = commentDoc.data();
                let userImg = null;
                let userName = "ไม่ระบุชื่อ";
        
                // ดึงรูปโปรไฟล์จาก test_usercollection โดยใช้ commentowner
                if (commentData.commentowner) {
                  const userDocRef = doc(db, "test_usercollection", commentData.commentowner); //ระบุตำแหน่ง doc
                  const userDocSnap = await getDoc(userDocRef); //ดึงข้อมูล
                  if (userDocSnap.exists()) {//เช็คว่ามีอยู่ไหม
                    userImg = userDocSnap.data().userimg; //เอาข้อมูลยัดลง userImg ที่สร้างไว้
                    userName = userDocSnap.data().username;
                  }
                }
  
                return {
                  id: commentData.id,
                  ...commentData,
                  userimg: userImg,
                  username: userName,
                }; //return ค่ากลับไปยังตัวแปร postsWithUserImg
              })
            );
  
            // เรียงลำดับตามเวลา
            comment.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)); // นำเวสาตัวแรก(a)ของ array มาลบ กับตัวที่สอง (b) ลบไปเรื่อยๆ  ถ้าเป็นลบจะเรียงจากมากไปน้อย แบบ b -(ถึง) a , a-b ก็จะน้อยไปมาก
            setCommentList(comment);
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

  const handleSubmit = async (id) => {
    try {
      await addDoc(collection(db, "comment_collection"), {
        commentowner: token,
        commentpost: id,
        commentText: newText,
        timestamp: serverTimestamp(),
      });

    } catch (error) {
      message.error("คอมเมนท์ไม่สำเร็จมีบางอย่างผิดพลาด");
    } finally {
      navigate('/MainPage');
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
            key={token}
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
                <ArrowLeftOutlined key="delete" style={{ color: 'red' }} />
              </Popconfirm>
            ]}
          >
            <Card.Meta
              avatar={<Avatar src={OwnerData.OwnerImage} // ใส่ลิงก์รูปตรงนี้
                              icon={<UserOutlined />}      // ถ้าไม่มีรูป หรือรูปเสีย มันจะโชว์ไอคอนนี้แทน (Fallback)
                              style={{ backgroundColor: '#fde3cf', color: '#f56a00' }} 
                      />}
              title={OwnerData.OwnerName || "ไม่ระบุชื่อ"}
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
            {/* ส่วนแสดงรายการคอมเมนต์ */}
          {loading ? ( // เช็คว่าโหลดอยู่ไหม ถ้าโหลดให้ไปต่อ
        // แสดง Skeleton ตอนโหลด
            <Card bordered={false} style={{ marginBottom: 16 }}><Skeleton avatar active /></Card>
          ) : commentList.length === 0 ? ( //เช็คว่ามีข้อมูลหรือไม่โดยเช็คข้อมูลภายในอาเรย์
            <Empty description="ยังไม่มีโพสต์" />
          ) : ( commentList.map((item) => (
          <Card
            key={item.id}
            bordered={false} // <--- จุดสำคัญ: ปิดเส้นขอบ
            style={{ 
              marginBottom: 0, 
              borderRadius: '12px', // มุมโค้งมน
            }}
          >
            <Card.Meta
              avatar={<Avatar src={item.userimg} // ใส่ลิงก์รูปตรงนี้
                              icon={<UserOutlined />}      // ถ้าไม่มีรูป หรือรูปเสีย มันจะโชว์ไอคอนนี้แทน (Fallback)
                              style={{ backgroundColor: '#fde3cf', color: '#f56a00' }} 
                      />}
              title={item.username || "ไม่ระบุชื่อ"}
              description={
                <Space>
                  <ClockCircleOutlined style={{ fontSize: '12px' }} />
                  <span style={{ fontSize: '12px' }}>{formatTime(item.timestamp)}</span>
                </Space>
              }
            />

            {/* ส่วนเนื้อหาข้อความ */}
            <div style={{ marginTop: '16px' }}>
              {item.commentText}
            </div>
          </Card>))
        )}
    </div>
  );
};

export default commentPage;