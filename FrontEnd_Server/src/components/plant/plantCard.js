import React from "react";
import "./plantcard.css";
import { useNavigate } from "react-router-dom";
const PlantCard = (props) => {
  const data = props.props;
  const navigate = useNavigate();
  const goDiary = () => {
    navigate(`/diary/${data.index}`);
  };
  console.log(data);
  return (
    <div className="plantcard">
      <div className="plantcard-md">
        <div className="bg">
          <div className="plantcard-details">
            {/* Added className="plantcard-details" */}
            <img src={`./plantimg/${data.plant_info_index - 20}.png`} />
            <p className="text-title">{data.plant_name}</p>
            <p className="card-text-body">{data.child_name}의 식물친구</p>
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
