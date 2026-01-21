import { arrayLength } from 'firebase/firestore/pipelines';
import { db } from './firebase';
import { collection, addDoc ,getDocs} from "firebase/firestore"; 

function App() {
  let username = document.getElementById("username");
  let password = document.getElementById("password");

  const addData = async () => {
    try {
      const docRef = await addDoc(collection(db, "test_collection"), {
        username: "Taton IT",
        password: "1234",
        status: "Success",
        timestamp: new Date()
      });
      alert("เขียนข้อมูลสำเร็จ ID: " + docRef.id + docRef.id.name);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
const fetchData = async () => {
  // 1. อ้างอิงไปยัง Collection ที่ต้องการ
  const querySnapshot = await getDocs(collection(db, "test_collection"));
  
  // 2. วนลูปเพื่อดึงข้อมูลแต่ละรายการ
  querySnapshot.forEach((doc) => {
    // doc.id คือรหัสเอกสาร, doc.data() คือข้อมูลข้างใน
    // console.log(`${doc.id} => `, doc.data());
    // console.log(`${doc.id} => `, doc.data().name);
    const myData = doc.data();
    if (myData.username == username.value && myData.password == password.value) {
      alert("เข้าสู่ระบบสำเร็จ");
    };
  });
};

  return (
    <div>
      <h1>Welcome to tuntee.com</h1>
      <input type="name" id="username" placeholder='ชื่อ'/><br></br>
      <input type="name" id="password" placeholder='รหัส'/>
      <button onClick={addData}>ลองเพิ่มข้อมูล</button>
      <button onClick={fetchData}>ดึงข้อมูล</button>
    </div>
  );
}

export default App;