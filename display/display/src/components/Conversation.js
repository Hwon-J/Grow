// import logo from './logo.svg';
import './Conversation.css';
// 캐릭터와  import
import beancharacter from '../assets/beancharacter.png';
import lettucecharacter from '../assets/lettucecharacter.png';
import tomatocharacter from '../assets/tomatocharacter.png';
// 웹소켓 컴포넌트와 연결
import WebSocketComponent from './Websocket';
// useEffect
import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

function Conversation() {
    // 넘겨받은 serial_number를 가져오기 위해 useParams사용 
    const params = useParams()
    console.log(params.serial_number)
    const serial_number = params.serial_number
    const character_list = [beancharacter, lettucecharacter, tomatocharacter]
    const character_index = params.character_index
    // 센서값 관련해서 state 설정
    const [sensor, sensor_update] = useState({'temperature':'', 'light': '', 'moisture':'', 'temperValue':0, 'water':'not passed'})
    const [talking, set_talking] = useState(false)
    const temper_speech = {'과다': '앗! 뜨거워', '적당' : '아주 좋아', '부족': '너무 추워'}
    const light_speech = {'과다': '너무 밝아, 눈 부셔!', '적당' : '적당해', '부족': '어두워, 빛 좀 비춰줘'}
    const water_speech = {'과다': '물 너무 많이 먹었어', '적당' : '충분해', '부족': '목 말라 물 좀 주라!'}
    // 대화 컴포넌트 구조
    return (
      
      <div >
        
        <span className='information '>
          <h1>온도 : {temper_speech[sensor.temperature]} {sensor.temperValue}도</h1>
          <h1>햇빛 : {light_speech[sensor.light]}</h1>
          <h1>물 : {water_speech[sensor.moisture]}</h1>
        </span>
        
        
          
         
        <div className='character-box'>
          <img className="character" src={character_list[character_index]} alt="cancel"  />
          
        </div>
        <div className={`bubble ${talking ? 'visible' : 'hidden'}`}>
        {/* 웹소켓 컴포넌트도 추가하여 이 컴포넌트가 렌더링될 때 한번 웹소켓 연결 
            현재 센서 업데이트 함수를 자식 컴포넌트로 넘겨주기 그러면 자식컴포넌트에서도 호출 가능 */}
          
          <WebSocketComponent serial_number={serial_number} sensor_update={sensor_update} set_talking={set_talking} />
        </div>
          
        
        
      </div>
      
    )
  }

  export default Conversation