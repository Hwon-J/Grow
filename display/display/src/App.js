// 김민국 초안 작성

// import logo from './logo.svg';
import './App.css';
import backgroundImage from './assets/background.PNG';
import flowercharacter from './assets/flowercharacter.png';
import potcharacter from './assets/potcharacter.png';
import logo from './assets/logo.png';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch} from 'react-redux';

function serial_reducer(current_serial, action) {
  if (current_serial === undefined) {
    return {
      serial_number : false
    }
  }
  else {
    if (action.type === 'SUCCESS') {

      const new_serial = {...current_serial}
      new_serial.serial_number = true
      console.log(new_serial)
      return new_serial
    }
  }
  console.log('serial', current_serial)
}
const store = createStore(serial_reducer)


function Conversation() {
  const character_style = {
    height : '300px'

  }


  return (
    <div>
      <img src={flowercharacter} alt="cancel" style={character_style} />
    </div>
  )
}

function SerialRegister() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  function f(state) {
    return state
  }
  const state_serial_number = useSelector(f)
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
        axios.get(`http://http://i9c103.p.ssafy.io:30001/api/pot/${serial_number}`, { withCredentials: false })
        // 현재는 한 컴퓨너 안에서 작업에서 로컬로 돼있지만 나중에는 위 url을 외부 url로 바꿔줘야 함.
        .then(response => {
          console.log(response)
          alert('등록 성공! 대화 페이지로 이동합니다.')
          navigate('/conversation')
          dispatch({type : 'SUCCESS'})
          console.log(state_serial_number)
        })
        .catch(err => {
          console.log(err)
          console.log(err.response.status)
          const status = err.response.status
          if (status === 401) {
            alert('부모님께서 PC로 아이와 식물을 등록해주세요.')
          }
          else if (status === 404) {
            alert('시리얼 번호를 다시 확인해주세요')
          }
        })
        
      }}>

        <input placeholder="SerialNumber" name="number" />
        <input type="submit" value="확인"></input>
      </form>
      <img src={logo} alt="cancel" />

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
