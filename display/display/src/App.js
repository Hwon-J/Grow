// 김민국 초안 작성

// import logo from './logo.svg';
import './App.css';
// 캐릭터와 배경이미지 import
import background from './assets/BackgroundPicture.gif';
import beancharacter from './assets/beancharacter.png';
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
import { useEffect } from 'react';
// 시리얼 번호 등록하는 컴포넌트 import 가져오기
import SerialRegister from './components/SerialRegister';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';


// 캐릭터와 대화하는 화면 컴포넌트 생성
function Conversation() {
  
  const params = useParams()
  console.log(params.serial_number)
  const serial_number = params.serial_number
  



  // 대화 컴포넌트 구조
  return (
    
    <div className='character-container'>
      <div className='information'>
        <img src={board} className='board' />
        <h1>온도 : </h1>
        <h1>습도 : </h1>
        <h1>수분 : </h1>
      </div>
      
      <div className='col-12 row character-row'>
        <div className='col-3'></div>
        <div className='col-3'>

        <img className="character" src={beancharacter} alt="cancel"  />
        </div>
        <div className='col-3'>
        <div className='bubble '>
          
          
        </div>
        </div>
      </div>
      
      {/* 웹소켓 컴포넌트도 추가하여 이 컴포넌트가 렌더링될 때 한번 웹소켓 연결 */}
      <div>
      <WebSocketComponent serial_number={serial_number}/>

      </div>
    </div>
    
  )
}



function App() {
  const base_serial_number = 'qwer'
  // 배경화면 설정
  
  const navigate = useNavigate()
  const backgroundStyles = {
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: '100vh', // 전체 화면 높이까지 배경이미지가 채워지도록 설정
  }
  useEffect(() => {
    navigate(`/conversation/${base_serial_number}`)
  }, [])

  return (
    // App주변으로 store설정
    // <Provider store={store}>
      <div className="App" style={backgroundStyles}>
        <Routes>
          <Route path="/" element={<SerialRegister />} />
          <Route path="/conversation/:serial_number" element={<Conversation />} />
        </Routes>
      </div>
    //  </Provider> 
  );
}

export default App;
