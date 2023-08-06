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

function Example() {
  const products = [
    {
      id: 1,
      name: 'Basic Tee',
      href: '#',
      imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
      imageAlt: "Front of men's Basic Tee in black.",
      price: '$35',
      color: 'Black',
    },
    
  ]
  
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">진행중인 식물</h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

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
  const [showInProgress, setShowInProgress] = useState(true);

  return (
    <div className="profile-total">
      <NavTop />
      <div className="profilepage container">
        <div className="row">
          
          <div className="container profile col-lg-8 row">
            <div className="col-12">
              <h1 className="profile_title">PROFILE</h1>
            </div>
            <div>
            <button className="btn btn-primary" onClick={() => setShowInProgress(true)}>진행중인 식물</button>
            <span>  |  </span>
            <button className="btn btn-success" onClick={() => setShowInProgress(false)}>완료된 식물</button>
            </div>
            <Example />
            <div className="container plant">
              {showInProgress && (<div className="plant-ing">
                <div>
                  <h2 >진행중인 식물</h2>
                  <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
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
              </div>)}
              {!showInProgress && (<div className="plant-complete">
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
              </div>)}
              
              </div>
            </div>
          </div>
      </div>
      </div>
    
  );
};

export default Profile;
