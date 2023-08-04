import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import myImage from '../assets/1.jpg';
import { useParams } from 'react-router-dom';
import './MyInfo.scss';
import { useSelector } from "react-redux";


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
  const [myplant, setMyplant] = useState([]);
  const today = new Date(); 
  const formattedToday = formatDate(today.toISOString());
  const formattedStartDay = formatDate(myplant.start_date);
  const { id } = useParams();
  // console.log(id, typeof(id));
  // console.log(formattedToday);
  // console.log(formattedStartDay);

  
  const currentUser = useSelector((state) => state.currentUser);
  const token = currentUser.token;
  // console.log(token);
  const daysDifference = calDay(formattedStartDay, formattedToday)+1;
  // console.log(daysDifference);

  
//http://i9c103.p.ssafy.io:30001/api/plant/myplant/${id}
//http://192.168.100.37:30001/api/plant/myplant/${id}

  const getPlantInfo = async () => {
    const config = {
        headers: {
          Authorization: token, 
        },
      };
      // console.log(id);

    try {
      const response = await axios.get(`http://i9c103.p.ssafy.io:30001/api/plant/myplant/${id}`, config);
      // console.log(response.data);
      // console.log(response.data.data[0], 'ty');
      setMyplant(response.data.data[0]);

      // console.log(myplant, 'typ');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlantInfo();
  }, []);

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
      </div>       
    </>
  )
}

export default MyInfo;