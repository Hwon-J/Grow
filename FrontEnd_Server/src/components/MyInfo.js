import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import myImage from '../assets/1.jpg';
import './MyInfo.scss';


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

  console.log(formattedToday);
  console.log(formattedStartDay);

  const daysDifference = calDay(formattedStartDay, formattedToday)+1;

  console.log(daysDifference);

  useEffect(() => {
    // 백엔드 API로부터 데이터를 가져옵니다
    // 예를 들어, fetch나 Axios를 사용하여 데이터를 가져올 수 있습니다
    // 여기서는 setTimeout을 사용하여 가짜 API 호출을 시뮬레이션합니다
    setTimeout(() => {
      // 백엔드에서 가져온 데이터를 'data' 변수에 가정합니다
      setPlantInfo(data);

    }, 1000); // 1초의 지연을 시뮬레이션하기 위해 1000ms를 사용합니다
  }, []);

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