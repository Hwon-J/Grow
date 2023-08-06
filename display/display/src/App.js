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
import { useEffect, useState } from 'react';
// 시리얼 번호 등록하는 컴포넌트 import 가져오기
import SerialRegister from './components/SerialRegister';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';


// 캐릭터와 대화하는 화면 컴포넌트 생성
function Conversation() {
  // 넘겨받은 serial_number를 가져오기 위해 useParams사용 
  const params = useParams()
  console.log(params.serial_number)
  const serial_number = params.serial_number
  const [sensor, sensor_update] = useState({'온도':'2', '조도': '2', '수분':'2'})
  



  // 대화 컴포넌트 구조
  return (
    
    <div >
      <img src={board} className='board' />
      <span className='information'>
        <h1>온도 : {sensor.온도}</h1>
        <h1>조도 : {sensor.조도}</h1>
        <h1>수분 : {sensor.수분}</h1>
      </span>
      
      
        
       
      <div className='character-box'>
        <img className="character" src={beancharacter} alt="cancel"  />
        
      </div>
      <div className='bubble '>
        <WebSocketComponent serial_number={serial_number} sensor_update={sensor_update} />
      </div>
        
      
      
      {/* 웹소켓 컴포넌트도 추가하여 이 컴포넌트가 렌더링될 때 한번 웹소켓 연결 */}
      <div>
      

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
