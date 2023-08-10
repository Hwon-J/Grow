// 김태형
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "./questpage.scss";
import { BASE_URL } from "../utils/Urls";
import { Icon } from "@iconify/react";

const QuestPage = () => {
  const currentUser = useSelector((state) => state.currentUser); // 로그인되어있는지 확인
  const authToken = currentUser.token; // 토큰 저장
  const [focusedInputIndex, setFocusedInputIndex] = useState(null); // 어떤 input이 포커스 받는지 확인 변수
  const [questList, setQuestList] = useState([]); // 질문지 리스트변수
  const [newquest, setNewquest] = useState(""); // 새로운 질문지의 value
  const { id } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  
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

  const createQuest = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authToken}`,
      },
    };
    const body = {
      quest: newquest,
    };
    if (newquest === "") {
      alert("공백은 질문이 될 수 없습니다.");
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
  };

  const getQuest = async () => {
    // 처음시작했을떄 질문지리스트 받을예정
    console.log("id : " + id);
    if (authToken) {
      // 로그인 되어있을때
      try {
        const response = await axios.get(`${BASE_URL}/api/plant/quest/${id}`, {
          headers: {
            Authorization: `${authToken}`,
          },
        });
        setQuestList(response.data.data);
        console.log("질문받아오기");
        console.log(questList);
      } catch (err) {
        console.log("에러가 발생", err);
      }
    }
  };

  const inputQuest = () => {
    // questList의 각각의 index의 값들을 빼내서 input으로 만들기
    // value는 해당 객체의 quest값
    console.log(questList);

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
              <p className="resister_date" style={{ display: "inline-block", marginRight: "5px" }}>
                {questItem.registered_date.slice(0,10)}일 등록
              </p>
            )}
          </div>
          <div className="quest-right">
            {questItem?.audio_file_path && (
              <Icon icon="bi:bell" onClick={listenAudio} />
            )}
            <Icon
              icon="bi:trash3"
              onClick={() => deleteQuest(questItem.index)}
            />
          </div>
        </div>
        
      ));
  };

  const listenAudio = () => {};

  const deleteQuest = (questId) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authToken}`,
      },
    };

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
        <Icon icon="bi:chevron-left"  
          style={{ marginRight: '10px', marginTop: '3px', color: 'white' }} 
          onClick={() => handlePageChange(currentPage - 1)} />)}

      {currentPage !== 1 && (
        <Icon icon="bi:chevron-left" style={{ marginRight: '10px', marginTop: '3px', color: 'black'}} 
          onClick={() => handlePageChange(currentPage - 1)} />)}

        <span>{`${currentPage} / ${totalPages}`}</span>
        
        {currentPage === totalPages && (
        <Icon icon="bi:chevron-right" style={{ marginLeft: '10px', marginTop: '3px', color: 'white' }} 
        onClick={() => handlePageChange(currentPage + 1)} />)}

        {currentPage !== totalPages && (
        <Icon icon="bi:chevron-right" style={{ marginLeft: '10px', marginTop: '3px', color: 'black' }} 
        onClick={() => handlePageChange(currentPage + 1)} />)}
      </div>
    );
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
            placeholder="질문을 등록하세요"
          />

          <button className="btnQ" onClick={createQuest}>
            등록
          </button>
        </div>

        <div className="quest-section">
          {inputQuest()}
        </div>
        <div className="center-pagination" style={{ marginTop: '35px' }}>{renderPagination()}</div>
      </div>
    </>
  );
};

export default QuestPage;
