import React from "react";
import NavTop from "../components/NavTop";
// import Footer from '../components/Footer';
import "./NotFound.scss";
import { Grid } from "@mui/material";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  // 버튼 클릭 시 홈으로 이동하는 함수
  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <div className="not_found">
      <NavTop />
      <Grid container>
        <Grid className="not_left" item xs={6}>
          <div>
            <h1>404</h1>
            <h4>요청하신 페이지를 찾을 수 없습니다.</h4>
            <div className="home_button" onClick={handleGoHome}>
              <span>Go Home</span>
              <Icon icon="bi:arrow-right" />
            </div>
          </div>
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>
    </div>
  );
};

export default NotFound;
