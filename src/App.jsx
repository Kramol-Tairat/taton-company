import { db } from './firebase';
import { collection, addDoc } from "firebase/firestore"; 

function App() {
  const addData = async () => {
    try {
      const docRef = await addDoc(collection(db, "test_collection"), {
        name: "Taton IT",
        status: "Success",
        timestamp: new Date()
      });
      alert("เขียนข้อมูลสำเร็จ ID: " + docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <h1>Taton IT + Firebase</h1>
      <button onClick={addData}>ลองเพิ่มข้อมูล</button>
    </div>
  );
}

export default App;