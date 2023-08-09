// 김민국 초안 작성

// import logo from './logo.svg';
import './App.css';
// 캐릭터와 배경이미지 import
import background from './assets/BackgroundPicture.gif';
import beancharacter from './assets/beancharacter.png';
import lettucecharacter from './assets/lettucecharacter.png';
import tomatocharacter from './assets/tomatocharacter.png';
import board from './assets/board.png';
import logo from './assets/logo.png';
// Router import
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
// axios import
import axios from 'axios';
// store 관련 기능 import
// import { createStore } from 'redux';
import { Provider, useSelector, useDispatch} from 'react-redux';
import WebSocketComponent from './components/Websocket';
// useEffect
import { useEffect, useState } from 'react';
// 시리얼 번호 등록하는 컴포넌트 import 가져오기
import CharacterChoice from './components/CharacterChoice';
import Conversation from './components/Conversation';
import Verify from './components/Verify';
import { useParams } from 'react-router-dom';


// 캐릭터와 대화하는 화면 컴포넌트 생성
// 따로 파일로 분리 해놓는게 좋겠지만 페이지가 얼마 없어 그냥 여기에 만들었습니다.
// function Conversation() {
//   // 넘겨받은 serial_number를 가져오기 위해 useParams사용 
//   const params = useParams()
//   console.log(params.serial_number)
//   const serial_number = params.serial_number
//   const character_list = [beancharacter, lettucecharacter, tomatocharacter]
//   const character_index = params.character_index
//   // 센서값 관련해서 state 설정
//   const [sensor, sensor_update] = useState({'temperature':'', 'light': '', 'moisture':'', 'temperValue':0, 'water':'not passed'})
  
//   // 대화 컴포넌트 구조
//   return (
    
//     <div >
      
//       <span className='information '>
//         <h1>온도 : {sensor.temperature} {sensor.temperValue}도</h1>
//         <h1>햇빛 : {sensor.light}</h1>
//         <h1>물 : {sensor.moisture}</h1>
//       </span>
      
      
        
       
//       <div className='character-box'>
//         <img className="character" src={character_list[character_index]} alt="cancel"  />
        
//       </div>
//       <div className='bubble '>
//       {/* 웹소켓 컴포넌트도 추가하여 이 컴포넌트가 렌더링될 때 한번 웹소켓 연결 
//           현재 센서 업데이트 함수를 자식 컴포넌트로 넘겨주기 그러면 자식컴포넌트에서도 호출 가능 */}
        
//         <WebSocketComponent serial_number={serial_number} sensor_update={sensor_update} />
//       </div>
        
      
      
//     </div>
    
//   )
// }



function App() {

  // 기본적으로 라즈베리파이에 시리얼번호가 들어있다고 가정
  
  
  const navigate = useNavigate()
  // 배경화면 설정
  const backgroundStyles = {
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: '100vh', // 전체 화면 높이까지 배경이미지가 채워지도록 설정
  }
  useEffect(() => {
    navigate('/verify')
  }, [])

  return (
    // App주변으로 store설정
    // 혹시 몰라 스토어 설정해놓음
    // <Provider store={store}>
      <div className="App" style={backgroundStyles}>
        <Routes>
          <Route path="/verify" element={<Verify />} />
          <Route path="/characterchoice/:serial_number" element={<CharacterChoice />} />
          <Route path="/conversation/:character_index/:serial_number" element={<Conversation />} />
        </Routes>
      </div>
    //  </Provider> 
  );
}

export default App;
