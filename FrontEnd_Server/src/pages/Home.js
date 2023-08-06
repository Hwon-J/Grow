// src/components/Home.js
import React from 'react';
import './Home.scss';
// import { Container } from '@mui/material';
import NavTop from '../components/NavTop';
import Footer from '../components/Footer';
import HomeVideo from '../components/HomeVideo';
import HomeVideo2 from '../components/HomeVideo2';
import './MainVideoBackground.css';
import homevideo1 from '../assets/homevideo1.mp4';

function HomeBackground () {
  return (
    
      <video autoPlay loop muted>
        <source src={homevideo1} type="video/mp4" />
      </video>
    
  )
}


const Home = () => {
  
  return (
    <div className="video-background">
      <HomeBackground />
      <div className="content">
      <>
      <NavTop className="homenav" />
      
      <div className="home_container">
        <div className="home_title">
          <h1>Find friend for your kids</h1>
          <h4>This service makes plant friends for your children</h4>
          <h4>so that they can develop emotionally.</h4>
          
        </div>
        
      </div>
      <Footer/>
    </>
        
      </div>
    </div>
  );
};

export default Home;
