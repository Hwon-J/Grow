import React, { useState } from 'react';
import './item.css';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
  MDBRipple
} from 'mdb-react-ui-kit';

const Item = ({ item, handleClick }) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleMouseEnter = () => {
    setShowInfo(true);
  };

  const handleMouseLeave = () => {
    setShowInfo(false);
  };

  return (
    <MDBCard className='item-card'>
      <MDBRipple rippleColor='light' rippleTag='div'>
        <MDBCardImage src={item.img} fluid alt='...' />
      </MDBRipple>
      <MDBCardBody className='item-card-body'>
        <MDBCardTitle>{item.name}</MDBCardTitle>
        <button href='#' onClick={handleClick} className="custom-button create-btn item-btn">장바구니 추가</button>
      </MDBCardBody>
    </MDBCard>
  );
};

export default Item;
