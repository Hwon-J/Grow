// 김민국 초안 작성

import './App.css';
// 캐릭터와 배경이미지 import

import background2 from './assets/BackgroundPicture2.gif';

// Router import
import { BrowserRouter, Route, Routes, useNavigate, useParams } from 'react-router-dom';

// useEffect
import { useEffect } from 'react';
// 시리얼 번호 등록하는 컴포넌트 import 가져오기
import CharacterChoice from './components/CharacterChoice';
import Conversation from './components/Conversation';
import Verify from './components/Verify';


function App(props) {

  // 기본적으로 라즈베리파이에 시리얼번호가 들어있다고 가정
  // 등록된 시리얼 번호는 Verify.js에서 설정
  
  
  const id = props.id
  const navigate = useNavigate()
  // 배경화면 설정
  const backgroundStyles = {
    backgroundImage: `url(${background2})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: '100vh', // 전체 화면 높이까지 배경이미지가 채워지도록 설정
  }
  // App 컴포넌트가 마운트 되자마자 Verify 컴포넌트로 네비게이트
  useEffect(() => {
    navigate(`/verify/${id}`)
  }, [])

  return (
    
      <div className="App" style={backgroundStyles}>
        <Routes>
          <Route path="/verify/:id" element={<Verify />} />
          <Route path="/characterchoice/:serial_number" element={<CharacterChoice />} />
          <Route path="/conversation/:character_index/:serial_number" element={<Conversation />} />
        </Routes>
      </div>
    
  );
}

export default App;
