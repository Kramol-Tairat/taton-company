import { db } from './firebase';
import { getDoc, doc} from "firebase/firestore"; 
import { useState, useEffect } from 'react'

function Home() {
const token = localStorage.getItem('userid');
const [username, setUsername] = useState("กำลังโหลด...");
const fetchData = async () => {
  if (!token) {
      setUsername("ไม่พบข้อมูล Login");
      return;
    }

    try {
      const docRef = doc(db, "test_usercollection", token);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUsername(docSnap.data().username); // อัปเดต State เมื่อเจอข้อมูล
      } else {
        setUsername("ไม่พบชื่อผู้ใช้");
      }
    } catch (error) {
      console.error("Error:", error);
      setUsername("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
   }
   
useEffect(() => {
    fetchData();
  }, []);

  function Logout() {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <div>
        <h1>Login สำเร็จ
          <p>User ID ของคุณคือ: {username}</p>
          <button onClick={Logout}>Logout</button>
        </h1>
    </div>
  );
}

export default Home;