import React from "react";
import "./plantcard.css";
import { useNavigate } from "react-router-dom";


// 프로필 페이지에서 보여줄 카드 컴포넌트
// CardSet.js에서 props로 받아온 데이터를 이용해 카드를 만든다.
const PlantCard = (props) => {
  const data = props.props;
  console.log("식물카드 정보"+ `${data.child_name}`);
  const navigate = useNavigate();
  const goDiary = () => {
    navigate(`/diary/${data.index}`);
  };
  return (
    <div className="plantcard">
      <div className="plantcard-md">
        <div className="bg">
          <div className="plantcard-details">
            {/* Added className="plantcard-details" */}
            <img src={`./plantInfoimg/${data.plant_info_index}.png`} />
            <p className="text-title">{data.plant_name}</p>
            <p className="card-text-body">{data.child_name}이의 식물친구</p>
          </div>
        </div>
        <div className="blob"></div>
        <button className="button type1 plantcard-button" onClick={goDiary}>
          상세보기
        </button>
      </div>
    </div>
  );
};

export default PlantCard;
