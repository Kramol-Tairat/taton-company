import { db } from './firebase';
import { getDoc, doc, addDoc, collection, serverTimestamp } from "firebase/firestore"; 
import { Card, Button, Avatar, Typography, Space, message, Input, Row, Col, Divider, Image } from 'antd';
import { UserOutlined, PictureOutlined, SendOutlined, LogoutOutlined, CloseCircleFilled } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';

const { TextArea } = Input;
const { Title, Text } = Typography;

function Home() {
  const token = localStorage.getItem('userid');
  const [username, setUsername] = useState("กำลังโหลด...");
  const [userData, setUserData] = useState();
  const [newText, setNewText] = useState(''); 
  const [loading, setLoading] = useState(false);
  
  // 1. เพิ่ม State สำหรับเก็บรูปที่จะ Preview
  const [previewImage, setPreviewImage] = useState(null);

  const postImgRef = useRef();

  // ฟังก์ชันจัดการเมื่อเลือกไฟล์
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500000) {
        message.error("ไฟล์รูปใหญ่เกินไป! กรุณาใช้รูปขนาดเล็กกว่า 500KB");
        e.target.value = null; // ล้างค่าใน input
        return;
      }
      
      // แปลงเป็น Base64 เพื่อใช้แสดง Preview และเตรียมบันทึก
      const base64 = await convertToBase64(file);
      setPreviewImage(base64); 
    }
  };

  // ฟังก์ชันยกเลิกรูปที่เลือก
  const handleRemoveImage = () => {
    setPreviewImage(null);
    if (postImgRef.current) postImgRef.current.value = "";
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const fetchData = async () => {
    if (!token) {
      window.location.href = "/";
      return;
    }
    try {
      const docRef = doc(db, "test_usercollection", token);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUsername(docSnap.data().username);
        setUserData(docSnap.data());
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const AddPost = async () => {
    if (!newText.trim() && !previewImage) return message.warning("กรุณากรอกข้อความหรือเลือกรูปภาพ");
    
    setLoading(true);
    try {
      await addDoc(collection(db, "post_collection"), {
        postowner: token,
        ownername: username,
        postinfo: newText,
        postimg: previewImage, // ใช้ค่าจาก state previewImage ได้เลย
        likes: [],
        timestamp: serverTimestamp(),
      });

      setNewText("");
      setPreviewImage(null); // ล้างรูปหลังโพสต์สำเร็จ
      if (postImgRef.current) postImgRef.current.value = "";
      message.success("โพสต์เรียบร้อยแล้ว!");
    } catch (err) {
      message.error("เกิดข้อผิดพลาดในการโพสต์");
    } finally {
      setLoading(false);
    }
  };

  return (
      <Row justify="center">
        {/* ทำ responsive xs คือจอเล็กที่สุด xl คือใหญ่สุด */}
        <Col xs={24} sm={22} md={16} lg={12} xl={10}> 
          
          <Card style={{ marginBottom: 16, borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space size="middle">
                <Avatar size={64} src={userData?.userimg} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <div>
                  <Title level={4} style={{ margin: 0 }}>สวัสดี, {username}</Title>
                  <Text type="secondary">ยินดีต้อนรับกลับมา</Text>
                </div>
              </Space>
              <Button danger icon={<LogoutOutlined />} onClick={Logout} type="text">ออกจากระบบ</Button>
            </div>
          </Card>

          <Card title="สร้างโพสต์ใหม่" style={{ borderRadius: 12 }}>
            <TextArea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              autoSize={{ minRows: 2, maxRows: 6 }}
              placeholder="วันนี้คุณคิดอะไรอยู่..."
              bordered={false}
              style={{ fontSize: '16px', padding: 0, marginBottom: 12 }}
            />

            {/* --- ส่วนแสดงรูป Preview --- */}
            {previewImage && (
              <div style={{ position: 'relative', marginBottom: 15, textAlign: 'center' }}>
                <Image
                  src={previewImage}
                  alt="Preview"
                  style={{ borderRadius: 8, maxHeight: 300, objectFit: 'cover' }}
                />
                <Button 
                  type="primary"
                  danger
                  shape="circle"
                  icon={<CloseCircleFilled />}
                  size="small"
                  onClick={handleRemoveImage}
                  style={{ position: 'absolute', top: 5, right: 5 }}
                />
              </div>
            )}
            
            <Divider style={{ margin: '12px 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, color: '#595959' }}>
                  <PictureOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
                  <span>รูปภาพ</span>
                  <input 
                    type="file" 
                    ref={postImgRef} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleFileChange} // เปลี่ยนมาใช้ฟังก์ชัน handleFileChange
                  />
                </label>
              </Space>
              
              <Button 
                type="primary" 
                shape="round" 
                icon={<SendOutlined />} 
                onClick={AddPost}
                loading={loading}
              >
                โพสต์
              </Button>
            </div>
          </Card>

          <Divider>ฟีดข่าวของคุณ</Divider>
        </Col>
      </Row>
  
  );
}

export default Home;