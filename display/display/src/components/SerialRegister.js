
import React from 'react';
import background from '../assets/BackgroundPicture.gif';
import flowercharacter from '../assets/flowercharacter.png';
import lettucecharacter from '../assets/lettucecharacter.png';
import potcharacter from '../assets/potcharacter.png';
import logo from '../assets/logo.png';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch} from 'react-redux';
import WebSocketComponent from './Websocket';
import { useEffect } from 'react';

export default function SerialRegister() {
    // navigate와 dispatch를 사용하기 위해 기능 변수 설정
    const navigate = useNavigate();
    const dispatch = useDispatch()
    
    // 이건 일단 그냥 넣어놓음 ㅋㅋ
    const state_serial_number = useSelector((state) => {
      return state.serial_number
    })
    return (
      <div>
        
        <h3>해당 기기의 시리얼 넘버를 입력해주세요.</h3>
        <form onSubmit={(event)=>{
            // 제출할 때 새로고침 방지
          event.preventDefault()
          console.log(event.target.number.value)
            // 이벤트 속 타겟(form) 안에 number라는 이름의 태그(input 태그)의 value 값
          const serial_number = event.target.number.value
            
            // 입력받은 serial 번호를 url에 담아 백엔드로 axios 요청, CORS 기능을 해제하기 위해 부가 설정
          axios.get(`http://i9c103.p.ssafy.io:30001/api/pot/${serial_number}`, { withCredentials: false })
            // 응답이 왔다면 응답 status에 따른 경우 처리
          .then(response => {
            console.log(response)
            const status = response.status
            console.log(status)
            // 등록을 할 수 있는 시리얼 번호라면
            if ( status === 200) {
              alert('등록 성공! 대화 페이지로 이동합니다.')
            // /conversation url로 이동하여 대화 컴포넌트가 열림 
            navigate('/conversation')
            // store에 Success 타입의 디스패치 보내기
            dispatch({type : 'SUCCESS'})
            console.log(state_serial_number)
            // 로컬스토리지에 등록이 됐다는 것을 설정
            localStorage.setItem('registration', true)
            
            }
            // 등록 불가능한 시리얼 번호
            else if (status === 202) {
              alert('시리얼 번호를 다시 확인해주세요.')
            }
            
          })
          // 에러 처리
          .catch(err => {
            console.log(err)
            // console.log(err.response.status)
            const status = err.response.status
            // 등록 불가능한 시리얼 번호
            if (status === 401) {
              alert('시리얼 번호를 다시 확인해주세요.')
            }
            // 등록 불가능한 시리얼 번호
            else if (status === 404) {
              alert('부모님께서 PC로 아이와 식물을 등록해주세요.')
            }
          })
          
        }}>
            {/* 윗줄까지가 제출했을 때 호출되는 함수 설명  */}
            {/* 폼 형태 설정 */}
          <input placeholder="SerialNumber" name="number" />
          <input type="submit" value="확인"></input>
        </form>
        <img src={logo} alt="cancel" />
  
      </div>
    )
  
  }

