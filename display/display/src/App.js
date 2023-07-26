// 김민국 초안 작성

// import logo from './logo.svg';
import './App.css';
import backgroundImage from './assets/background.PNG';
import flowercharacter from './assets/flowercharacter.png';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Conversation() {



  return (
    <div>
      <img src={flowercharacter} alt="cancel" />
    </div>
  )
}

function SerialRegister() {
  const navigate = useNavigate();
  return (
    <div>
      <h3>해당 기기의 시리얼 넘버를 입력해주세요.</h3>
      <form onSubmit={(event)=>{
        event.preventDefault()
        console.log(event.target.number.value)
        const serial_number = event.target.number.value
        // navigate('/conversation')
        // try {
        //   const response = axios.get(`http://localhost:3000/api/pot/${serial_number}`,{ withCredentials: false  });
    
        //   // 서버에서 오는 응답에 따라 추가적인 처리를 할 수 있습니다.
        //   // 예: 회원가입 성공 메시지 띄우기 등
        //   console.log(response)
        //   console.log('응답 데이터:', response);
        // } catch (error) {
        //   // 요청 실패 또는 서버에서 에러 응답이 온 경우 처리
        //   console.error('에러 발생:', error);
        // }
        axios.get(`http://localhost:3000/api/pot/${serial_number}`, { withCredentials: false })
        .then(response => {
          console.log(response.data)
        })
        .catch(err => {
          console.log(err)
        })
      }}>

        <input placeholder="SerialNumber" name="number" />
        <input type="submit" value="확인"></input>
      </form>

    </div>
  )

}

function App() {
  const backgroundStyles = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: '100vh', // 전체 화면 높이까지 배경이미지가 채워지도록 설정
  }

  return (
    <div className="App" style={backgroundStyles}>
      <Routes>
        <Route path="/conversation" element={<Conversation />} />
        <Route path="/serial" element={<SerialRegister />} />

      </Routes>
    </div>
  );
}

export default App;
