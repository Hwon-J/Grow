import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import "./Home.scss";
import NavTop from "../components/NavTop";
import Footer from "../components/Footer";
import Service1 from "../components/home/Service1";
import Service2 from "../components/home/Service2";
import Service3 from "../components/home/Service3";
import FooterHome from "../components/home/FooterHome";
import "./MainVideoBackground.css";
import homevideo1 from "../assets/homevideo1.mp4";
import { SectionsContainer, Section } from "react-fullpage";
import styles from "./home.module.css";
import zIndex from "@mui/material/styles/zIndex";
function HomeBackground() {
  return (
    <video autoPlay loop muted>
      <source src={homevideo1} style={{ zIndex:"1"}} type="video/mp4" />
    </video>
  );
}

const Home = () => {
  let options = {
    anchors: [
      "sectionOne",
      "sectionTwo",
      "sectionThree",
      "sectionFour",
      "sectionFive",
    ],
  };

  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a hash in the URL and scroll to the corresponding section
    navigate("/home#sectionOne");
  }, []);

  return (
    <>
      <SectionsContainer {...options} className="home-main-container">
        <Section
          anchor="sectionOne"
          className={`video-background content-home `}
        >
          <HomeBackground />
        <NavTop className="homenav" />
          <div className="home-main-text">  
            <h1 style={{fontSize:"60px", fontWeight:"bold"}}>아이에게 식물을 선물해 보세요</h1>
            <h4 style={{fontSize:"30px"}}>대화하는 식물 친구와 함께하는 특별한 시간, 대화하는 재미를</h4>
            <h4 style={{fontSize:"30px"}}>아이의 일상에 가득 채워 보세요</h4>

          </div>
          <img src="./footer/down2.png" className="aligned-image" />
        </Section>
        <Section anchor="sectionTwo" className={`content-home `}>
          {/* <img src="./footer/up.png" className="aligned-image2" /> */}
          <Service1 />
          <img src="./footer/down2.png" className="aligned-image" />
        </Section>
        <Section anchor="sectionThree" className={`content-home `}>
          {/* <img src="./footer/up.png" className="aligned-image2" /> */}
          <Service2 />
          <img src="./footer/down2.png" className="aligned-image" />
        </Section>
        <Section anchor="sectionFour" className={`content-home `}>
          {/* <img src="./footer/up.png" className="aligned-image2" /> */}
          <Service3 />
          <img src="./footer/down2.png" className="aligned-image" />
        </Section>
        <Section anchor="sectionFive" className={`content-home `}>
          {/* <img src="./footer/up.png" className="aligned-image2" /> */}
          <FooterHome />
        </Section>
      </SectionsContainer>
    </>
  );
};

export default Home;
