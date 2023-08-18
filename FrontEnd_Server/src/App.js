import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PlantDiary from "./pages/PlantDiary";
import PlantInfo from "./pages/PlantInfo";
import CheckToken from "./utils/Users";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/plantinfo" element={<PlantInfo />} />
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </React.Fragment>
  );
};

export default App;
