// src/components/Home.js
import React from 'react';
import './Home.scss';
import { Container } from '@mui/material';
import NavTop from '../components/NavTop';
import Footer from '../components/Footer';
const Home = () => {
  
  return (
    <>
    <NavTop/>
      <Container className="home_container" maxWidth="sm">
        <div className="home_title">
          <h1>Find friend for your kids</h1>
          <h4>This service makes plant friends for children so that they can develop emotionally.</h4>
        </div>
      </Container>
    <Footer/>
    </>
  );
};

export default Home;
