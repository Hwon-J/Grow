import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import NavTop from './components/NavTop';
import Footer from './components/Footer';
import registerNumber from './pages/registerNumber';
import PlantDiary from './pages/PlantDiary';
import './App.css';

const App = () => {
  return (
    <React.Fragment>
        <div class="`navbarColor">
      <NavTop />
      <Routes>
        <Route path="/" element={<Outlet />}>
          {/* NavTop과 Footer가 있는 라우트 */}
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<registerNumber />} />
          <Route path="/diary" element={<PlantDiary />} />

          {/* fallback 라우트: 모든 경로에 대한 처리 */}
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Footer/>
      </div>
    </React.Fragment>
  );
};

export default App;

