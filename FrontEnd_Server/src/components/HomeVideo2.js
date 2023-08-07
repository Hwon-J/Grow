import React from 'react';
import homevideo2 from '../assets/homevideo2.mp4';

function HomeVideo2 () {
  return (
    <div>
      <video width="800" height="450" autoPlay loop muted>
        <source src={homevideo2} type="video/mp4" />
      </video>
    </div>
  );
};

export default HomeVideo2;
