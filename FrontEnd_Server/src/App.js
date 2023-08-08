import React , { useEffect }from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ImgUpload from './pages/ImgUpload';
import PlantDiary from './pages/PlantDiary';
import PlantInfo from './pages/PlantInfo';
import CheckoutPage from './pages/shop/PaymentToss.tsx';

import ShopMain from './pages/shop/ShopMain';
import {FailPage} from './pages/shop/Fail.tsx'
import { SuccessPage } from './pages/shop/Success.tsx';
import CheckToken from './utils/Users';


import LoginPage from './pages/LoginPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const App = () => {

  return (
    <React.Fragment>
      <CheckToken />
        <Routes>
          <Route path="/" element={<Outlet />}>
            {/* NavTop과 Footer가 있는 라우트 */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/diary/:id" element={<PlantDiary />} />
            <Route path="/login" element={<Login />} />

            <Route path="/loginpage" element={<LoginPage />} />

            <Route path="/signup" element={<SignUp />} />
            <Route path="/plantinfo" element={<PlantInfo />} />
            <Route path="/imgupload" element={<ImgUpload />} />

            <Route path="/shop" element={<ShopMain />} />
            <Route path="/payment" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/fail" element={<FailPage />} />

            <Route path="/*" element={<NotFound/>} />
          </Route>
        </Routes>
    </React.Fragment>
  );
};

export default App;

