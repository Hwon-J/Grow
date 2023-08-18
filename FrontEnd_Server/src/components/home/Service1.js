import React from "react";
import { Row, Col } from "react-bootstrap";
import "./service1.css";

const Service1 = () => {
  return (
    <div className="container service1-main-div">
      <Row className="service1-row">
        <Col className="service1-col col1-service" xs={7}>
          <img src={`./home/child5.jpg`} style={{ width: "100%" }} />
        </Col>
        <Col className="service2-col col2-service right-col page2-col" xs={5}>
          <div>
            <p className="col2-p">식물과 함께 성장</p>
            <br />
          </div>
          <h2 className="col2-h2">아이의 책임감과 성장<br />함께 걸어가는 길</h2>
          <br />
          <div>
            <p className="col2-p2">함께 성장하는 식물 친구와 함께</p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Service1;
