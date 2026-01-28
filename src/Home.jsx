import { db } from './firebase';
import { getDoc, doc , addDoc, collection, serverTimestamp} from "firebase/firestore"; 
import { useState, useEffect, useRef } from 'react'

function Home() {
  const token = localStorage.getItem('userid');
  const [username, setUsername] = useState("กำลังโหลด...");

  const postInfoRef = useRef();
  const postImgRef = useRef();

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

  // function AddPost() {
    const AddPost = async (e) => {
      e.preventDefault()
        try {
          const infoValue = postInfoRef.current.value;     
          // const PostInfo = document.getElementById("PostInfo");
          // const PostImg = document.getElementById("PostImg");;
          if (!infoValue) return alert("กรุณากรอกข้อความ");
          await addDoc(collection(db, "post_collection"), {
            postowner: token,
            ownername: username,
            postinfo: infoValue,
            // postimg: PostImg.value,
            timestamp: serverTimestamp(),
          });
          postInfoRef.current.value = "";
          alert("เพิ่มโพสต์เรียบร้อย");
          // window.location.href = "/";
        } catch (err) {
          console.error("Error adding document: ", err);
        }
      };
    
  // }

  return (
    <div>
        <h1>Login สำเร็จ</h1>
        <p>User ID ของคุณคือ: {username}</p>
          <form onSubmit={AddPost}>
            <p>ใส่ข้อความ:<input type="text"  ref={postInfoRef} required id="PostInfo"/></p><br></br>
            {/* <p>ใส่รูป:<input type="file" required id="PostImg"/></p><br></br> */}
            <button type="submit">Add post</button><br></br><br></br>
          </form>
          <button onClick={Logout}>Logout</button>
    </div>
  );
}

export default Home;