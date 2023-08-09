//김태형
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/Urls";
import axios from "axios";
import NavTop from "../components/NavTop";
import InfoModal from "../components/plant/InfoModal";
import "./plantinfo.scss";
import {
  Form,
  Row,
  Col,
  Stack,
  Container,
  Card,
  InputGroup,
} from "react-bootstrap";

const PlantInfo = () => {
  const [nickname, setNickname] = useState("");
  const [childname, setChildname] = useState("");
  const [childage, setChildage] = useState("");
  const [serialNum, setSerialNum] = useState("");
  const [checkNum, setCheckNum] = useState("");
  const [checkedResult, setCheckedResult] = useState(false);
  const [plantInfo, setPlantInfo] = useState([]);
  const [errormessage, setErormessage] = useState("");
  const currentUser = useSelector((state) => state.currentUser);
  const authToken = currentUser.token;
  const navigate = useNavigate();
  const [selectedInfo, setSelectedInfo] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const handleShow = (info) => {
    setSelectedInfo(info);
    console.log(info + "handleShow");
    console.log(modalOpen);
    setModalOpen(true);
  };

  useEffect(() => {
    console.log(selectedInfo);
  }, [selectedInfo]);

  useEffect(() => {
    getPlantInfo();
  }, []);

  useEffect(() => {
    imgPlantInfo();
  }, [plantInfo]);

  const onChangeNickname = (e) => {
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
          body,
          config
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
    if (serialNum) {
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
      alert("시리얼 넘버를 입력해 주세요!");
    }
  };

  return (
    <>
      <NavTop />
      {modalOpen && (
        <InfoModal selectedInfo={selectedInfo} setModalOpen={setModalOpen} />
      )}
      <div className="top_section">
        <h1>식물 등록</h1>
      </div>
      <Container className="plant-info-container">
        <Row>
          <Col sm={12} md={5} className="plant-info-col">
            {imgPlantInfo()}
          </Col>

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
                    <p
                      className="checkP"
                      style={{
                        color: "red",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
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
