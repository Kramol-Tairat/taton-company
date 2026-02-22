import React, { useState } from 'react';
import { arrayLength } from 'firebase/firestore/pipelines';
import { Input } from 'antd';
import { db } from './firebase';
import { collection ,getDocs} from "firebase/firestore"; 

function Login() {
const fetchData = async () => {
  let username = document.getElementById("username");
  let password = document.getElementById("password");
  console.log(username);
  // 1. อ้างอิงไปยัง Collection ที่ต้องการ
  const querySnapshot = await getDocs(collection(db, "test_usercollection"));
  // 2. วนลูปเพื่อดึงข้อมูลแต่ละรายการ
  let CheckLoginSatus = false;
  querySnapshot.forEach((doc) => {
    // console.log(doc.id);
    // doc.id คือรหัสเอกสาร, doc.data() คือข้อมูลข้างใน
    // console.log(`${doc.id} => `, doc.data());
    // console.log(`${doc.id} => `, doc.data().name);
    const myData = doc.data();
    if (myData.username == username.value && myData.password == password.value) {
      alert("เข้าสู่ระบบสำเร็จ");
      localStorage.setItem('userid', doc.id);
      localStorage.setItem('username', myData.username);
      CheckLoginSatus = true;
      // window.location.replace('/Home');
      window.location.href = '/Home';
    };
  });
  if (CheckLoginSatus == false) {
    alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
  };
};
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // เต็มความสูงจอ  // เต็มความกว้างจอ
    backgroundColor: '#ffffff' // สีพื้นหลังอ่อนๆ
  };

const token = localStorage.getItem('userid');
  if (token) {
    window.location.href = "/home";
  }

  return (
    <div style={containerStyle}>
      <h1 >Login</h1>
      <Input 
        type="name" 
        id="username" 
        placeholder='ชื่อ'
        style={{ width: '40%'  }}
      /><br></br>
      <Input 
        type="password" 
        id="password" 
        placeholder='รหัส'
        style={{ width: '40%'  }}
      /><br></br>
      <button onClick={fetchData}>Login</button>
    
    </div>
  );
}

export default Login;