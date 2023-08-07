// 김태형

import React from 'react';

const PlantInfoComponent = (props) => {
  const prop = props.props

  return (
    <div>
      {/* 해당 props의 정보가 있는지 없는지에 따라서 보여주는 화면 달라지게 */}
      <p>{prop.species ? "종 : " + prop.species : ''}</p>
      <p>{prop.info ? "식물 정보: " + prop.info : ''}</p>
      <p>{prop.temperature_upper ? "최고온도 : " + prop.temperature_upper : ''}</p>
      <p>{prop.temperature_lower ? "최저온도 : " + prop.temperature_lower : ''}</p>
      <p>{prop.max_water_period ? "물을 줘야하는 최대 날 : " + prop.max_water_period : ''}</p>
      <p>{prop.level ? "난이도 : " + prop.level : '식물을 선택해 주세요'}</p>
    </div>
  );
}

export default PlantInfoComponent;