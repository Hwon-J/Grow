// 김태형
import { Form, Row, Col, Card } from "react-bootstrap";
import style from "./InfoImg.module.css";

// 식물 종 데이터 컴포넌트
export const imgPlantInfo = ({ plantInfo, handleShow, selectedInfo }) => {
  return (
    <Row className="scroll-container">
      {plantInfo.map((info) => (   // 식물 종 데이터 하나하나 꺼내서 이미지로 만들기 
        <Col key={info.index} xs={4} md={6} style={{ marginTop: "10px" }}>
          <Card className="plant-img-card h-100">
            <Card.Img 
              className={style.info_img}
              thumbnail="true"
              src={`./plantInfoimg/${info.index}.png`}
              // 클릭시 handleShow : 식물 선택 후 모달열기
              onClick={() => handleShow(info)}   
              style={{
                border:
                  selectedInfo?.index === info.index
                    ? "0.1rem solid rgb(56, 181, 203)"
                    : "none",
                background:
                  selectedInfo?.index === info.index
                    ? "rgb(220, 233, 224)"
                    : "none",
                width: "100%",
                height: "100%",
              }}
            />
            <div className="plant_overlay" onClick={() => handleShow(info)}>
              <span>{info.species}</span>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

// 식물 종 선택하면 나오는 컴포넌트
export const selectInput = ({ selectedInfo }) => {
  // selectedInfo가 존재하면 변경 불가능한 selectedInfo.species값이 들어간 폼이 생김
  // 존재하지 않으면 없애기
  return selectedInfo ? ( 
    <Form.Control
      style={{ fontSize: "20px" }}
      type="text"
      placeholder="식물을 선택해 주세요"
      value={`선택된 식물: ${selectedInfo.species || ""}`}
      readOnly
    />
  ) : null;
};
