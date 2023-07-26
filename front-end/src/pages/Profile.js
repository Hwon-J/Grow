// 김태형
import React, {useEffect, useState} from 'react';
import PlantCard from '../components/plantCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

// 물 데이터 서버 켜졌을 때 자동으로 받아보는 코드
const Profile = () => {
  const [open, setOpen] = useState([]);
  useEffect(() => {
    waterPlanData();
  }, [])
  const waterPlanData = async () => {
    try {
      const response = await axios.get('물준 axios주소');
      setOpen(response.data);
    } catch(err) {
      console.log('에러가 발생', err);
    }
  };

// 식물 데이터 서버 켜졌을 때 자동으로 받아보는 코드 
  const [plant, setPlant] = useState([]);
  const [pot, setPot] = useState([]);
  const [growinPlant, setGrowinPlant] = useState([]);
  const [plantComplete, setPlantComplete] = useState([]);
  
  useEffect(() => {
    plantData(); potData();
  }, [])
  // 화분 데이터 받아와서 화분데이터 저장
  const potData = async () => {
    try {
      const response = await axios.get('화분 데이터 주소');
      setPot(response.data);
    }
    catch (error) {
      console.log('에러', error)
    }
  }
  // 식물 데이터 받아오기 >> 식물하나하나 비교해서 
  // complete 가 0이면 키우는 중 || 1이면 완료된 식물이라 생각하고 데이터 저장
  const plantData = async () => {
    try {
      const response = await axios.get('식물 데이터 axios주소');
      setPlant(response.data)
      setGrowinPlant(response.data.filter((plant) => plant.complete === 0))
      setPlantComplete(response.data.filter((plant) => plant.complete === 1))
    }
    catch (error) {
      console.log('에러', error)
    }
  }

  // 현재 유저정보 state에서 가져오기
  // const currentUser = useSelector(state => state.user.currentUser);
  // 임시 유저정보
  const currentUser = {
    name: '김태형',
    email: 'sol20s@naver.com'
  };

  // 키우는 중인 식물 카드 
  const NotcompleteCardSet = () => {
    return growinPlant.map((plant) => {
      return <PlantCard key={plant.id} props={plant} />; // plant의 고유한 id 값을 사용하여 key prop을 설정해주세요
    });
  };
  
  // 완료된 식물 카드
  const completeCardSet = () => {
    return plantComplete.map((plant) => {
      return <PlantCard key={plant.id} props={plant} />; // plant의 고유한 id 값을 사용하여 key prop을 설정해주세요
    });
  };

  return (
    <React.Fragment>
      <div>
        <h1>Profile</h1>
        <h2>name: {currentUser.name}</h2>
        <h2>email: {currentUser.email}</h2>
      </div>
      <div className="container">
        {completeCardSet()}
      </div>
      <div className="container">
        {NotcompleteCardSet()}
      </div>
    </React.Fragment>
  );
};

export default Profile;