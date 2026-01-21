import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './Home.jsx'
import Register from './Register.jsx'
import MainLayout from './MainLayout.jsx' // นำ Layout เข้ามา

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* ใช้ MainLayout ครอบ Routes ทั้งหมด */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)