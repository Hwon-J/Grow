import axios from "axios";

// 오디오 url받아오는 메서드 
export const listenAudio = async (questId, BASE_URL, config) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/plant/quest/${questId}/audio`, config);
    return response.data.presignedUrl; //url을 받아오면 넘기기
  } catch (error) {
    console.error("Error", error);
    return null; // 요청 실패시 null값 리턴
  }
};
