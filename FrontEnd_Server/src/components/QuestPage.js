// 김태형
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { BsPlusCircle } from 'react-icons/bs';
import axios from 'axios';
import './questpage.scss';

const QuestPage = () => {
  const currentUser = useSelector((state) => state.currentUser);  // 로그인되어있는지 확인
  const authToken = currentUser.token;  // 토큰 저장
  const [showIcon, setShowIcon] = useState(true); // 아이콘이 보이게 할지 말지 정하는 변수
  const [focusedInputIndex, setFocusedInputIndex] = useState(null); // 어떤 input이 포커스 받는지 확인 변수
  const [questList, setQuestList] = useState([{ quest: "안녕?" }, { quest: "날씨어때?" }, { quest: "되나??" }]); // 질문지 리스트변수
  const [newquest, setNewquest] = useState(""); // 새로운 질문지의 value

  useEffect(() => {
    getQuest();
  }, []); // axios를 통해서 질문지 리스트 받을 useEffect

  const onChangeNewquest = (e) => {  // 새로운 질문지 작성될떄마다 value값 변경
    setNewquest(e.target.value)
    console.log(e.target.value)
  }

  const handleInputFocus = (index) => { // input이 focus되는지 확인 , index저장
    setFocusedInputIndex(index);
  };

  const handleInputBlur = () => {  // input의 focus를 잃었을때 발생
    setFocusedInputIndex(null); // 어떤 input도 focus상태가 아니다
  };

  const handleIconClick = () => { // icon을 클릭했을때 
    setShowIcon(false);  // 안보이게 하기
  };

  const handleOutsideClick = () => {  // icon이외의 것을 클릭하였을때 다시보이게 하기
    setShowIcon(true);
  };
  const createQuest = () => {  // 새로운 quest만들기
    const tmp = questList
    if (newquest === "") {
      alert("공백은 질문이 될 수 없습니다.")
    } else {
      tmp.push({quest:newquest})  // newquest의 value값을 원래 questList에 추가시켜주기
      setQuestList(tmp)
      console.log(questList)
      setNewquest("")
    }
  }

  const isInputFocused = (index) => {  
    return focusedInputIndex === index;
  };

  const getQuest = async () => {  // 처음시작했을떄 질문지리스트 받을예정
    if (currentUser) { // 로그인 되어있을때 
      try {  
        const response = await axios.get('질문지 axios주소', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        setQuestList(response.data);  // questList에 data넣기
      } catch (err) {
        console.log('에러가 발생', err);
      }
    }
  };

  const inputQuest = () => {  // questList의 각각의 index의 값들을 빼내서 input으로 만들기
    // value는 해당 객체의 quest값
    return questList.map((questItem, index) => (
      <div key={index}>
        <input
          type="text"
          className='quest-input'
          value={questItem.quest}
          readOnly  // 변경을 불가
        />
      </div>
    ));
  };

  return (
    <>
      <div onClick={handleOutsideClick}> {/*  해당내부 선택시 아이콘 다시 나타나게 */}
      </div>
      <div className='quest-container'>
        <div className='quest-section container'>
          질문지 등록
          {inputQuest()}
          <div className="input-container">
            {showIcon && !isInputFocused(questList.length) && <BsPlusCircle className="plus-icon" onClick={handleIconClick} />}
            <input
              type="text"
              className='quest-input plus'
              value={newquest}
              onChange={onChangeNewquest}
              onFocus={() => handleInputFocus(questList.length)}
              onBlur={handleInputBlur}
            />
          </div>
          <div className="button_container">
            <button className="create-quest" onClick={createQuest}><span>Hover me!</span></button>
          </div>
        </div>
      </div>
      <div>
      </div>
    </>
  );
};

export default QuestPage;
