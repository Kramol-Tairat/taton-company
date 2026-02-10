import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Login from './Login.jsx'
import Home from './Home.jsx'
import Register from './Register.jsx'
import MainLayout from './MainLayout.jsx' // นำ Layout เข้ามา
import PostList from './PostList.jsx'
import MainPage from './MainPage.jsx'
import EditPage from './editPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* ใช้ MainLayout ครอบ Routes ทั้งหมด */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/MainPage" element={<MainPage />} />
          <Route path="/PostList" element={<PostList />} />
          <Route path="/EditPage" element={<EditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
  
)