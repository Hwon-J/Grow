import React, { useState } from 'react';
import './item.css';
import Figure from 'react-bootstrap/Figure';
const Item = ({ item, handleClick }) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleMouseEnter = () => {
    setShowInfo(true);
  };

  const handleMouseLeave = () => {
    setShowInfo(false);
  };

  return (
    <div className='div-item'>
      <Figure.Image
        src={item.img} 
        alt='...'
      />
      <Figure.Caption>
      {item.name}
      <button href='#' onClick={handleClick} className="custom-button create-btn item-btn">장바구니 추가</button>
      </Figure.Caption>
    </div>
  );
};

export default Item;
{/* <MDBCard className='item-card'>
<MDBRipple rippleColor='light' rippleTag='div'>
  <MDBCardImage src={item.img} fluid alt='...' />
</MDBRipple>
<MDBCardBody className='item-card-body'>
  <MDBCardTitle>{item.name}</MDBCardTitle>
  <button href='#' onClick={handleClick} className="custom-button create-btn item-btn">장바구니 추가</button>
</MDBCardBody>
</MDBCard> */}