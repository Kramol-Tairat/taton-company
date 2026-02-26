import { db } from './firebase';
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { Input } from 'antd';
import { useRef } from 'react';

function Register() {
  const token = localStorage.getItem('userid');
  const Value1 = "ชื่อผู้ใช้ซ้ำ", Value2 = "อีเมลซ้ำ", Value3 = "nothing";
  
  if (token) {
    window.location.href = "/home";
  }       

  const profileImgRef = useRef();

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const addData = async () => {
    try {
      // แก้ไข ID ให้ตรงกับ Input
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const email = document.getElementById("email").value; // แก้จาก "username" เป็น "email"
      
      let status = Value3;
      let imageBase64 = ""; // ประกาศไว้ใน scope ของฟังก์ชัน

      // ดึงไฟล์จาก Ref (ใช้ .current โดยตรงถ้าเป็น HTML input ปกติ)
      const file = profileImgRef.current?.files?.[0];
      if (file) {
        if (file.size > 500000) { 
          alert("ไฟล์รูปใหญ่เกินไป! กรุณาใช้รูปขนาดเล็กกว่า 500KB");
          return;
        }
        imageBase64 = await convertToBase64(file);
      }

      // ตรวจสอบ User ซ้ำ
      const querySnapshot = await getDocs(collection(db, "test_usercollection"));
      querySnapshot.forEach((doc) => {
        const myData = doc.data();
        if (myData.username === username) {
          status = Value1;
        } else if (myData.useremail === email) { // เช็ค field ให้ตรงกับใน DB
          status = Value2;
        }
      });

      if (status === Value3) {
        const docRef = await addDoc(collection(db, "test_usercollection"), {
          username: username,
          password: password,
          useremail: email,
          userimg: imageBase64,
          status: "USER",
          timestamp: new Date()
        });
        alert("ลงทะเบียนสำเร็จ!");
        window.location.href = "/";
      } else {
        alert(status);
      }
    } catch (e) {
      console.error("Error: ", e);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1>Register</h1>
      <Input id="username" placeholder='ชื่อผู้ใช้' style={{ width: '40%', marginBottom: '10px' }} />
      <Input.Password id="password" placeholder='รหัสผ่าน' style={{ width: '40%', marginBottom: '10px' }} />
      <Input id="email" placeholder='อีเมล' style={{ width: '40%', marginBottom: '10px' }} />
      
      <div style={{ margin: '10px 0' }}>
        <label>รูปโปรไฟล์ (ไม่เกิน 500KB): </label>
        {/* ใช้ input ปกติเพื่อให้ ref ทำงานได้แม่นยำกว่า */}
        <input type="file" ref={profileImgRef} accept="image/*" />
      </div>

      <button onClick={addData} style={{ padding: '10px 20px', cursor: 'pointer' }}>ลงชื่อเข้าใช้</button>
    </div>
  );
}

export default Register;