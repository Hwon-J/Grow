import React , { useEffect }from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ImgUpload from './pages/ImgUpload';
import RegisterNumber from './pages/RegisterNumber';
import PlantDiary from './pages/PlantDiary';
import PlantInfo from './pages/PlantInfo';

import {checkToken} from './utils/Users'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const App = () => {
  useEffect(() => {
    // 페이지가 열릴 때 checkToken 함수 실행
    checkToken();
  }, []);
  return (
    <React.Fragment>
        <div>
        <Routes>
          <Route path="/" element={<Outlet />}>
            {/* NavTop과 Footer가 있는 라우트 */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<RegisterNumber />} />
            <Route path="/diary/:id" element={<PlantDiary />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/plantinfo" element={<PlantInfo />} />
            <Route path="/imgupload" element={<ImgUpload />} />
            <Route path="/*" element={<NotFound/>} />
          </Route>
        </Routes>
      </div>
    </React.Fragment>
  );
};

export default App;

