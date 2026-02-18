import { db } from './firebase';
import { getDoc, doc , addDoc, collection, serverTimestamp} from "firebase/firestore"; 
import { Card, Empty, Button, Avatar, Image, Typography, Space, Popconfirm, message, Input, Skeleton } from 'antd';
import { EditOutlined, ClockCircleOutlined, CommentOutlined, HeartOutlined, HeartFilled, UserOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react'

const { TextArea } = Input;

function Home() {
  const token = localStorage.getItem('userid');
  const [username, setUsername] = useState("กำลังโหลด...");
  const [userData, setUserData] = useState();
  const [newText, setNewText] = useState(''); 

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
      window.location.href = "/";
      return;
    }

    try {


      const docRef = doc(db, "test_usercollection", token);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUsername(docSnap.data().username);
        setUserData({
          ...docSnap.data(),
        }); // อัปเดต State เมื่อเจอข้อมูล
      } else {
        setUsername("ไม่พบชื่อผู้ใช้");
        setUserData([

        ]);
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

    const AddPost = async (e) => {
      e.preventDefault()
        try {
          const infoValue = newText;     
          const file = postImgRef.current.files[0];

          

          let imageBase64 = null;

          if (file) {
            if (file.size > 500000) { 
                alert("ไฟล์รูปใหญ่เกินไป! กรุณาใช้รูปขนาดเล็กกว่า 500KB สำหรับวิธีนี้");
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
            likes: [],
            timestamp: serverTimestamp(),
          });
          setNewText("");
          alert("เพิ่มโพสต์เรียบร้อย");
          // window.location.href = "/";
        } catch (err) {
          console.error("Error adding document: ", err);
        }
      };
   


  return (
    <div>
        <h1>Home</h1>
        <Card.Meta
              avatar={<Avatar src={userData?.userimg} // ใส่ลิงก์รูปตรงนี้
                              icon={<UserOutlined />}      // ถ้าไม่มีรูป หรือรูปเสีย มันจะโชว์ไอคอนนี้แทน (Fallback)
                              style={{ backgroundColor: '#fde3cf', color: '#f56a00' }} 
                      />}
              title={username || "ไม่ระบุชื่อ"}
              description = {
                <span>ผู้ใช้</span>
              }
            />
      <form onSubmit={AddPost}>
        <p>ใส่ข้อความ:</p>
        <div style={{ marginTop: '8px' }}>
          <TextArea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            autoSize={{ minRows: 3, maxRows: 10 }}
            placeholder="โพสต์ข้อความของคุณ..."
            style={{ fontSize: '16px', borderRadius: '8px' }}
          />
        </div>
        <br />
        
        <p>ใส่รูป (ห้ามเกิน 500kb): 
          <input type="file" ref={postImgRef} accept="image/*" style={{ marginLeft: 10 }}/>
        </p>
        <br />

        <Button type="primary" htmlType="submit">Add post</Button>
        <Button danger htmlType="reset">ล้าง</Button><br></br><br></br>
        <br /><br />
      </form>

          <Button danger onClick={Logout}>Logout</Button>
    </div>
  );
}

export default Home;