import React, { useState, useEffect } from "react";
import styles from "./footer.module.css";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";
const FooterHome = () => {
  const navigate = useNavigate();
  const startgo = () => {
    navigate('/signup')
  }
  return (
    <Row className={styles.container}>
      <Col className={styles.col1} xs={5}>
        <img src="./footer/footer1.png" className={styles.img1} />
        <div className={styles.footer}>
          <p className={styles.pp}>
            <span>광주광역시 광산구 오선동 2층</span> <br />
            <span>이메일 : growSsafy103@gmail.com</span>
            <br />
            <span>TEL : 1600-0000</span>
          </p>
        </div>
      </Col>
      <Col className={styles.col2} xs={7}>
        <img src="./footer/footer2.png" className={styles.img2} />
        <div onClick={startgo}><button className={styles.button}>시작</button></div>
      </Col>
    </Row>
  );
};

export default FooterHome;
