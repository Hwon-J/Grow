import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from "sweetalert2";
import register from '../assets/register.png';

function Verify() {
  const navigate = useNavigate()
  // 웹소켓을 위한 소켓 설정
  const [socket, setSocket] = useState(null);
  // 웹소켓이 실행되고 나서 백엔드로 보낼 메세지
  const startmessage = {
    purpose: "handshake",
    role: "display",
    content: null,
    serial: '97745'
    }
  // Alert 변경을 위한 변수 설정
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-center',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    
    })  
  
  // 백에서 받은 메시지에 따라 다음 행동 결정
  function serialVerify (message) {
    // 백에서 받은 메세지 JSON 해체
    const mes = JSON.parse(message)
    // 유저가 등록이 되어있는 시리얼 번호라면
    if (mes.about === 'serialCheck'){
      // 그 중에 캐릭터가 등록되지 않는 경우
      if (mes.content === -1){
        // 시리얼 넘버 등록 성공 메세지를 띄우고
        Toast.fire({
          icon: 'success',
          title: '등록 인증 성공!'
      })
        // 메세지가 꺼진다면 캐릭터 선택 컴포넌트로 네비게이트 (현재 시리얼 번호값을 가지고)
        .then(res => {
          navigate(`/characterchoice/${startmessage.serial}`)

        }
        )
      }
      // 해당 시리얼 번호가 존재하긴 하지만 유저 등록이 되어 있지 않다면
      else if (mes.content === 'unregistered') {
        // 웹에서 등록을 해달라는 메세지 띄우기
        Swal.fire({
          title: '등록되지 않은 번호입니다!',
          text: '부모님께 PC의 해당 페이지에 등록을 요청해주세요.',
          imageUrl: register,
          imageWidth: 600,
          imageHeight: 300,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
          
        })
      }
      // 해당 시리얼 번호가 애초에 존재하지 않다면
      else if (mes.content === 'not exist') {
        // 시리얼 번호를 다시 한번 확인해달라는 메세지 띄우기
        Toast.fire({
          icon: 'warning',
          title: '존재하지 않는 번호에요. 다시 한 번 확인해주세요.'
      })
      }
      // 백에서 알 수 없는 에러 발생
      else if (mes.content === 'error'){
        Toast.fire({
          icon: 'error',
          title: '알 수 없는 에러 발생'
      })
      }
      // 나머지 경우는 모두 캐릭터 등록이 되어있는 경우라서
      // 캐릭터 인덱스를 받고 바로 대화창 컴포넌트로 이동 ( 캐릭터 인덱스, 시리얼 넘버 가지고)
      else {
        const character_index = mes.content
        Toast.fire({
          icon: 'success',
          title: '등록 인증 성공!'
        })
        .then(res => {
          navigate(`/conversation/${character_index}/${startmessage.serial}`)

        })
      }
    }
  }

  //Verify 컴포넌트가 실행될 때 자동으로 한 번 실행
  useEffect(() => {
    // 어디 웹소켓 링크로 설정하는 부분
    const newSocket = new WebSocket('ws://i9c103.p.ssafy.io:30002');
    // const newSocket = new WebSocket('ws://192.168.100.37:30002');
    
    
    // 웹소켓이 열렸을 때의 이벤트 핸들러
    newSocket.onopen = () => {
      console.log('시리얼 번호 검증 웹소켓 준비 완료');
      // 빈소켓에서 설정한 웹소켓 링크로 변경
      setSocket(newSocket);
      
    };
    
    
    // 웹소켓으로부터 메시지를 받았을 때
    // 위에서 설정한 함수 실행
    newSocket.onmessage = (event) => {
      serialVerify(event.data)
    };
    
    // 웹소켓이 닫혔을 때 닫힌 걸 알리기
    newSocket.onclose = () => {
      console.log('검증 전용 웹소켓 종료');
    };
    
    // 컴포넌트가 언마운트될 때 웹소켓 연결을 닫기
    return () => {
      newSocket.close();
    };
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행

  
  // 등록 인증 버튼을 눌렀을 때 함수 정의
  const sendSerial = () => {
    // 현재 소켓과 메세지가 둘다 있는 상태라면 ( 빈 소켓 상태에서 메세지를 보내면 에러를 발생함. )
    if (socket && startmessage) {
      socket.send(JSON.stringify(startmessage));
    }

  };
  // 버튼 위치 설정 > 이것은 마음에 안들면 수정 가능
  const buttonposition = {
    position: 'fixed',
    top: '35%', 
    left: '35%',
    fontFamily: 'iceSotong-Rg'
  }
  
  // Verify 컴포넌트 실제 구조
  return (
    <div  >
      <div style={buttonposition}>

        <h1>이 기기의 시리얼 번호 : {startmessage.serial}</h1>
        {/* 버튼 눌렀을 때 위 함수 실행  */}
        <button  className='btn btn-primary' onClick={sendSerial}>
          등록된 시리얼 번호 인증하기
        </button>
      </div>
      
    </div>
  );
}

export default Verify;
