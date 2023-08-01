import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import RegisterNumber from './pages/RegisterNumber';
import PlantDiary from './pages/PlantDiary';
import PlantSpecies from './pages/PlantSpecies';
import PlantInfo from './pages/PlantInfo';
import QuestPage from './pages/profile/QuestPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const App = () => {
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
            <Route path="/species" element={<PlantSpecies />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/plantinfo" element={<PlantInfo />} />
            <Route path="/questpage" element={<QuestPage />} />
            <Route path="/*" element={<NotFound/>} />
          </Route>
        </Routes>
      </div>
    </React.Fragment>
  );
};

export default App;

