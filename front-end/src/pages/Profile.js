import React, { useEffect, useState } from "react";
import PlantCard from "../components/plant/plantCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import NavTop from "../components/NavTop";
import Footer from "../components/Footer";
import "../components/plant/Profile.css";

const Profile = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const authToken = currentUser.token;
  console.log(currentUser, authToken);
  const navigate = useNavigate();

  const [plant, setPlant] = useState([]);
  const [pot, setPot] = useState([]);
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
      <div>
        <div>
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
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Profile;
