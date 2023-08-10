import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./MyInfo.scss";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/Urls";
import { Grid } from "@mui/material";
import PlantDeleteComponent from "./plant/PlantDelete";


// 가져오는 날짜 형식을 YYYYMMDD로 변환
const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

// 두 날짜 사이의 차이를 구하는 함수
const calDay = (date1, date2) => {
  const [year1, month1, day1] = [date1.slice(0, 4), date1.slice(4, 6), date1.slice(6)];
  const [year2, month2, day2] = [date2.slice(0, 4), date2.slice(4, 6), date2.slice(6)];

  // 두 개의 Date 객체를 생성합니다.
  const firstDate = new Date(year1, month1 - 1, day1); // month는 0부터 시작합니다.
  const secondDate = new Date(year2, month2 - 1, day2);

  // 두 날짜의 차이를 다루기 쉬운 형식으로 변환하고, 날짜 차이를 일 단위로 계산합니다.
  const differenceInTime = secondDate - firstDate;
  const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);

  return differenceInDays;
};

// 해당 식물의 정보를 보여주는 컴포넌트
const MyInfo = () => {
  // 오늘 날짜와 식물을 키우기 시작한 날짜를 가져옴
  const [myplant, setMyplant] = useState([]);
  const today = new Date();
  console.log(today);
  console.log(today.toISOString());
  const formattedToday = formatDate(today.toISOString());
  console.log(formattedToday);
  const formattedStartDay = formatDate(myplant.start_date);
  console.log(formattedStartDay);
  const [spices, setSpices] = useState();
  // params로 식물 id를 가져옴
  const { id } = useParams();
  const navigate = useNavigate();
  // 현재 로그인한 유저의 토큰을 가져옴
  const currentUser = useSelector((state) => state.currentUser);
  const token = currentUser.token;

  // 식물을 키운 기간을 구함
  const daysDifference = calDay(formattedStartDay, formattedToday) + 1;
  console.log(daysDifference);


  const checkspices = [
    "청경채",
    "상추",
    "토마토",
    "몬스테라",
    "치자나무",
    "싱고니움",
    "베고니아",
    "시클라멘",
    "율마",
    "알로카시아",
  ];

  

  // 해당 식물의 정보를 가져오는 함수
  const getPlantInfo = async () => {

    
    const config = {
      headers: {
        Authorization: token,
      },
    };

    try {
      const response = await axios.get(
        `${BASE_URL}/api/plant/myplant/${id}`,
        config
      );
      setMyplant(response.data.data[0]);
      console.log(myplant);
      console.log(response.data.data[0].start_date);
      const formattedStartDay = formatDate(myplant.start_date);
      console.log(formattedStartDay);
      
    } catch (error) {
      console.error(error);
    }
  };


// 식물 키우기 완료로 상태를 바꿔주는 함수
  // PUT으로 수정
  const completePlant = async () => {
  console.log(token);
  const config = {
    headers: {
      Authorization: token,
    },
  };
  try {
    const response = await axios.put(
      `${BASE_URL}/api/plant/complete/${id}`,
      "",
      config
    );
    window.location.href = "/profile";
    console.log(response.data);
    console.log("성공");
  } catch (error) {
    console.error(error);
  }
};




  // 해당 식물 삭제
  const deletePlantData = async () => {
  const config = {
    headers: {
      Authorization: token,
    },
  };

  try {
    const response = await axios.delete(
      `${BASE_URL}/api/plant/myplant/${id}`,
      config
    );
    window.location.href = "/profile";
  } catch (error) {
    console.error(error);
  }
};

  // 시작하면 getPlantInfo 실행
  useEffect(() => {
    getPlantInfo();
  }, []);

  // myplant가 없으면 로딩중
  if (!myplant) {
    return <div>Loading...</div>;
  }

  
  return (
    <>
      <div className="info_box">
        <Grid item xs={5} className="rounded-image">
          <img
            className="myinfo-img"
            src={`/plantInfoimg/${myplant.plant_info_index}.png`}
          />
        </Grid>
        <Grid item xs={7} className="info_box_right">
          {myplant.complete !== 1 && (
            <div className="info_box_button" onClick={completePlant}>
              완료
            </div>
          )}
          {myplant.complete === 1 && (
            <PlantDeleteComponent deletePlantData={deletePlantData}>
              회원탈퇴
            </PlantDeleteComponent>
          )}

          {myplant && myplant.plant_name && <h3 style={{fontSize: "50px"}}>{myplant.plant_name}</h3>}

          {myplant && myplant.plant_info_index && (
            <h5>종: {checkspices[(myplant.plant_info_index - 1) % 10]}</h5>
          )}
          {myplant && myplant.child_name && (
            <h5>아이이름: {myplant.child_name}</h5>
          )}
          {myplant && myplant.start_date && (
            <h5>
              시작일: {myplant.start_date.slice(0, 10)}({daysDifference}
              일차)
            </h5>
          )}
        </Grid>
      </div>
    </>
  );
};

export default MyInfo;
