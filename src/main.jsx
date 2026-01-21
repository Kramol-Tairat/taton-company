import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' // นำเข้า Router
import './index.css'
import App from './App.jsx'
import Home from './Home.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* ตั้งค่าว่า path ไหนจะให้โชว์ไฟล์ไหน */}
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
       
      </Routes>
    </BrowserRouter>
  </StrictMode>
)