//김태형
import React from 'react'
import { useLocation } from 'react-router-dom';


const PlantInfo = () => {
    const location = useLocation(); // props랑은 다르게 라우팅 관련해서 데이터 전달하는 법
    const data = location.state; // 전달된 데이터 객체
  
    // dataReceived 객체에서 nickname과 serialNum 사용
    const nickname = data.nickname;
    const serialNum = data.serialNum;

  return (
    <div>
        <p>{nickname}</p>
        <p>{serialNum}</p>
    </div>
  )
}

export default PlantInfo