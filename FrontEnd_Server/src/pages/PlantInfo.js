//김태형
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import PlantInfoComponent from "../components/plant/PlantInfoComponent";
import { useNavigate } from "react-router-dom";

import NavTop from "../components/NavTop";
import './plantinfo.css';
const PlantInfo = () => {
  const location = useLocation(); // props랑은 다르게 라우팅 관련해서 데이터 전달하는 법
  const data = location.state; // 전달된 데이터 객체

  // dataReceived 객체에서 nickname과 serialNum 사용
  const nickname = data.nickname;
  const serialNum = data.serialNum;
  // 식물종 정보, 식물종 정보중 index확인용 변수
  const [plantInfo, setPlantInfo] = useState([ ]);
  const [checkIdx, setCheckIdx] = useState(-1);

  const navigate = useNavigate();
  // 해당 페이지가 실행되면 getPlantInfo : 식물 종 데이터 받아오는 메서드  가 자동으로 실행되게 만들기
  useEffect(() => {
    getPlantInfo();
  }, []);

  // plantInfo가 변경될 때마다 imgPlantInfo() 함수 호출
  useEffect(() => {
    imgPlantInfo();
  }, [plantInfo]);

  // plantInfo정보에서 각각의 img정보를 받아와서 이미지 처리 : 각 이미지를 클릭시 onClickInfo(index)가 넘어가서
  // component의 정보 변경 처리
  const imgPlantInfo = () => {
    return plantInfo.map((info, index) => (
      <div>
      <img
        className="plantinfoimg"
        src={`./plantinfoimg/${info.species}.jpg`}
        key={index}
        onClick={() => onClickInfo(info.index)}
        style={{ border: checkIdx === info.index ? "2px solid red" : "none" }} // 클릭된 이미지에 빨간색 테두리
      />
      </div>
    ));
  };

  // 식물 종 데이터 변경할 메서드
  const getPlantInfo = async () => {
    try {
      const response = await axios.get(
        `http://i9c103.p.ssafy.io:30001/api/plant/info`
      );
      console.log(response);
      setPlantInfo(response.data.info)
      return;
    } catch (error) {
      console.log(error);
    }
  };
  // 클릭시 checkIdx의 숫자가 변경
  const onClickInfo = (idx) => {
    console.log(idx);

    setCheckIdx(idx);
  };
  const pageChange = () => {
    const data = {
      nickname: nickname,
      serialNum: serialNum,
      checkIdx: checkIdx,
    };
    console.log(data);
    navigate("/diary/${}", { state: data });
  };
  return (
    <>
      <NavTop />

      <div className="container plantinfopage">
        <div>
        {/* img출력 함수 */}
        {imgPlantInfo()}
        </div>
        <div>
        {/* checkIdx가 null인 경우 빈 정보를 보내도록 처리 */}
        {checkIdx !== null && (
          <PlantInfoComponent
            props={checkIdx !== -1 ? plantInfo[checkIdx-1] : {}}
          />
        )}
        </div>

        <button onClick={pageChange}>제출</button>
      </div>
    </>
  );
};

export default PlantInfo;
