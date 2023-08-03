import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import myImage from '../assets/1.jpg';
import { useParams } from 'react-router-dom';
import './MyInfo.scss';
import { useSelector } from "react-redux";

const data = {
  "plant_idx": 1,
  "plant_name": "상추",
  "plant_nickname": "상츠",
  "child_name": "김민국",
  "start_day": "2023-07-09T12:00:00",
  "img": "src/assets/1.jpg"
};

const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const calDay = (firstDate, secondDate) => {
  const dateFirstDate = new Date(firstDate.substring(0, 4), firstDate.substring(4, 6) - 1, firstDate.substring(6, 8));
  const dateSecondDate = new Date(secondDate.substring(0, 4), secondDate.substring(4, 6) - 1, secondDate.substring(6, 8));
  const betweenTime = Math.abs(dateSecondDate.getTime() - dateFirstDate.getTime());
  return Math.floor(betweenTime / (1000 * 60 * 60 * 24));
};

const MyInfo = () => {
  // const navigate = useNavigate();
  const [plantInfo, setPlantInfo] = useState(data);
  const today = new Date(); // Date 객체로 초기화
  const formattedToday = formatDate(today.toISOString());
  const formattedStartDay = formatDate(plantInfo.start_day);
  const { id } = useParams();
  console.log(id);
  console.log(formattedToday);
  console.log(formattedStartDay);
  
  const currentUser = useSelector((state) => state.currentUser);
  const authToken = currentUser.token;

  const daysDifference = calDay(formattedStartDay, formattedToday)+1;
  console.log(daysDifference);

  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`, 
    },
  };

  const getPlantInfo = async () => {
    try {
      const response = await axios.get(`http://i9c103.p.ssafy.io:30001/api/plant/data/${id}`, config);
      setPlantInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlantInfo();
  }, []);

  if (!plantInfo) {
    return <div>Loading...</div>;
  }
  // const handleQuestPageButtonClick = () => {
  //   navigate('/questpage'); // Use navigate to navigate to /questpage
  // };

  
  return (
    <>
      <div className='info_box'>
        <div className='info_box_left'>
        <img className="rounded-image" src={myImage} alt="Image Description" />
        </div>
        <div className='info_box_right'>
          <h5>{plantInfo.child_name}(이)가 키우는 {plantInfo.plant_nickname}</h5>
          {/* <h5>키운지 { today }일째</h5> */}
          <h5>키운 지 {daysDifference}일째</h5>
          {/* <button onClick={handleQuestPageButtonClick}>질문 등록</button> */}
        </div>
      </div>       
    </>
  )
}

export default MyInfo;