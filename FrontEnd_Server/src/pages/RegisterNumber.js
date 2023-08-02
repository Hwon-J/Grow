//npm install react-icons --save
// 김태형
import React, { useState } from "react";
import NavTop from '../components/NavTop';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import './register.css';
import { TbLeaf } from "react-icons/tb";
import { CiLock } from "react-icons/ci";
import { MdSend } from "react-icons/md";
import homevideo2 from '../assets/homevideo2.mp4';


const RegisterNumber = () => {
  // nickname, serialNumber 등록해야함
  const [nickname, setNickname] = useState("")
  const [serialNum, setSerialNum] = useState("")
  const navigate = useNavigate(); // 컴포넌트 이동하기 위해서 
  const onChangeNickname = (e) => { // 입력한 값 계속 바뀌는 것 확인
    setNickname(e.target.value);
  };
  const onChangeSerialNum = (e) => {
    setSerialNum(e.target.value);
  };
  const handleSerial = () => {
    // 데이터를 함께 보낼 객체를 생성 nickname, serialNum 
    const data = {
      nickname: nickname,
      serialNum: serialNum,
    };

    // /plantinfo 페이지로 데이터(state)와 함께 이동
    navigate('/plantinfo', { state : data }); 
  };
  
  return (
    <>
      <NavTop />
      <div className='container d-flex justify-content-center align-items-center'>
        <div className='leftimg'>
          <video autoPlay loop muted width="360" height="640">
            <source src={homevideo2} type="video/mp4" />
          </video>
        </div>
        <div className="rightinput">
          <form onSubmit={handleSerial}>
            <p> 식물의 애칭 </p>
            <TbLeaf/>  <input onChange={onChangeNickname}/><hr/>
            <p>시리얼 넘버 등록</p>
            <CiLock /> <input onChange={onChangeSerialNum} />
            <button className="registerbtn" type="submit" >
              <MdSend onClick={handleSerial} />
            </button>
          </form>
          
        </div>
      </div>
      <Footer />
    </>
  )
}

export default RegisterNumber
