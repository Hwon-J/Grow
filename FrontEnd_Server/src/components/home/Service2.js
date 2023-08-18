import React from "react";
import { Row, Col } from "react-bootstrap";
import "./service2.css";

const Service2 = () => {
  return (
    <div className="container service1-main-div">
      <Row className="service1-row">
        <Col className="service2-col col2-service left-col" xs={5}>
          <div>
            <p className="col2-p">AI와의 실시간 대화</p>
            <br />
          </div>
          <h2 className="col2-h2">집에서도 외롭지 않게</h2>
          <div>
            <p className="col2-p2">마음을 나누는 똑똑한 친구 AI식물</p>
          </div>
        </Col>
        <Col className="service1-col col1-service " xs={7}>
          <img src={`./home/child7.jpg`} style={{ width: "100%" }} />
        </Col>
      </Row>
    </div>
  );
};

export default Service2;
