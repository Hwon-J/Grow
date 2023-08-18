import React, { useState } from "react";
import { useNavigate } from "react-router";
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

const PlantDeleteComponent = ({ deletePlantData }) => {
  const [basicModal, setBasicModal] = useState(false);
  const toggleShow = () => setBasicModal(!basicModal);
  const handleDelete = () => {
    console.log("식물삭제");
    deletePlantData();
    toggleShow(); // 모달을 닫습니다.
  };
  return (
    <>
      <button
        className="info_box_button"
        style={{ backgroundColor: "red" }}
        onClick={toggleShow}
      >
        식물삭제
      </button>
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle style={{ color: "black" }}>식물삭제</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody style={{ color: "black" }}>
              식물을 삭제 하시겠습니까?
            </MDBModalBody>

            <MDBModalFooter>
              <button
                className="btn btn-primary signout"
                color="secondary"
                onClick={toggleShow}
              >
                취소
              </button>
              <button className="btn btn-danger signout" onClick={handleDelete}>
                삭제
              </button>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default PlantDeleteComponent;
