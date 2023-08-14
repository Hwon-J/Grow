import React from "react";
import "./plantcard.css";
import { useNavigate } from "react-router-dom";
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
