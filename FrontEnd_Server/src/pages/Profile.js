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
import { useDispatch } from "react-redux";
import { logoutUser } from "../reducers/userSlice";
import homevideo2 from "../assets/homevideo2.mp4";
import { BASE_URL } from "../utils/Urls";

const Profile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const token = currentUser.token;
  console.log(token);
  const navigate = useNavigate();
  const config = {
    headers: {
      Authorization: token,
    },
  };
  const [growinPlant, setGrowinPlant] = useState([
    {
      plant_info: "상추",
      plant_name: "싱싱이",
      child_name: "김태형",
      difficulty: 5,
      imgname: 1,
      id: 1,
    },
    {
      plant_info: "상추",
      plant_name: "추상이",
      child_name: "김태형",
      difficulty: 5,
      imgname: 2,
      id: 2,
    },
    {
      plant_info: "상추",
      plant_name: "마토",
      child_name: "김태형",
      difficulty: 5,
      imgname: 3,
      id: 62,
    },
    {
      plant_info: "상추",
      plant_name: "닉넴추천",
      child_name: "김태형",
      difficulty: 5,
      imgname: 4,
      id: 3,
    },
    {
      plant_info: "상추",
      plant_name: "흰꽃",
      child_name: "김태형",
      difficulty: 5,
      imgname: 5,
      id: 4,
    },
    {
      plant_info: "상추",
      plant_name: "푸른이",
      child_name: "김태형",
      difficulty: 6,
      imgname: 6,
      id: 5,
    },
    {
      plant_info: "상추",
      plant_name: "빨갱이",
      child_name: "김태형",
      difficulty: 7,
      imgname: 7,
      id: 6,
    },
    {
      plant_info: "상추",
      plant_name: "이름없는꽃",
      child_name: "김태형",
      difficulty: 5,
      imgname: 8,
      id: 7,
    },
    {
      plant_info: "상추",
      plant_name: "미니나무",
      child_name: "김태형",
      difficulty: 5,
      imgname: 9,
      id: 8,
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
  const withdrawal = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/user/`,config);
      alert(response.data.message);
      dispatch(logoutUser())
      navigate("/signup");
    } catch (error) {
      console.log(error);
    }
  };
  // 식물 종 데이터 변경할 메서드
  const getPlants = async () => {
    console.log("보내기 " + token);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/plant/myplant/`,
        config
      );
      console.log(response.data.data);
      const plantsList = response.data.data;
      const growing = plantsList.filter((plant) => plant.complete === 0);
      const complete = plantsList.filter((plant) => plant.complete === 1);
      setGrowinPlant(growing);
      setPlantComplete(complete);
      console.log(growinPlant);
      console.log(plantComplete);
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
          <SwiperSlide key={plant.id}>
            <PlantCard  props={plant} />
          </SwiperSlide>
        ))}
      </div>
    );
  };

  const completeCardSet = () => {
    return (
      <div className="cardContainer">
        {plantComplete.map((plant) => (
          <SwiperSlide key={plant.id}>
            <PlantCard  props={plant} />
          </SwiperSlide>
        ))}
      </div>
    );
  };

  const createCard = () => {
    navigate("/plantinfo");
  };
  const [showInProgress, setShowInProgress] = useState(true);

  return (
    <div className="profile-total">
      <NavTop />
      <div className="profilepage container">
        <div className="profile-row">
          <div className="container profile row">
            <div className="col-12">
              <h1 className="profile_title">PROFILE</h1>
            </div>
            <div className="button-container">
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowInProgress(true)}
                >
                  진행중인 식물
                </button>
                <span> | </span>
                <button
                  className="btn btn-success"
                  onClick={() => setShowInProgress(false)}
                >
                  완료된 식물
                </button>
              </div>
              <button className="btn btn-danger signout" onClick={withdrawal}>
                회원탈퇴
              </button>
            </div>

            <div className="container plant">
              {showInProgress && (
                <div className="plant-ing">
                  <div>
                    <Swiper
                      slidesPerView={4}
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
                            <div className="plantcard-details">
                              <h5>
                                새 식물친구
                                <br />
                                등록해주기
                              </h5>
                            </div>
                          </div>
                          <div className="blob"></div>
                          <button
                            className="button type1 plantcard-button"
                            onClick={createCard}
                          >
                            <span className="btn-txt">+</span>
                          </button>
                        </div>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                </div>
              )}
              {!showInProgress && (
                <div className="plant-complete">
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
