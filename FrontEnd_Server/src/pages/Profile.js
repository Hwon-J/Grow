//김태형
import React, { useEffect, useState } from "react";
import PlantCard from "../components/plant/plantCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import NavTop from "../components/NavTop";
// import Footer from "../components/Footer";
import "./Profile.css";

const Profile = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const authToken = currentUser.token;
  console.log(currentUser, authToken);
  const navigate = useNavigate();

  const [growinPlant, setGrowinPlant] = useState([
    {
      plant_info: "상추",
      plant_name: "상츠",
      child_name: "김태형",
      difficulty: 5,
      imgname: 1,
      id:1
    },
    {
      plant_info: "상추",
      plant_name: "상츠",
      child_name: "김태형",
      difficulty: 5,
      imgname: 1,
      id:2
    },
  ]);
  const [plantComplete, setPlantComplete] = useState([
    {
      plant_info: "깻잎",
      plant_name: "깻잌",
      child_name: "김민국",
      difficulty: 5,
      imgname: 1,
      id:3
    },
  ]);
  // // 식물 종 데이터 변경할 메서드
  // const getPlants = async () => {
  //   try {
  //     const response = await axios.get("식물 데이터 주소");
  //     const plantsList = response.data;
  //     const growing = plantsList.filter((plant) => plant.complete === 0);
  //     const complete = plantsList.filter((plant) => plant.complete === 1);
  //     setGrowinPlant(growing);
  //     setPlantComplete(complete);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   getPlants();
  // }, []);

  const NotcompleteCardSet = () => {
    return (
      <div className="cardContainer">
        {growinPlant.map((plant) => (
          <PlantCard key={plant.id} props={plant} />
        ))}
      </div>
    );
  };

  const completeCardSet = () => {
    return (
      <div className="cardContainer">
        {plantComplete.map((plant) => (
          <PlantCard key={plant.id} props={plant} />
        ))}
      </div>
    );
  };

  return (
    <React.Fragment>
      <NavTop />
      <div className="profile-container">
        <div className="profile-left">
          <h1>Profile</h1>
        </div>
        <div className="profile-right">
          <div>
            <h2>키우는 식물</h2>
            {NotcompleteCardSet()}
          </div>
          <div>
            <h2>키운식물</h2>
            {completeCardSet()}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Profile;
