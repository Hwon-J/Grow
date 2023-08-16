import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./MyInfo.scss";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/Urls";
import { Grid } from "@mui/material";
import PlantDeleteComponent from "./plant/PlantDelete";
import PlantCompleteComponent from "./plant/PlantComplete";
// 날짜를 YYYYMMDD 형식으로 변환하는 함수
// 현재 날짜가 string 형식과 object형식 두가지로 들어오므로 두가지 경우를 모두 고려한다.
const formatDate = (dateString) => {
  let year, month, day;

  if (typeof dateString === "string") {
    // YYYY-MM-DDTHH:mm:ss.sssZ 형식인 경우
    [year, month, day] = dateString.slice(0, 10).split("-");
    return `${year}${month}${day}`;
  } else {
    // Thu Aug dd yyyy hh:mm:ss GMT+0900 형식인 경우
    const date = new Date(dateString);
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    // 월과 일의 경우 한 자릿수일 경우 앞에 0을 붙인다.
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    // 최종 형식으로 문자열을 반환한다.
    return `${year}${formattedMonth}${formattedDay}`;
  }
};

// 두 날짜 사이의 차이를 구하는 함수
const calDay = (date1, date2) => {
  const [year1, month1, day1] = [
    date1.slice(0, 4),
    date1.slice(4, 6),
    date1.slice(6),
  ];
  const [year2, month2, day2] = [
    date2.slice(0, 4),
    date2.slice(4, 6),
    date2.slice(6),
  ];

  // 두 개의 Date 객체를 생성한다.
  const firstDate = new Date(year1, month1 - 1, day1); // month는 0부터 시작
  const secondDate = new Date(year2, month2 - 1, day2);

  // 두 날짜의 차이를 다루기 쉬운 형식으로 변환하고, 날짜 차이를 일 단위로 계산
  const differenceInTime = secondDate - firstDate;
  const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);

  return differenceInDays;
};

// 해당 식물의 정보를 보여주는 컴포넌트
const MyInfo = () => {
  // 가져온 식물 정보를 저장할 state
  const [myplant, setMyplant] = useState([]);
  // 키우기 시작한 날짜와 오늘 날짜의 차이를 저장할 state
  const [daysDifference, setDaysDifference] = useState([]);
  // 오늘 날짜를 가져온다.(형식 변환 필요)
  const today = new Date();
  const formattedToday = formatDate(today);

  // params로 식물 id를 가져옴
  const { id } = useParams();
  // 현재 로그인한 유저의 토큰을 가져옴
  const currentUser = useSelector((state) => state.currentUser);
  const token = currentUser.token;

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
    "바질",
    "목마가렛",
    "스파티필름",
    "피쉬본",
    "콤팩타",
    "스투키",
    "애플민트",
    "히아신스",
    "산세베리아",
    "로즈마리"
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
      console.log(response.data.data[0]);
      // 키우기 시작한 날짜를 가져와 형식을 변환한다.
      const formattedStartDay = formatDate(response.data.data[0].start_date);
      // 키우기 시작한 날짜와 오늘 날짜의 차이를 구한다.
      const difference = calDay(formattedStartDay, formattedToday) + 1;
      setDaysDifference(difference);
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

  return (
    <>
      <div className="info_box">
        {/* {해당하는 식물의 이미지를 보여준다.} */}
        <Grid item xs={5} className="rounded-image">
          <img
            className="myinfo-img"
            src={`/plantInfoimg/${myplant.plant_info_index}.png`}
          />
        </Grid>
        <Grid item xs={7} className="info_box_right">
          {/* {현재 상태가 완료되었는지에 따라 완료 또는 삭제 버튼을 보여준다.} */}
          {myplant.complete !== 1 && (
            <PlantCompleteComponent  completePlant={completePlant}>
              완료
            </PlantCompleteComponent>
          )}
          {myplant.complete === 1 && (
            <PlantDeleteComponent deletePlantData={deletePlantData}>
              식물삭제
            </PlantDeleteComponent>
          )}
          {/* {해당하는 식물의 데이터를 보여준다.} */}
          {myplant && myplant.plant_name && (
            <h3 style={{ fontSize: "40px" , marginTop:"10px" }}>{myplant.plant_name}</h3>
          )}

          {myplant && myplant.plant_info_index && (
            <h5>종: {checkspices[(myplant.plant_info_index - 1) % 20]}</h5>
          )}
          {myplant && myplant.child_name && (
            <h5>아이이름: {myplant.child_name}</h5>
          )}
          {myplant && myplant.start_date && (
            <h5>
              시작일: {myplant.start_date.slice(0, 10)}<br />({daysDifference}
              일차)
            </h5>
          )}
        </Grid>
      </div>
    </>
  );
};

export default MyInfo;
