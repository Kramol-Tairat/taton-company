import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, limit } from "firebase/firestore"; 
import { Input, Button, message } from 'antd';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  // Use State instead of document.getElementById
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const postImgRef = useRef();

  // Redirect if logged in
  useEffect(() => {
    const token = localStorage.getItem('userid');
    if (token) navigate("/home");
  }, [navigate]);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addData = async () => {
    const { username, password, email } = formData;
    
    if (!username || !password || !email) {
      return message.error("กรุณากรอกข้อมูลให้ครบถ้วน");
    }

    try {
      let imageBase64 = "";
      const file = postImgRef.current.input.files[0]; // AntD Input ref structure

      if (file) {
        if (file.size > 500000) { 
          return message.warning("ไฟล์รูปใหญ่เกินไป! กรุณาใช้รูปขนาดเล็กกว่า 500KB");
        }
        imageBase64 = await convertToBase64(file);
      }

      // 1. Efficient Check: Query only for matching username
      const userQuery = query(collection(db, "test_usercollection"), where("username", "==", username), limit(1));
      const emailQuery = query(collection(db, "test_usercollection"), where("useremail", "==", email), limit(1));
      
      const [userSnap, emailSnap] = await Promise.all([getDocs(userQuery), getDocs(emailQuery)]);

      if (!userSnap.empty) return message.error("ชื่อผู้ใช้ซ้ำ");
      if (!emailSnap.empty) return message.error("อีเมลนี้ถูกใช้งานแล้ว");

      // 2. Add Document
      const docRef = await addDoc(collection(db, "test_usercollection"), {
        username: username,
        password: password, // Note: In a real app, never store plain-text passwords!
        useremail: email,
        userimg: imageBase64,
        status: "USER",
        timestamp: new Date()
      });

      message.success("สมัครสมาชิกสำเร็จ!");
      navigate("/");
      
    } catch (e) {
      console.error("Error adding document: ", e);
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px' }}>
      <h1>Register</h1>
      <Input 
        name="username"
        placeholder='ชื่อผู้ใช้' 
        style={{ width: '40%', marginBottom: '10px' }} 
        onChange={handleInputChange} 
      />
      <Input.Password 
        name="password"
        placeholder='รหัสผ่าน' 
        style={{ width: '40%', marginBottom: '10px' }} 
        onChange={handleInputChange} 
      />
      <Input 
        name="email"
        type="email" 
        placeholder='อีเมล' 
        style={{ width: '40%', marginBottom: '10px' }} 
        onChange={handleInputChange} 
      />
      
      <div style={{ width: '40%', margin: '10px 0' }}>
        <p>รูปโปรไฟล์ (ไม่เกิน 500KB):</p>
        <Input type="file" ref={postImgRef} accept="image/*" />
      </div>

      <Button type="primary" onClick={addData} size="large">
        ลงชื่อเข้าใช้
      </Button>
    </div>
  );
}

export default Register;