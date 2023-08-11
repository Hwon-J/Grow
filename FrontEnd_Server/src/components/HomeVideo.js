import React from "react";
import homevideo1 from "../assets/homevideo1.mp4";

function HomeVideo() {
  return (
    <div>
      <video width="800" autoPlay loop muted>
        <source src={homevideo1} type="video/mp4" />
      </video>
    </div>
  );
}

export default HomeVideo;
