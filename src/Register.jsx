
import { db } from './firebase';
import { collection, addDoc, getDocs} from "firebase/firestore"; 
import { useState } from 'react';

function Register() {
  const token = localStorage.getItem('userid');
  if (token) {
    window.location.href = "/home";
  }
  const addData = async () => {
    try {
      const username = document.getElementById("username");
      const password = document.getElementById("password");
      const email = document.getElementById("username");
      
      const Value1 = "ชื่อผู้ใช้ซ้ำ", Value2 = "อีเมลซ้ำ", Value3 = "nothing";
      let status = Value3;

      const querySnapshot = await getDocs(collection(db, "test_usercollection"));
      querySnapshot.forEach((doc)  => {
        const myData = doc.data();
        if (myData.username == username.value) {
          status = Value1;
        }else if (myData.email == email.value) {
          status = Value2;
        };
      });

      if (status == Value3) {
          const docRef = await addDoc(collection(db, "test_usercollection"), {
            username: username.value,
            password: password.value,
            useremail: email.value,
            status: "USER",
            timestamp: new Date()
          });
          alert("เขียนข้อมูลสำเร็จ ID: " + docRef.id);
          window.location.href = "/";
      }else if (status == Value1) {
        alert(Value1);
      }else if (status == Value2) {
        alert(Value2);
      };
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  

  return (
    <div>
      <h1>Register</h1>
      <input type="name" id="username" placeholder='ชื่อ'/><br></br>
      <input type="password" id="password" placeholder='รหัส'/><br></br>
      <input type="email" id="emai" placeholder='อีเมล'/>
      <button onClick={addData}>ลองเพิ่มข้อมูล</button>
    </div>
  );
}

export default Register;