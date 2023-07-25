import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlantInfoComponent from '../components/plant/PlantInfoComponent';

const PlantSpecies = () => {
  const [plantInfo, setPlantInfo] = useState([]);
  const [checkIdx, setCheckIdx] = useState(-1); // 초기값을 -1로 설정

  useEffect(() => {
    getPlantInfo();
  }, []);

  const imgPlantInfo = () => {
    return plantInfo.map((info, index) => (
      <img src={info.imgSrc} key={index} onClick={() => onClickInfo(index)} />
    ));
  };

  const getPlantInfo = async () => {
    try {
      const response = await axios.get("식물 데이터 주소");
      setPlantInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickInfo = (idx) => {
    setCheckIdx(idx);
  };

  return (
    <div>
      {imgPlantInfo()}
      {/* checkIdx가 null인 경우 빈 정보를 보내도록 처리 */}
      {checkIdx !== null && (
        <PlantInfoComponent props={checkIdx !== -1 ? plantInfo[checkIdx] : {}} />
      )}
    </div>
  );
};

export default PlantSpecies;
