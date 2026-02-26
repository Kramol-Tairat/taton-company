import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Popconfirm, message, Card, Typography, Image, Input } from 'antd';
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { db } from './firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const { Search } = Input;
const { Title } = Typography;

const PostList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // ฟังก์ชันดึงข้อมูลจาก Firebase
  const fetchData = async () => {
    setLoading(true);
    try {
      // เปลี่ยนชื่อ collection เป็นของคุณ (เช่น test_usercollection)
      const querySnapshot = await getDocs(collection(db, "post_collection"));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({
          key: doc.id, // Antd Table ต้องการ key ที่ไม่ซ้ำกัน
          id: doc.id,
          ...doc.data()
        });
      });

      items.sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0; 
        const timeB = b.timestamp?.seconds || 0;
        return timeB - timeA;
      });


      setData(items);
    } catch (error) {
      console.error("Error:", error);
      message.error("ไม่สามารถดึงข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ฟังก์ชันลบข้อมูล
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "post_collection", id));
      message.success("ลบข้อมูลสำเร็จ");
      fetchData(); // ดึงข้อมูลใหม่หลังลบเสร็จ
    } catch (error) {
      message.error("ลบข้อมูลไม่สำเร็จ");
    }
  };

  // กำหนดหัวตาราง (Columns)
  const columns = [
    {
      title: 'Owner_name',
      dataIndex: 'ownername',
      key: 'ownername',
    },
    {
      title: 'Post_Info',
      dataIndex: 'postinfo',
      key: 'postinfo',
    },
    {
      title: 'Post_Img',
      dataIndex: 'postimg',
      key: 'postimg',
      width: 120,
      render: (imgData) => (
        imgData ? (
          <Image
            width={80}
            src={imgData}
            alt="post-img"
            style={{ borderRadius: '8px', objectFit: 'cover' }}
          />
        ) : <span style={{ color: '#ccc' }}>ไม่มีรูป</span>
      )
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (time) => time?.toDate ? time.toDate().toLocaleString() : new Date().toLocaleString(),
      width: 200,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          
          <Popconfirm
            title="ยืนยันการลบ"
            description="คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?"
            onConfirm={() => handleDelete(record.id)}
            okText="ใช่, ลบเลย"
            cancelText="ยกเลิก"
          >
            <Button danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const filteredData = data.filter(item => 
    item.ownername?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 10 }}>
        <Title level={3} style={{ margin: 0, flexShrink: 0 }}>รายชื่อผู้ใช้งาน</Title>
        
        <div style={{ display: 'flex', gap: 10, flex: 1, justifyContent: 'flex-end' }}>
          <Search 
            placeholder="ค้นหาชื่อผู้ใช้หรืออีเมล..." 
            allowClear
            onChange={e => setSearchText(e.target.value)}
            style={{ maxWidth: 300 }} 
          />
          <Button icon={<ReloadOutlined />} onClick={fetchData}>รีเฟรชข้อมูล</Button>
        </div>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredData} // 3. ส่งข้อมูลที่กรองแล้วเข้า Table
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered
        scroll={{ x: 'max-content' }}
      />
    </Card>
  );
};

export default PostList;