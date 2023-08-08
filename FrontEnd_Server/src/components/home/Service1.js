import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import './service1.css';

const Service1 = () => {
  const [showChildImage, setShowChildImage] = useState(false);

  useEffect(() => {
    // Delay showing the child image after 1000ms
    const timer = setTimeout(() => {
      setShowChildImage(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container service1-main-div">
      <Row className="service1-row">
        <Col className="service1-col col1-service" xs={7}>
          <img src={`./home/home2.png`}/>
          {showChildImage && (
            <img className="child-img" src={`./home/child1.png`} />
          )}
        </Col>
        <Col className="service2-col col2-service" xs={5}>
          <h2>아이의 속마음</h2><br/>
          <h2>아이의 비밀친구에게 속삭여봐요!</h2>
        </Col>
      </Row>
    </div>
  );
};

export default Service1;
