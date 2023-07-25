//김태형
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlantInfoComponent from '../components/plant/PlantInfoComponent';
import { useNavigate } from 'react-router-dom';
import assets1 from '../assets/1.jpg';
import assets2 from '../assets/2.jpg';

const PlantSpecies = () => {
  // 식물종 정보, 식물종 정보중 index확인용 변수
  const [plantInfo, setPlantInfo] = useState([]);
  const [checkIdx, setCheckIdx] = useState(-1);
  const navigate = useNavigate();
  // 해당 페이지가 실행되면 getPlantInfo : 식물 종 데이터 받아오는 메서드  가 자동으로 실행되게 만들기
  useEffect(() => {
    getPlantInfo();
  }, []);

  // plantInfo가 변경될 때마다 imgPlantInfo() 함수 호출
  useEffect(() => {
    imgPlantInfo();
  }, [plantInfo]); 

  // plantInfo정보에서 각각의 img정보를 받아와서 이미지 처리 : 각 이미지를 클릭시 onClickInfo(index)가 넘어가서 
  // component의 정보 변경 처리
  const imgPlantInfo = () => {
    return plantInfo.map((info, index) => (
      <img src={info.imgSrc} key={index} onClick={() => onClickInfo(index)} />
    ));
  };

  // 식물 종 데이터 변경할 메서드
  const getPlantInfo = async () => {
    try {
      const response = await axios.get("식물 데이터 주소");
      setPlantInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  // 클릭시 checkIdx의 숫자가 변경
  const onClickInfo = (idx) => {
    console.log(idx)

    setCheckIdx(idx);
  };
  const pageChange = () => {
    navigate('/diary')
  }
  return (
    <div>
      {/* img출력 함수 */}
      {imgPlantInfo()}
      {/* checkIdx가 null인 경우 빈 정보를 보내도록 처리 */}
      {checkIdx !== null && (
        <PlantInfoComponent props={checkIdx !== -1 ? plantInfo[checkIdx] : {}} />
      )}

      {/* 확인용 하드코딩 */}
      <img src={assets1} key={1} onClick={() => onClickInfo(1)} />
      <img src={assets2} key={2} onClick={() => onClickInfo(2)} />
      <button onClick={pageChange()} >제출</button>
    </div>
  );
};

export default PlantSpecies;
