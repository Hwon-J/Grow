import React from "react";
import { Row, Col } from "react-bootstrap";
import "./service3.css";

const Service3 = () => {
  return (
    <div className="container service1-main-div">
      <Row className="service1-row">
        <Col className="service1-col col1-service" xs={6}>
          <img src={`./home/child8.jpg`} style={{ width: "70%" }} />
        </Col>
        <Col className="service2-col col2-service right-col" xs={6}>
          <div className="fourp">
            <p className="col2-p ">아이와 소통</p>
            <br />
          </div>
          <h2 className="col2-h2">아이와 부모의 편지</h2>
          <div>
            <p className="col2-p2">
              부모와 아이의 이해, 아이의 행복을 키우는 첫 걸음
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Service3;
