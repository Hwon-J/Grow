//김태형
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Alert,
  Button,
  Form,
  Row,
  Col,
  Stack,
  Container,
  Image,
  Card,
  InputGroup,
  Offcanvas,
} from "react-bootstrap";
import NavTop from "../components/NavTop";
import PlantInfoComponent from "../components/plant/PlantInfoComponent";
import "./plantinfo.scss";

const Test = () => {
  const [nickname, setNickname] = useState("");
  const [childname, setChildname] = useState("");
  const [childage, setChildage] = useState("");
  const [serialNum, setSerialNum] = useState("");
  const [checkNum, setCheckNum] = useState("");
  const [checkedResult, setCheckedResult] = useState(false);
  const [plantInfo, setPlantInfo] = useState([]);
  const [checkIdx, setCheckIdx] = useState(-1);
  const [errormessage, setErormessage] = useState("");
  const currentUser = useSelector((state) => state.currentUser);
  const authToken = currentUser.token;
  const navigate = useNavigate();
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (info) => {
    setSelectedInfo(info);
    setShow(true);
  };

  useEffect(() => {
    console.log(selectedInfo); // 이렇게 하면 selectedInfo의 최신 값이 로그에 표시됩니다
  }, [selectedInfo]);

  useEffect(() => {
    getPlantInfo();
  }, []);

  useEffect(() => {
    imgPlantInfo();
  }, [plantInfo]);

  const onChangeNickname = (e) => {
    // 입력한 값 계속 바뀌는 것 확인
    setNickname(e.target.value);
  };

  const onChangeSerialNum = (e) => {
    setSerialNum(e.target.value);
  };
  const onChangeChildname = (e) => {
    setChildname(e.target.value);
  };
  const onChangeChildage = (e) => {
    setChildage(e.target.value);
  };

  const createPlant = async (e) => {
    e.preventDefault();
    console.log("여기");
    console.log("nickname:", nickname);
    console.log("checkIdx:", checkIdx);
    console.log("childname:", childname);
    console.log("childage:", childage);
    if (checkedResult === true) {
      alert("시리얼 넘버를 확인해주세요");
    } else {
      console.log(selectedInfo);
      const body = {
        plant_name: nickname,
        plant_info_index: selectedInfo?.index,
        serial_number: serialNum,
        child_name: childname,
        child_age: childage,
      };
      console.log(authToken);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authToken}`,
        },
      };

      console.log(body);

      try {
        const response = await axios.post(
          `http://i9c103.p.ssafy.io:30001/api/plant/create`,
          // `http://192.168.100.37:30001/api/plant/create`,
          body, // body는 요청 바디에 해당하는 부분이므로 여기에 body를 넣어줍니다.
          config // config는 옵션 객체이며, 여기에 headers를 포함하여 설정을 넣어줍니다.
        );
        navigate(`/diary/${response.data.index}`);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const imgPlantInfo = () => {
    const a = [
      {
        index: 1,
        species: "청경채",
        content:
          "청경채는 어쩌고 저쩌고청경채는 어쩌고 저쩌고청경채는 어쩌고 저쩌고청경채는 어쩌고 저쩌고청경채는 어쩌고 저쩌고청경채는 어쩌고 저쩌고청경채는 어쩌고 저쩌고청경채는 어쩌고 저쩌고",
        temperature_upper: 35,
        temperature_lower: 20,
        moisture_upper: 50,
        moisture_lower: 40,
        max_water_period: 10,
      },
      {
        index: 2,
        species: "상추",
        temperature_upper: 35,
        temperature_lower: 20,
        moisture_upper: 50,
        moisture_lower: 40,
        max_water_period: 10,
      },
      {
        index: 3,
        species: "상추",
        temperature_upper: 35,
        temperature_lower: 20,
        moisture_upper: 50,
        moisture_lower: 40,
        max_water_period: 10,
      },
      {
        index: 4,
        species: "상추",
        temperature_upper: 35,
        temperature_lower: 20,
        moisture_upper: 50,
        moisture_lower: 40,
        max_water_period: 10,
      },
      {
        index: 5,
        species: "상추",
        temperature_upper: 35,
        temperature_lower: 20,
        moisture_upper: 50,
        moisture_lower: 40,
        max_water_period: 10,
      },
      {
        index: 6,
        species: "상추",
        temperature_upper: 35,
        temperature_lower: 20,
        moisture_upper: 50,
        moisture_lower: 40,
        max_water_period: 10,
      },
      {
        index: 7,
        species: "상추",
        temperature_upper: 35,
        temperature_lower: 20,
        moisture_upper: 50,
        moisture_lower: 40,
        max_water_period: 10,
      },
      {
        index: 8,
        species: "상추",
        temperature_upper: 35,
        temperature_lower: 20,
        moisture_upper: 50,
        moisture_lower: 40,
        max_water_period: 10,
      },
      {
        index: 9,
        species: "상추",
        temperature_upper: 35,
        temperature_lower: 20,
        moisture_upper: 50,
        moisture_lower: 40,
        max_water_period: 10,
      },
    ];

    return (
      <Row className="scroll-container">
        {a.map((info) => (
          <Col key={info.index} xs={6} md={6}>
            <Card className="plant-img-card h-100">
              <Card.Img
                thumbnail
                src={`./plantInfoimg/${info.index}.jpg`}
                onClick={() => handleShow(info)}
                style={{
                  border:
                    selectedInfo?.index === info.index
                      ? "0.1rem solid rgb(56, 181, 203)"
                      : "none",
                  width: "100%",
                  height: "100%",
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  const getPlantInfo = async () => {
    try {
      const response = await axios.get(
        `http://i9c103.p.ssafy.io:30001/api/plant/info`
      );
      setPlantInfo(response.data.info);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickInfo = (info) => {
    setCheckIdx(info.index);
    setSelectedInfo(info);
    console.log(info);
  };

  const checkSerial = async () => {
    if (serialNum) {
      try {
        const response = await axios.get(
          `http://i9c103.p.ssafy.io:30001/api/pot/${serialNum}`
        );
        if (response.data.code === 202) {
          // alert(response.data.message);
          console.log(response.data.message);
          setCheckedResult(false);
          setErormessage(response.data.message);
          setCheckNum("");
        }
        if (response.data.code === 200) {
          setCheckNum(response.data.message);
          setErormessage("");
          console.log(response.data.message);
          setCheckedResult(true);
        }
      } catch (error) {
        alert.log("서버에러");
        setCheckedResult(false);
      }
    } else {
      alert("시리얼 넘버를 입력해 주세요!");
    }
  };

  return (
    <>
      <NavTop />

      <Container className="plant-info-container">
        <Row>
          {/* 좌측 카드 컬럼 */}
          <Col sm={12} md={5} className="plant-info-col">
            {imgPlantInfo()}
          </Col>

          {/* 우측 폼 컬럼 */}
          <Col sm={12} md={6} className="plant-info-col">
            <Form onSubmit={createPlant}>
              <Row
                style={{
                  height: "100vh",
                  justifyContent: "center",
                  paddingTop: "10%",
                }}
              >
                <Col xs={10}>
                  <Stack gap={3} className="plantinfo-stack">
                    <h2>식물 등록</h2>

                    {/* Offcanvas */}
                    <Offcanvas
                      show={show}
                      onHide={handleClose}
                      placement="top"
                      className="half-screen-offcanvas"
                    >
                      <Offcanvas.Header closeButton>
                        <Offcanvas.Title>
                          {selectedInfo?.species}
                        </Offcanvas.Title>
                      </Offcanvas.Header>
                      <Offcanvas.Body>
                        <p>설명 : {selectedInfo?.content}</p>
                        <p>
                          Temperature Upper: {selectedInfo?.temperature_upper}
                        </p>
                        <p>
                          Temperature Lower: {selectedInfo?.temperature_lower}
                        </p>
                        <p>Moisture Upper: {selectedInfo?.moisture_upper}</p>
                        <p>Moisture Lower: {selectedInfo?.moisture_lower}</p>
                        <p>
                          Max Water Period: {selectedInfo?.max_water_period}
                        </p>
                      </Offcanvas.Body>
                    </Offcanvas>

                    <Form.Control
                      type="text"
                      placeholder="식물 애칭"
                      value={nickname}
                      onChange={onChangeNickname}
                    />
                    <Form.Control
                      type="text"
                      placeholder="아이 이름"
                      value={childname}
                      onChange={onChangeChildname}
                    />
                    <InputGroup>
                      <p className="checkP" style={{ color: "red" }}>
                        {checkNum ? checkNum : errormessage}
                      </p>
                      <Form.Control
                        type="text"
                        placeholder="시리얼 넘버"
                        value={serialNum}
                        onChange={onChangeSerialNum}
                      />
                      <button
                        type="button"
                        onClick={checkSerial}
                        className="custom-button"
                      >
                        확인
                      </button>
                    </InputGroup>
                    <Form.Control
                      type="number"
                      placeholder="나이"
                      value={childage}
                      onChange={onChangeChildage}
                    />
                    <button type="submit" className="custom-button">
                      만들기
                    </button>
                  </Stack>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Test;

{
  /* <video autoPlay loop muted width="360" height="640">
<source src={homevideo2} type="video/mp4" />
</video> */
}
