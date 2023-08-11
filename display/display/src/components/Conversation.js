
import './Conversation.css';
// 넘겨 받은 캐릭터를 출력하기 위해 import
import beancharacter from '../assets/beancharacter.png';
import lettucecharacter from '../assets/lettucecharacter.png';
import tomatocharacter from '../assets/tomatocharacter.png';
import blackboard from '../assets/blackboard.png';
import water from '../assets/water.png';

// 웹소켓 컴포넌트와 연결
import WebSocketComponent from './Websocket';
// useEffect
import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

function Conversation() {
    // 넘겨받은 serial_number와 캐릭터 인덱스를 가져오기 위해 useParams사용 
    const params = useParams()
    const serial_number = params.serial_number
    const character_index = params.character_index
    const character_list = [beancharacter, lettucecharacter, tomatocharacter]

    // 백에서 받는 센서값 관련해서 state 설정
    const [sensor, sensor_update] = useState({'temperature':'', 'light': '', 'moisture':'', 'temperValue':0, 'water':'not passed'})

    // 센싱값 종류 마다 과할 때, 적당할 때, 부족할 때의 상태 표현 멘트 설정 객체
    const temper_speech = {'과다': '앗! 뜨거워', '적당' : '아주 좋아', '부족': '너무 추워'}
    const light_speech = {'과다': '너무 밝아, 눈 부셔!', '적당' : '적당해', '부족': '어두워, 빛 좀 비춰줘'}
    const water_speech = {'과다': '물 너무 많이 먹었어', '적당' : '충분해', '부족': '목 말라 물 좀 주라!'}

    // 캐릭터 상태 설정
    // 말하고 있는 상태인지 변수 설정
    const [talking, set_talking] = useState(false)
    // 답변 생각(gpt 답변 기다리는중) 상태인지 변수 설정
    const [thinking, set_thinking] = useState(false)
    
    // 대화창 컴포넌트 구조
    return (
      
      <div >
        {/* 센서값 나타내는 부분 */}
        <img className='blackboard' src={blackboard}/>
        <span className='information '>
          <h1>온도 : {temper_speech[sensor.temperature]} {sensor.temperValue}도</h1>
          <h1>햇빛 : {light_speech[sensor.light]}</h1>
          <h1>물 : {water_speech[sensor.moisture]}</h1>
        </span>
        
        <img src={water} className='water water-fairy' />
          
         {/* 캐릭터 나타내는 부분 */}
        <div className='character-box'>
          <img className={`character ${talking ? 'character-talking' : ''} ${thinking ? 'character-talking' : ''}`}
           src={character_list[character_index]} alt="cancel"  />
          
        </div>
        <div className={`bubble`}>
        {/* <div className={`bubble ${talking || thinking ? 'visible' : 'hidden'}`}> */}
        {/* 웹소켓 컴포넌트도 추가하여 이 컴포넌트가 렌더링될 때 한번 웹소켓 연결 
            현재 센서 업데이트 함수를 자식 컴포넌트로 넘겨주기 그러면 자식컴포넌트에서도 호출 가능 */}
          
          <WebSocketComponent serial_number={serial_number} sensor_update={sensor_update} set_talking={set_talking} set_thinking={set_thinking} />
        </div>
          
        
        
      </div>
      
    )
  }

  export default Conversation