// 김태형

import React from 'react';

const PlantInfoComponent = (props) => {
  console.log(props.props)
  const prop = props.props

  return (
    <div>
      {/* 해당 props의 정보가 있는지 없는지에 따라서 보여주는 화면 달라지게 */}
      <h3>{prop.species ? "식물 : " + prop.species : ''}</h3>
      <h3>{prop.info ? "식물 : " + prop.info : ''}</h3>
      <h3>{prop.temperature_upper ? "최고온도 : " + prop.temperature_upper : ''}</h3>
      <h3>{prop.temperature_lower ? "최저온도 : " + prop.temperature_lower : ''}</h3>
      <h3>{prop.max_water_period ? "물을 줘야하는 최대 날 : " + prop.max_water_period : ''}</h3>
      <h3>{prop.level ? "난이도 : " + prop.level : '식물을 선택해 주세요'}</h3>
    </div>
  );
}

export default PlantInfoComponent;