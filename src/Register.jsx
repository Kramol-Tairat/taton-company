
import { db } from './firebase';
import { collection, addDoc, getDocs} from "firebase/firestore"; 
import { Input } from 'antd';
import { useRef } from 'react';

function Register() {
  const token = localStorage.getItem('userid');
  const Value1 = "ชื่อผู้ใช้ซ้ำ", Value2 = "อีเมลซ้ำ", Value3 = "nothing";
  let imageBase64 = "";
  
  if (token) {
    window.location.href = "/home";
  }      
  const postImgRef = useRef();
  const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
              reject(error);
            };
          });
        };
  const addData = async () => {
    try {
      const username = document.getElementById("username");
      const password = document.getElementById("password");
      const email = document.getElementById("username");
      let status = Value3;

      const file = postImgRef.current.files[0];
        if (file) {
            if (file.size > 500000) { 
                alert("ไฟล์รูปใหญ่เกินไป! กรุณาใช้รูปขนาดเล็กกว่า 500KB สำหรับวิธีนี้");
                return;
            }
            imageBase64 = await convertToBase64(file);
            // alert(imageBase64);
          }

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
            userimg: imageBase64,
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
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // เต็มความสูงจอ  // เต็มความกว้างจอ
    backgroundColor: '#ffffff' // สีพื้นหลังอ่อนๆ
  };

  return (
    <div style={containerStyle}>
      <h1>Register</h1>
      <Input type="name" id="username" placeholder='ชื่อ' style={{ width: '40%'  }}/><br></br>
      <Input type="password" id="password" placeholder='รหัส' style={{ width: '40%'  }}/><br></br>
      <Input type="email" id="emai" placeholder='อีเมล' style={{ width: '40%'  }}/>
      <p>ใส่รูปโปรไฟล์(ห้ามเกิน 500kbW):<Input type="file" ref={postImgRef} accept="image/*"  /></p><br></br>
      <button onClick={addData}>ลงชื่อเข้าใช้</button>
    </div>
  );
}

export default Register;