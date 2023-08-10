import axios from "axios";
import { BASE_URL } from "../utils/Urls";
import { reSwal } from "./reSwal";
export async function getPlants(token) {    // 식물 정보 받아오는 함수
  try {
    const config = {        
      headers: {
        Authorization: token,
      },
    };
    const response = await axios.get(`${BASE_URL}/api/plant/myplant/`, config);   // 식물정보 요청 헤더에 토큰보내기
    const plantsList = response.data.data;              // 받아온 정보 plantList에 저장
    const growing = plantsList.filter((plant) => plant.complete === 0);   // plantList의 각 데이터들을 탐색 후 완료된것과 아닌것 나누어 저장
    const complete = plantsList.filter((plant) => plant.complete === 1);
    return { growing, complete };       // 진행중, 완료 식물데이터 내보내기
  } catch (error) {
    console.log(error);
    return { growing: [], complete: [] }; // 에러이면 빈값으로 내보내기
  }
}

export async function withdrawal(token) {
  try {
    const config = {
      headers: {
        Authorization: token,
      },
    };
    const response = await axios.delete(`${BASE_URL}/api/user/`, config);   // 회원탈퇴 요청
    reSwal("success",`${response.data.message}`)  // 성공 alert띄우고 true값 내보내기
    return true;        
  } catch (error) {             //실패시 false값 내보내기
    console.log(error);
    return false;
  }
}
