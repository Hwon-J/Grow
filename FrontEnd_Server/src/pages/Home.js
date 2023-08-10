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
function HomeBackground() {
  return (
    <video autoPlay loop muted>
      <source src={homevideo1} type="video/mp4" />
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
          <div className="content">
            <div className="home_container">
              <div className="home_title">
                <h1>Find friend for your kids</h1>
                <h4>This service makes plant friends for your children</h4>
                <h4>so that they can develop emotionally.</h4>
              </div>
            </div>
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
