// src/components/Home.js
import React from 'react';
import './Home.scss';
// import { Container } from '@mui/material';
// import NavTop from '../components/NavTop';
// import Footer from '../components/Footer';
const Home = () => {
  
  return (
    <>
      <div className="home_container" maxWidth="lg">
        <div className="home_title">
          <h1>Find friend for your kids</h1>
          <h4>This service makes plant friends for children</h4>
          <h4>so that they can develop emotionally.</h4>
          <button>Start</button>
        </div>
      </div>
    </>
  );
};

export default Home;
