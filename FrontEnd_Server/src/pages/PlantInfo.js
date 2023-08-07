//김태형
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/Urls";
import {
  Form,
  Row,
  Col,
  Stack,
  Container,
  Card,
  InputGroup,
  Offcanvas,
} from "react-bootstrap";
import NavTop from "../components/NavTop";
import "./plantinfo.scss";

const PlantInfo = () => {
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
    if (checkedResult === false) {
      alert("시리얼 넘버를 확인해주세요");
    } else {
      console.log(selectedInfo);
      const body = {
        plant_name: nickname,
        serial_number: serialNum,
        plant_info_index: selectedInfo?.index,
        child_name: childname,
        child_age: parseInt(childage),
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
          `${BASE_URL}/api/plant/create`,
          // `http://192.168.100.37:30001/api/plant/create`,
          body, // body는 요청 바디에 해당하는 부분이므로 여기에 body를 넣어줍니다.
          config // config는 옵션 객체이며, 여기에 headers를 포함하여 설정을 넣어줍니다.
        );
        navigate(`/profile`);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const imgPlantInfo = () => {
    console.log(plantInfo);
    return (
      <Row className="scroll-container">
        {plantInfo.map((info) => (
          <Col key={info.index} xs={4} md={6}>
            <Card className="plant-img-card h-100">
              <Card.Img
                thumbnail="true"
                src={`./plantInfoimg/${info.index}.png`}
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
      const response = await axios.get(`${BASE_URL}/api/plant/info`);
      setPlantInfo(response.data.info);
    } catch (error) {
      console.log(error);
    }
  };

  const checkSerial = async () => {
    if (serialNum && serialNum.length===5) {
      try {
        const response = await axios.get(`${BASE_URL}/api/pot/${serialNum}`);
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
      alert("숫자5개를 입력해 주세요!");
    }
  };

  return (
    <>
      <NavTop />
      <div className="top_section">
        <h1>식물 등록</h1>
      </div>
      <Container className="plant-info-container">
        <Row>
          {/* 좌측 카드 컬럼 */}
          <Col sm={12} md={5} className="plant-info-col">
            {imgPlantInfo()}
          </Col>

          {/* 우측 폼 컬럼 */}
          <Col sm={12} md={6} className="plant-info-col plant-colo">
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
                        {selectedInfo?.info && <p>설명: {selectedInfo.info}</p>}
                        {selectedInfo?.temperature_upper && (
                          <p>
                            최고: {selectedInfo.temperature_upper}도
                          </p>
                        )}
                        
                        {selectedInfo?.temperature_lower && (
                          <p>
                            최저온도: {selectedInfo.temperature_lower}도
                          </p>
                        )}
                        {selectedInfo?.moisture_upper&& (
                          <p>최고습도: {selectedInfo.moisture_upper}%</p> 
                        )}
                        {selectedInfo?.moisture_lower && (
                          <p>최저습도: {selectedInfo.moisture_lower}%</p>
                        )}
                        {selectedInfo?.max_water_period && (
                          <p>
                            최대 물주기: {selectedInfo.max_water_period}일
                          </p>
                        )}
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
                    <p className="checkP" style={{ color: "red", display: "flex", justifyContent: "center" }}>
                      {checkNum ? checkNum : errormessage}
                    </p>
                    <Form.Control
                      type="number"
                      placeholder="나이"
                      value={childage}
                      onChange={onChangeChildage}
                    />
                    <button type="submit" className="custom-button create-btn">
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

export default PlantInfo;

{
  /* <video autoPlay loop muted width="360" height="640">
<source src={homevideo2} type="video/mp4" />
</video> */
}
