import { db } from './firebase';
import { getDoc, doc , addDoc, collection, serverTimestamp} from "firebase/firestore"; 
import { useState, useEffect, useRef } from 'react'

function Home() {
  const token = localStorage.getItem('userid');
  const [username, setUsername] = useState("กำลังโหลด...");
  const [loading, setLoading] = useState(false);

  const postInfoRef = useRef();
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
          const file = postImgRef.current.files[0];

          setLoading(true);

          let imageBase64 = null;

          if (file) {
            if (file.size > 500000) { 
                alert("ไฟล์รูปใหญ่เกินไป! กรุณาใช้รูปขนาดเล็กกว่า 500KB สำหรับวิธีนี้");
                setLoading(false);
                return;
            }
            imageBase64 = await convertToBase64(file);
          }

          if (!infoValue) return alert("กรุณากรอกข้อความ");
          await addDoc(collection(db, "post_collection"), {
            postowner: token,
            ownername: username,
            postinfo: infoValue,
            postimg: imageBase64,
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
            <p>ใส่รูป(ห้ามเกิน 500kbW):<input type="file" ref={postImgRef} accept="image/*" /></p><br></br>
            <button type="submit">Add post</button><br></br><br></br>
          </form>
          <button onClick={Logout}>Logout</button>
    </div>
  );
}

export default Home;