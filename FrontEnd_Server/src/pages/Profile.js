//김태형
import React, { useEffect, useState, useRef } from "react";
import PlantCard from "../components/plant/plantCard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import NavTop from "../components/NavTop";
// import Footer from "../components/Footer";
import "./Profile.css";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// import required modules
import { FreeMode, Pagination } from "swiper/modules";

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
      id: 1,
    },
    {
      plant_info: "상추",
      plant_name: "상츠",
      child_name: "김태형",
      difficulty: 5,
      imgname: 2,
      id: 72,
    },
    {
      plant_info: "상추",
      plant_name: "상츠",
      child_name: "김태형",
      difficulty: 5,
      imgname: 3,
      id: 62,
    },
    {
      plant_info: "상추",
      plant_name: "상츠",
      child_name: "김태형",
      difficulty: 5,
      imgname: 4,
      id: 42,
    },
    {
      plant_info: "상추",
      plant_name: "상츠",
      child_name: "김태형",
      difficulty: 5,
      imgname: 5,
      id: 32,
    },
    {
      plant_info: "상추",
      plant_name: "상츠",
      child_name: "김태형",
      difficulty: 5,
      imgname: 5,
      id: 32,
    },
    {
      plant_info: "상추",
      plant_name: "상츠",
      child_name: "김태형",
      difficulty: 5,
      imgname: 5,
      id: 32,
    },
    {
      plant_info: "상추",
      plant_name: "상츠",
      child_name: "김태형",
      difficulty: 5,
      imgname: 5,
      id: 32,
    },
    {
      plant_info: "상추",
      plant_name: "상츠",
      child_name: "김태형",
      difficulty: 5,
      imgname: 5,
      id: 32,
    },
    {
      plant_info: "상추",
      plant_name: "상츠",
      child_name: "김태형",
      difficulty: 5,
      imgname: 5,
      id: 32,
    },
  ]);
  const [plantComplete, setPlantComplete] = useState([
    {
      plant_info: "깻잎",
      plant_name: "깻잌",
      child_name: "김민국",
      difficulty: 5,
      imgname: 6,
      id: 3,
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
          <SwiperSlide>
            <PlantCard key={plant.id} props={plant} />
          </SwiperSlide>
        ))}
      </div>
    );
  };

  const completeCardSet = () => {
    return (
      <div className="cardContainer">
        {plantComplete.map((plant) => (
          <SwiperSlide>
            <PlantCard key={plant.id} props={plant} />
          </SwiperSlide>
        ))}
      </div>
    );
  };

  return (
    <React.Fragment>
      <NavTop />
      <div className="container profile-container">
        <div className="profile-left"></div>
        <div className="profile-right">
          <div>
            <h2>키우는 식물</h2>
            <Swiper
              slidesPerView={6}
              spaceBetween={30}
              freeMode={true}
              pagination={{
                clickable: true,
              }}
              modules={[FreeMode, Pagination]}
              className="mySwiper"
            >
              {NotcompleteCardSet()}
              <SwiperSlide>
                <div className="plantcard">
                  <div className="bg">
                    <div className="plantcard-details"></div>
                  </div>
                  <div className="blob"></div>
                  <button className="button type1 plantcard-button">
                    <span className="btn-txt">+</span>
                  </button>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <h2>키운식물</h2>
            <Swiper
              slidesPerView={6}
              spaceBetween={30}
              freeMode={true}
              pagination={{
                clickable: true,
              }}
              modules={[FreeMode, Pagination]}
              className="mySwiper"
            >
              {completeCardSet()}
            </Swiper>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Profile;
