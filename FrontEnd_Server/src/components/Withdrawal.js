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

const Withdrawal = ({ withdrawal }) => {
  const [basicModal, setBasicModal] = useState(false);

  const toggleShow = () => setBasicModal(!basicModal);
  const handleWithdrawal = () => {
    withdrawal(); // 모달에서 "회원탈퇴" 버튼을 클릭하면 withdrawal 함수를 호출합니다.
    toggleShow(); // 모달을 닫습니다.
  };
  return (
    <>
      <button className="signout-btn" onClick={toggleShow}>
        회원탈퇴
      </button>
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>회원탈퇴</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>회원탈퇴를 하시겠습니까?</MDBModalBody>

            <MDBModalFooter>
              <button
                className="btn btn-primary signout"
                color="secondary"
                onClick={toggleShow}
              >
                취소
              </button>
              <button
                className="btn btn-danger signout"
                onClick={handleWithdrawal}
              >
                회원탈퇴
              </button>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default Withdrawal;
