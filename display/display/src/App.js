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
// import { createStore } from 'redux';
import { Provider, useSelector, useDispatch} from 'react-redux';
import WebSocketComponent from './components/Websocket';
// useEffect
import { useEffect } from 'react';
// 시리얼 번호 등록하는 컴포넌트 import 가져오기
import SerialRegister from './components/SerialRegister';


// 캐릭터와 대화하는 화면 컴포넌트 생성
function Conversation() {
  const state_serial_number = useSelector((state) => 
     state.serial_number
  )
  const state_name = useSelector((state) =>
    state.name
  )
  // serial번호가 등록이 되었는지 확인 차원에서 렌더링 될 때 한번 출력
  useEffect(() => {
    console.log(state_serial_number); // 처음 렌더링 시에만 출력
    // console.log(store)
  }, [])

  const character_style = {
    height : '300px'

  }

  // 대화 컴포넌트 구조
  return (
    
    <div className='character-container'>
      {/* <h1>{state_name}</h1> */}
      {/* <img src={flowercharacter} alt="cancel" style={character_style} />
      <img src={lettucecharacter} alt="cancel" style={character_style} /> */}
      {/* <img className="character" src={tomatocharacter} alt="cancel" style={character_style} /> */}
      {/* <img src={potcharacter} alt="cancel" style={character_style} /> */}
      <div className='col-12'>
        <img src={beancharacter} alt="cancel" style={character_style} />

      </div>
      
      {/* 웹소켓 컴포넌트도 추가하여 이 컴포넌트가 렌더링될 때 한번 웹소켓 연결 */}
      <div>
      <WebSocketComponent />

      </div>
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
    // <Provider store={store}>
      <div className="App" style={backgroundStyles}>
        <Routes>
          <Route path="/" element={<SerialRegister />} />
          <Route path="/conversation" element={<Conversation />} />
        </Routes>
      </div>
    //  </Provider> 
  );
}

export default App;
