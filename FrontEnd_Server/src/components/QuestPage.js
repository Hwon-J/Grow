// 김태형
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "./questpage.scss";
import { BASE_URL } from "../utils/Urls";
import { Icon } from "@iconify/react";
import { reSwal } from "../utils/reSwal";

const QuestPage = () => {
  const currentUser = useSelector((state) => state.currentUser); // 로그인되어있는지 확인
  const authToken = currentUser.token; // 토큰 저장
  const [focusedInputIndex, setFocusedInputIndex] = useState(null); // 어떤 input이 포커스 받는지 확인 변수
  const [questList, setQuestList] = useState([]); // 질문지 리스트변수
  const [newquest, setNewquest] = useState(""); // 새로운 질문지의 value
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [checkComplete, setCheckComplete] = useState();
  useEffect(() => {
    getQuest();
    inputQuest();
  }, []); // axios를 통해서 질문지 리스트 받을 useEffect

  useEffect(() => {
    inputQuest();
  }, [questList]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const onChangeNewquest = (e) => {
    // 새로운 질문지 작성될떄마다 value값 변경
    setNewquest(e.target.value);
    console.log(e.target.value);
  };

  const handleInputFocus = (index) => {
    setFocusedInputIndex(index);
  }; // input이 focus되는지 확인 , index저장

  const handleInputBlur = () => {
    // input의 focus를 잃었을때 발생
    setFocusedInputIndex(null); // 어떤 input도 focus상태가 아니다
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${authToken}`,
    },
  };

  const createQuest = () => {
    const body = {
      quest: newquest,
    };
    if (checkComplete===0) {
      if (newquest === "") {
        reSwal("warning", "공백은 질문이 될 수 없습니다");
        return
      } else {
        console.log("여기까지오나");
        axios
          .post(`${BASE_URL}/api/plant/quest/${id}`, body, config)
          .then((response) => {
            console.log("New question successfully saved:", response.data);
            getQuest();
            setNewquest("");
          })
          .catch((error) => {
            console.error("Error while saving the new question:", error);
          });
      }
    } else {
      reSwal("warning", "완료된 식물은 질문을 등록할 수 없습니다");
    }
  };

  useEffect(() => {
    getComplete();
  }, []);

  const getComplete = async () => {
    const path = window.location.pathname;
    const parts = path.split("/"); 
    const number = parts[parts.length - 1]; 
    try {
      const response = await axios.get(
        `${BASE_URL}/api/plant/myplant/${number}`,
        config
      );
      setCheckComplete(response.data.data[0].complete);
      console.log(response.data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getQuest = async () => {
    // 처음시작했을떄 질문지리스트 받을예정
    if (authToken) {
      // 로그인 되어있을때
      try {
        const response = await axios.get(
          `${BASE_URL}/api/plant/quest/${id}`,
          config
        );
        setQuestList(response.data.data);
      } catch (err) {
        console.log("에러가 발생", err);
      }
    }
  };

  const inputQuest = () => {
    // questList의 각각의 index의 값들을 빼내서 input으로 만들기
    // value는 해당 객체의 quest값
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return questList
      .slice()
      .reverse()
      .slice(startIndex, endIndex)
      .map((questItem, index) => (
        <div key={index} className="quest-tm">
          <div className="quest-left">
            <p className="question">{questItem.content}</p>
            {questItem?.registered_date && (
              <p
                className="resister_date"
                style={{ display: "inline-block", marginRight: "5px" }}
              >
                {questItem.registered_date.slice(0, 10)}일 등록
              </p>
            )}
          </div>
          <div className="quest-right">
            {/* <Icon icon="bi:bell" onClick={() => listenAudio(28)} /> */}
            {questItem.completed === 1 && (
              <Icon
                icon="bi:bell"
                onClick={() => listenAudio(questItem.index)}
              />
            )}
            <Icon
              icon="bi:trash3"
              onClick={() => deleteQuest(questItem.index)}
            />
          </div>
        </div>
      ));
  };

  const [audioData, setAudioData] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const listenAudio = (questId) => {
    axios
      .get(`${BASE_URL}/api/plant/quest/${questId}/audio`, config)
      .then((response) => {
        setAudioData(response.data.presignedUrl);
        setAudioPlaying(true); // 음성 재생 상태를 true로 설정
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const stopAudio = () => {
    setAudioData("");
    setAudioPlaying(false); // 음성 재생 상태를 false로 설정
  };

  const deleteQuest = (questId) => {
    axios
      .delete(`${BASE_URL}/api/plant/quest/${questId}/`, config)
      .then((response) => {
        console.log("삭제성공:", response.data);
        getQuest();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  // 페이지네이션 함수
  const renderPagination = () => {
    // 페이지당 질문 5개
    const itemsPerPage = 5;
    const totalPages = Math.ceil(questList.length / itemsPerPage);

    // 현재 페이지가 1이면 이전버튼 비활성화
    // 현재 페이지가 마지막 페이지면 다음버튼 비활성화
    return (
      <div className="pagination">
        {currentPage === 1 && (
          <Icon
            icon="bi:chevron-left"
            style={{ marginRight: "10px", marginTop: "3px", color: "white" }}
            onClick={() => handlePageChange(currentPage - 1)}
          />
        )}

        {currentPage !== 1 && (
          <Icon
            icon="bi:chevron-left"
            style={{ marginRight: "10px", marginTop: "3px", color: "black" }}
            onClick={() => handlePageChange(currentPage - 1)}
          />
        )}

        <span>{`${currentPage} / ${totalPages}`}</span>

        {currentPage === totalPages && (
          <Icon
            icon="bi:chevron-right"
            style={{ marginLeft: "10px", marginTop: "3px", color: "white" }}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        )}

        {currentPage !== totalPages && (
          <Icon
            icon="bi:chevron-right"
            style={{ marginLeft: "10px", marginTop: "3px", color: "black" }}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        )}
      </div>
    );
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      createQuest(); // 엔터 키를 눌렀을 때 createQuest 함수 호출
    }
  };

  return (
    <>
      <div className="quest-container">
        <h1>아이에게 질문해 주세요!</h1>
        <div className="input-container">
          <input
            type="text"
            className="quest-input plus"
            value={newquest}
            onChange={onChangeNewquest}
            onFocus={() => handleInputFocus(questList.length)}
            onBlur={handleInputBlur}
            placeholder="아이에게 말하듯 질문해주세요"
            onKeyPress={handleKeyPress}
          />
          <button className="btnQ" onClick={createQuest}>
            등록
          </button>
        </div>

        {audioData && (
          <div className="audiodiv">
            <audio controls onEnded={stopAudio}>
              {" "}
              {/* 오디오가 종료되면 재생 상태를 false로 설정 */}
              <source src={audioData} type="audio/wav" />
            </audio>
            {audioPlaying && (
              <button onClick={stopAudio} className="audioStop">
                Stop
              </button>
            )}{" "}
            {/* 음성 중지 버튼 */}
          </div>
        )}

        <div className="quest-section">{inputQuest()}</div>

        <div className="center-pagination" style={{ marginTop: "35px" }}>
          {renderPagination()}
        </div>
      </div>
    </>
  );
};

export default QuestPage;
