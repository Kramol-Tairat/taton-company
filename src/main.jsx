import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import LandingPage from './Landingpage.jsx'
import Login from './Login.jsx'
import Home from './Home.jsx'
import Register from './Register.jsx'
import MainLayout from './MainLayout.jsx' // นำ Layout เข้ามา
import PostList from './PostList.jsx'
import MainPage from './MainPage.jsx'
import EditPage from './editPage.jsx'
import CommentPage from './commentPage.jsx'
import UserList from './UserList.jsx'
import SubLayout from './SubLayout.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* ใช้ MainLayout ครอบ Routes ทั้งหมด */}
        <Route element={<MainLayout />}>
          <Route path="/Login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/MainPage" element={<MainPage />} />
          
          <Route path="/EditPage" element={<EditPage />} />
          <Route path="/CommentPage" element={<CommentPage />} />
          
          <Route path="/Admin" element={<SubLayout />}> 
            <Route path="/Admin/" element={<UserList />} />
            <Route path="/Admin/PostList" element={<PostList />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
  
)