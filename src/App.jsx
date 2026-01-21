import { arrayLength } from 'firebase/firestore/pipelines';
import { db } from './firebase';
import { collection ,getDocs} from "firebase/firestore"; 

function App() {
const fetchData = async () => {
  let username = document.getElementById("username");
  let password = document.getElementById("password");
  console.log(username);
  // 1. อ้างอิงไปยัง Collection ที่ต้องการ
  const querySnapshot = await getDocs(collection(db, "test_usercollection"));
  // 2. วนลูปเพื่อดึงข้อมูลแต่ละรายการ
  querySnapshot.forEach((doc) => {
    // console.log(doc.id);
    // doc.id คือรหัสเอกสาร, doc.data() คือข้อมูลข้างใน
    // console.log(`${doc.id} => `, doc.data());
    // console.log(`${doc.id} => `, doc.data().name);
    const myData = doc.data();
    if (myData.username == username.value && myData.password == password.value) {
      alert("เข้าสู่ระบบสำเร็จ");
      localStorage.setItem('userid', doc.id);
  
      // window.location.replace('/Home');
      window.location.href = '/Home';
    };
  });
};

  return (
    <div>
      <h1>Welcome to tuntee.com</h1>
      <input type="name" id="username" placeholder='ชื่อ'/><br></br>
      <input type="password" id="password" placeholder='รหัส'/>
      <button onClick={fetchData}>Login</button>
    </div>
  );
}

export default App;