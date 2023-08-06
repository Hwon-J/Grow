import React from "react";
import "./plantcard.css";
import { useNavigate } from "react-router-dom";
const PlantCard = (props) => {
  const data = props.props;
  const navigate = useNavigate();
  const goDiary = () => {
    navigate(`/diary/${data.index}`)
  }

  return (
    <div className="plantcard">
      <div className="bg">
        <div className="plantcard-details">
          {/* Added className="plantcard-details" */}
          <img src={`./plantimg/${data.imgname}.png`} />
          <p className="text-title">{data.plant_name}</p>
          <p className="card-text-body">{data.child_name}의 식물친구</p>
        </div>
      </div>
      <div className="blob"></div>
      <button className="button type1 plantcard-button" onClick={goDiary}>
        <span className="btn-txt">상세보기</span>
      </button>
    </div>
  );
};

export default PlantCard;
