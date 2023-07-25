import React from 'react'
import Login from './Components/Login'
import "./App.css"
import Home from './pages/Home';
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
import Logout from "./Components/Logout";
import SignUp from "./Components/SignUp";
import NavTop from './Components/NavTop';
import Footer from './Components/Footer';
import { Routes, Route, Outlet } from 'react-router-dom';

const App = () => {
  const user = useSelector(selectUser);
  return (
    <React.Fragment>
        <div class="`navbarColor">
      <NavTop />
      <Routes>
        <Route path="/" element={<Outlet />}>
          {/* NavTop과 Footer가 있는 라우트 */}
          <Route path="/home" element={<Home />} />
      </Route>
        <Route path="/login" element={user ? <Logout/> : <Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Footer/>
      </div>
    </React.Fragment>
  );
};

export default App

