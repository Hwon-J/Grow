import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import './plantcomplete.css'


const PlantCompleteComponent = ({ completePlant }) => {
  const [basicModal, setBasicModal] = useState(false);
  const toggleShow = () => setBasicModal(!basicModal);
  const handleComplete = () => {
    console.log("식물완료");
    completePlant();
    toggleShow(); // 모달을 닫습니다.
  };
  return (
    <>
      <button
        className="complete_button"
        // style={{ backgroundColor: "red" }}
        onClick={toggleShow}
      >
        식물완료
      </button>
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle style={{ color: "black" }}>식물완료</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody style={{ color: "black" }}>
              식물을 완료 하시겠습니까?
            </MDBModalBody>

            <MDBModalFooter>
              <button
                className="btn btn-danger signout"
                color="secondary"
                onClick={toggleShow}
              >
                취소
              </button>
              <button className="btn btn-primary signout" onClick={handleComplete}>
                확인
              </button>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default PlantCompleteComponent;
