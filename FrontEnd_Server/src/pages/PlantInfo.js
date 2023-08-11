//김태형
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/Urls";
import axios from "axios";
import NavTop from "../components/NavTop";
import InfoModal from "../components/plant/InfoModal";
import {
  imgPlantInfo,
  selectInput,
} from "../components/PlantInfo/InfoComponent";
import "./plantinfo.scss";
import { Form, Row, Col, Stack, Container, InputGroup } from "react-bootstrap";
import { reSwal } from "../utils/reSwal";

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

  // 식물 종 데이터 확인할 모달 열지 말지 확인할 변수, 함수
  const [modalOpen, setModalOpen] = useState(false);
  const handleShow = (info) => {
    setSelectedInfo(info);
    setModalOpen(true);
  };
  // 헤더 값
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${authToken}`,
    },
  };
  // 화면 시작시 식물종 데이터 받아오게 만들기
  useEffect(() => {
    getPlantInfo();
  }, []);

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
  // 식물 등록 메서드
  const createPlant = async (e) => {
    e.preventDefault();
    // 등록되면 안되는 조건식 추가
    if (checkedResult === false) {
      reSwal("warning", `시리얼 넘버를 확인해주세요`);  //Swal 재사용
      return;
    }
    if (nickname.length === 0 || nickname.length > 12) {
      reSwal("warning", `식물 애칭을 1글자 이상 12글자 이하로 입력해주세요`);
      return;
    }
    if (childname.length === 0) {
      reSwal("warning", `아이 이름을 입력해주세요`);
      return;
    }
    if (childage.length === 0) {
      reSwal("warning", `나이를 입력해주세요`);
      return;
    }
    if (!selectedInfo.index) {
      reSwal("warning", `식물을 선택해 주세요`);
      return;
    }
    // 식물정보 보낼 body
    const body = {
      plant_name: nickname,
      serial_number: serialNum,
      plant_info_index: selectedInfo?.index,
      child_name: childname,
      child_age: parseInt(childage),
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/api/plant/create`,
        body,
        config
      );
      navigate(`/profile`); // 성공적으로 등록되면 프로필페이지로 이동
    } catch (error) {
      console.log(error.message);
    }
  };
  // 식물 종 데이터 받아오게 만드는 메서드
  const getPlantInfo = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/plant/info`);
      setPlantInfo(response.data.info); // 식물 종 데이터 변수에 받아온 데이터 넣기 
    } catch (error) {
      console.log(error);
    }
  };
  // 시리얼 넘버 확인하는 메서드
  const checkSerial = async () => {
    //시리얼 넘버가 있을때
    if (serialNum) {
      try {
        const response = await axios.get(`${BASE_URL}/api/pot/${serialNum}`);
        if (response.data.code === 202) {
          // 202라면 유효한 시리얼넘버가 아니라고 생각하고 에러 메세지 변수에 메세지 저장
          setCheckedResult(false);
          setErormessage(response.data.message);
          setCheckNum("");
        }
        // 성공이라면 성공 메세지 변수에 메세지 넣고 에러메세지 없애기
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
      reSwal("warning", "시리얼 넘버를 입력해 주세요!");
    }
  };
  // 식물 모달 닫는 메서드
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <NavTop />
      {/* modalOpen 데이터가 있을때 모달창 띄우기 */}
      {modalOpen && (
        <>
          <div className="modal-overlay" onClick={closeModal}></div>
          <InfoModal selectedInfo={selectedInfo} setModalOpen={setModalOpen} />
        </>
      )}

      <div className="top_section">
        <h1 style={{ fontSize: "100px" }}>식물 등록</h1>
      </div>
      <Container className="plant-info-container">
        <Row>
          <Col
            sm={12}
            md={5}
            className="plant-info-col"
            style={{ paddingBottom: "10px" }}
          >
            {imgPlantInfo({ plantInfo, handleShow, selectedInfo })}
            {/* 식물 이미지 나오게 만드는 컴포넌트*/}
          </Col>

          <Col sm={12} md={6} className="plant-info-col plant-colo">
            <Form onSubmit={createPlant}>
              <Row
                style={{
                  height: "100vh",
                  justifyContent: "center",
                }}
              >
                <Col xs={10}>
                  <Stack gap={3} className="plantinfo-stack">
                    <h2 style={{ fontSize: "70px" }}>식물 등록</h2>
                    <p
                      style={{
                        fontSize: "20px",
                        marginTop: "-20px",
                        marginBottom: "0",
                        textAlign: "center",
                      }}
                    >
                      아이의 친구가 될 식물을 등록해주세요
                    </p>
                    {/* 선택된 식물 종 확인 할 수 있는 컴포넌트 */}
                    {selectInput({ selectedInfo })}
                    <Form.Control
                      style={{ fontSize: "20px" }}
                      type="text"
                      placeholder="식물 애칭"
                      value={nickname}
                      onChange={onChangeNickname}
                    />
                    <Form.Control
                      style={{ fontSize: "20px" }}
                      type="text"
                      placeholder="아이 이름"
                      value={childname}
                      onChange={onChangeChildname}
                    />
                    <InputGroup>
                      <Form.Control
                        style={{ fontSize: "20px", paddingLeft: "12%" }}
                        type="text"
                        placeholder="시리얼 넘버"
                        value={serialNum}
                        onChange={onChangeSerialNum}
                      />
                      <button
                        style={{ paddingLeft: "10px", paddingRight: "10px" }}
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
                        marginTop: "-10px",
                        marginBottom: "-8px",
                      }}
                    >
                      {checkNum ? checkNum : errormessage}
                    </p>
                    <Form.Control
                      style={{ fontSize: "20px" }}
                      type="number"
                      placeholder="나이"
                      value={childage}
                      onChange={onChangeChildage}
                      min="1"
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
