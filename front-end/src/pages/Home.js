// src/components/Home.js
import React from 'react';
import './Home.scss';
import homeImage from '../assets/home1.jpg';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home">
        <h1>Find friend for your kids</h1>
        <h4>This service makes plant friends for children so that they can develop emotionally.</h4>
      </div>
      <div className="image-container">
        <img src={homeImage} alt="Plant friend for kids" />
      </div>
    </div>
  );
};

export default Home;
