// 김태형
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "./questpage.scss";
// 오디오 , 질문 , 랜더링 페이지 컴포넌트
import AudioComponent from "./quest/audio";
import QuestItem from "./quest/QuestItem";
import  renderPagination  from "./quest/QuestPagination";

// 오디오 js
import { listenAudio } from "../utils/audio";

import { BASE_URL } from "../utils/Urls";
import { Icon } from "@iconify/react";
import { reSwal } from "../utils/reSwal";

const QuestPage = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const authToken = currentUser.token;
  const [questList, setQuestList] = useState([]);
  const [newquest, setNewquest] = useState("");
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [checkComplete, setCheckComplete] = useState();
  const [audioData, setAudioData] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioQuest, setAudioQuest] = useState(null);
  // 헤더용 
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${authToken}`,
    },
  };
  // 렌더링 할때 현재페이지 변경 메서드
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  //질문등록 메서드
  const createQuest = async () => {
    if (checkComplete === 0) { // 키우는 식물일 때 
      if (!newquest) {        // 질문이 작성되지 않았으면 경고창
        reSwal("warning", "공백은 질문이 될 수 없습니다");
        return;
      }
      try {   // 질문이 작성되었으면 axios요청으로 질문 보내고 
        await axios.post(
          `${BASE_URL}/api/plant/quest/${id}`,
          { quest: newquest },
          config
        );
        getQuest();  // 새롭게 질문 받아오기
        setNewquest(""); // 질문지 input 초기화
      } catch (error) {
        console.error("Error while saving the new question:", error);
      }
    } else {   // 완료처리된 식물이면 질문 등록 막기
      reSwal("warning", "완료된 식물은 질문을 등록할 수 없습니다");
    }
  };
  // 완료처리 버튼 눌렀을때 식물의 상태를 완료 처리
  useEffect(() => {
    getComplete();
  }, []);
  // 식물의 완료처리 메서드
  const getComplete = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/plant/myplant/${id}`,
        config
      );
      setCheckComplete(response.data.data[0].complete);
    } catch (error) {
      console.error(error);
    }
  };
  //시작할 때 getQuest, getComplete실행
  useEffect(() => {
    getQuest(); 
  }, []);
  // 식물데이터 받아오는 메서드
  const getQuest = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/plant/quest/${id}`,
        config
      );
      setQuestList(response.data.data.reverse()); // 리스트에 받아온 데이터 최근에 등록된 순으로 넣기
    } catch (error) {
      console.error("Error while fetching quest list:", error);
    }
  };
  // 질문 삭제 메서드
  const deleteQuest = (questId) => {
    axios
      .delete(`${BASE_URL}/api/plant/quest/${questId}/`, config)
      .then((response) => {
        window.location.reload(); // 화면 새로고침
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  // 음성데이터 켜는 메서드 비동기
  const handleListenAudio = async (questId) => {
    console.log(questId+ '퀘스트 아이디')
    try {
      const url = await listenAudio(questId, BASE_URL, config); //올바르게 오면 음성데이터url오고 실패하면 null값이 옴
      // console.log(url)
      if (url) {  // url이 온다면 오디오 데이터에 넣어주고 플레잉변수 true로 바꿔주기
        setAudioData(url);
        setAudioPlaying(true);
        setAudioQuest(questId);
      }
    } catch (error) {
      console.error("Error while getting audio:", error);
    }
  };

  return (
    <div className="quest-container">
      <h1>아이에게 질문해 주세요!</h1>
      <div className="input-container">
        <input
          type="text"
          className="quest-input plus"
          value={newquest}
          onChange={(e) => setNewquest(e.target.value)}
          placeholder="아이에게 말하듯 질문해주세요"
          onKeyPress={(e) => e.key === "Enter" && createQuest()}
        />
        <button className="btnQ" onClick={createQuest}>
          등록
        </button>
      </div>
      {/* 오디오 컴포넌트에 필요한 데이터 넣어서 보내기 */}
      <AudioComponent audioUrl={audioData} setAudioUrl={setAudioData}/>
      <div className="quest-section">
        {/* 질문리스트를 한페이지당 5개로 설정, 질문아이템 questList에서 모두 뽑아내 만들기 */}
        {questList
          .slice((currentPage - 1) * 5, currentPage * 5)
          .map((questItem, index) => (
            <QuestItem
              key={index}
              questItem={questItem}
              handleListenAudio={handleListenAudio}
              deleteQuest={deleteQuest}
              audioQuest={audioQuest}
            />
          ))}
      </div>
      <div className="center-pagination" style={{ marginTop: "35px" }}>
        {/* 렌더링 처리용 컴포넌트 */}
        {renderPagination({ questList, currentPage, Icon, handlePageChange })}
      </div>
    </div>
  );
};

export default QuestPage;
