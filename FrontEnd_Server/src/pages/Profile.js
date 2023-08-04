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

import homevideo2 from '../assets/homevideo2.mp4';
import { BASE_URL } from "../utils/Urls";

const Profile = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const token = currentUser.token;
  console.log(token);
  const navigate = useNavigate();

  const [growinPlant, setGrowinPlant] = useState([
    {
      plant_info: "상추",
      plant_name: "뷔",
      child_name: "김태형",
      difficulty: 5,
      imgname: 1,
      id: 1,
    },
    {
      plant_info: "상추",
      plant_name: "뷔vs",
      child_name: "김태형",
      difficulty: 5,
      imgname: 2,
      id: 72,
    },
    {
      plant_info: "상추",
      plant_name: "귀요미",
      child_name: "김태형",
      difficulty: 5,
      imgname: 3,
      id: 62,
    },
    
  ]);
  const [plantComplete, setPlantComplete] = useState([
    {
      plant_info: "깻잎",
      plant_name: "깬닙이",
      child_name: "김민국",
      difficulty: 5,
      imgname: 6,
      id: 3,
    },
  ]);

  // 식물 종 데이터 변경할 메서드
  const getPlants = async () => {
    console.log("보내기 "+token)
    const config = {
      headers: {
        Authorization: token, 
      },
    };
    try {
      const response = await axios.get(`${BASE_URL}/api/plant/myplant/`,config);
      console.log(response.data.data)
      const plantsList = response.data.data;
      const growing = plantsList.filter((plant) => plant.complete === 0);
      const complete = plantsList.filter((plant) => plant.complete === 1);
      setGrowinPlant(growing);
      setPlantComplete(complete);
      console.log(growinPlant)
      console.log(plantComplete)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPlants();
  }, []);

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

  const createCard = () => {
    navigate('/register');
  }

  return (
    <div className="profile-total">
      <NavTop />
      <div className="profilepage container">
        <div className="row">
          <div className="col-lg-3  videobox">
            <video autoPlay loop muted height="450px">
                <source src={homevideo2} type="video/mp4" />
            </video>
          </div>
          <div className="container profile col-lg-8 row">
            <div className="col-12">
              <h1>PROFILE</h1>
            </div>
            <div className="container plant">
              <div className="plant-ing">
                <div>
                  <h2>진행중인 식물</h2>
                  <Swiper
                    slidesPerView={3}
                    spaceBetween={20}
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
                          <div className="plantcard-details" >
                            <h5>새 식물친구<br/>등록해주기</h5>
                          </div>
                        </div>
                        <div className="blob"></div>
                        <button className="button type1 plantcard-button" onClick={createCard}>
                          <span className="btn-txt">+</span>
                        </button>
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
              <div className="plant-complete">
                <h2>완료된 식물</h2>
                <Swiper
                  slidesPerView={3}
                  spaceBetween={20}
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
          </div>
      </div>
      </div>
    
  );
};

export default Profile;
