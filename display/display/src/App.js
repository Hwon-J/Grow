// 김민국 초안 작성

// import logo from './logo.svg';
import './App.css';
// 캐릭터와 배경이미지 import
import background from './assets/BackgroundPicture.gif';
import flowercharacter from './assets/flowercharacter.png';
import lettucecharacter from './assets/lettucecharacter.png';
import tomatocharacter from './assets/tomatocharacter.png';
import potcharacter from './assets/potcharacter.png';
import beancharacter from './assets/beancharacter.png';
import logo from './assets/logo.png';
// Router import
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
// axios import
import axios from 'axios';
// store 관련 기능 import
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch} from 'react-redux';
import WebSocketComponent from './components/Websocket';
// useEffect
import { useEffect } from 'react';
// 시리얼 번호 등록하는 컴포넌트 import 가져오기
import SerialRegister from './components/SerialRegister';

// 현재 store에 시리얼번호가 등록됐는지에 관한 변수를 바꿔주기 위해 리듀서 설정
function serial_reducer(current_serial, action) {
  // 현재 시리얼번호 등록을 모른다면 false값으로 변수 설정
  if (current_serial === undefined) {
    return {
      serial_number : false
    }
  }
  // action type으로 Success가 들어왔을 때 current_serial의 serial_number을 true로 변경
  if (action.type === 'SUCCESS') {

    const new_serial = {...current_serial}
    new_serial.serial_number = true
    console.log(new_serial)
    return new_serial
  }
  
  console.log('serial', current_serial)
}
// 만들어준 리듀서를 기반으로 store 생성
const store = createStore(serial_reducer)

// 캐릭터와 대화하는 화면 컴포넌트 생성
function Conversation() {
  const state_serial_number = useSelector((state) => 
     state.serial_number
  )
  // serial번호가 등록이 되었는지 확인 차원에서 렌더링 될 때 한번 출력
  useEffect(() => {
    console.log(state_serial_number); // 처음 렌더링 시에만 출력
  }, [])

  const character_style = {
    height : '300px'

  }

  // 대화 컴포넌트 구조
  return (
    <div>
      <img src={flowercharacter} alt="cancel" style={character_style} />
      <img src={lettucecharacter} alt="cancel" style={character_style} />
      <img src={tomatocharacter} alt="cancel" style={character_style} />
      <img src={potcharacter} alt="cancel" style={character_style} />
      <img src={beancharacter} alt="cancel" style={character_style} />
      <h1>{state_serial_number}</h1>
      {/* 웹소켓 컴포넌트도 추가하여 이 컴포넌트가 렌더링될 때 한번 웹소켓 연결 */}
      <WebSocketComponent />
    </div>
  )
}



function App() {
  // 배경화면 설정
  const backgroundStyles = {
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: '100vh', // 전체 화면 높이까지 배경이미지가 채워지도록 설정
  }

  return (
    // App주변으로 store설정
    <Provider store={store}>
      <div className="App" style={backgroundStyles}>
        <Routes>
          <Route path="/" element={<SerialRegister />} />
          <Route path="/conversation" element={<Conversation />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
