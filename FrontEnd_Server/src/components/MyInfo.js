import React, { useEffect, useState } from 'react';
import axios from 'axios';
import myImage from '../assets/1.jpg';
import { useParams } from 'react-router-dom';
import './MyInfo.scss';
import { useSelector } from "react-redux";
import { BASE_URL } from '../utils/Urls';



// 가져오는 날짜 형식을 YYYYMMDD로 변환
const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};


// 두 날짜 사이의 차이를 구하는 함수
const calDay = (firstDate, secondDate) => {
  const dateFirstDate = new Date(firstDate.substring(0, 4), firstDate.substring(4, 6) - 1, firstDate.substring(6, 8));
  const dateSecondDate = new Date(secondDate.substring(0, 4), secondDate.substring(4, 6) - 1, secondDate.substring(6, 8));
  const betweenTime = Math.abs(dateSecondDate.getTime() - dateFirstDate.getTime());
  return Math.floor(betweenTime / (1000 * 60 * 60 * 24));
};






// 해당 식물의 정보를 보여주는 컴포넌트
const MyInfo = () => {
  // 오늘 날짜와 식물을 키우기 시작한 날짜를 가져옴
  const [myplant, setMyplant] = useState([]);
  const today = new Date(); 
  const formattedToday = formatDate(today.toISOString());
  const formattedStartDay = formatDate(myplant.start_date);
  
  // params로 식물 id를 가져옴
  const { id } = useParams();

  // 현재 로그인한 유저의 토큰을 가져옴
  const currentUser = useSelector((state) => state.currentUser);
  const token = currentUser.token;

  // 식물을 키운 기간을 구함
  const daysDifference = calDay(formattedStartDay, formattedToday)+1;


  // 서버 주소
  //http://i9c103.p.ssafy.io:30001/api/plant/myplant/${id}
  //http://192.168.100.37:30001/api/plant/myplant/${id}
  //http://192.168.100.37:30001/api/plant/complete/${id}


  // 식물 키우기 완료로 상태를 바꿔주는 함수
  // PUT으로 수정
  const completePlant = async () => {
    console.log(token);
    const config = {
        headers: {
          Authorization: token,
        },
      };
      try {
        const response = await axios.put(`${BASE_URL}/api/plant/complete/${id}`,"", config);
        console.log(response.data);
        console.log('성공');
      }
      catch (error) {
        console.error(error);
      }
    }
  
  
  // 해당 식물의 정보를 가져오는 함수
  const getPlantInfo = async () => {
    const config = {
      headers: {
        Authorization: token,
      },
    };

    try {
      const response = await axios.get(`${BASE_URL}/api/plant/myplant/${id}`, config);
      setMyplant(response.data.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  // 시작하면 getPlantInfo 실행
  useEffect(() => {
    getPlantInfo();
  }, []);

  // myplant가 없으면 로딩중
  if (!myplant) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <div className='info_box'>
        <div className='info_box_left'>
        <img className="rounded-image" src={myImage} alt="Image Description" />
        </div>
        <div className='info_box_right'>
          <h5>{myplant.child_name}(이)가 키우는 {myplant.plant_name}</h5>
          <h5>키운 지 {daysDifference}일째</h5>
        </div>
        <button className='info_box_button' onClick={completePlant}>완료</button>
      </div>       
    </>
  )
}

export default MyInfo;