import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Verify() {
  const navigate = useNavigate()
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const startmessage = {
    purpose: "handshake",
    role: "display",
    content: null,
    serial: '97745'
    }
  
  function serialVerify (message) {
    
    const mes = JSON.parse(message)
    
    if (mes.about === 'serialCheck'){

      if (mes.content === 'success'){
        alert('등록된 시리얼 번호입니다. 캐릭터 선택창으로 이동합니다.')
        navigate(`/characterchoice/${startmessage.serial}`)
      }
      else if (mes.content === 'unregistered') {
        alert('등록되지 않은 번호입니다. pc에서 시리얼 번호를 등록해주세요.')
      }
      else if (mes.content === 'not exist') {
        alert('존재하지 않은 번호입니다. 시리얼 번호를 다시 확인해주세요.')
      }
      else {
        alert('에러 발생')
      }
    }
  }

  useEffect(() => {
    // 웹소켓 연결을 설정하는 부분
    const newSocket = new WebSocket('ws://i9c103.p.ssafy.io:30002');
    
    
    // 웹소켓이 열렸을 때의 이벤트 핸들러
    newSocket.onopen = () => {
      console.log('시리얼 번호 검증 웹소켓 준비 완료');
      setSocket(newSocket);
      
    };
    
    
    // 웹소켓으로부터 메시지를 받았을 때의 이벤트 핸들러
    newSocket.onmessage = (event) => {
      console.log(event.data)

      
      serialVerify(event.data)
    };
    
    // 웹소켓이 닫혔을 때의 이벤트 핸들러
    newSocket.onclose = () => {
      console.log('검증 전용 웹소켓 종료');
    };
    
    // 컴포넌트가 언마운트될 때 웹소켓 연결을 정리하는 함수를 반환
    return () => {
      newSocket.close();
    };
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행

  
  
  const sendSerial = () => {
    if (socket && startmessage) {
      socket.send(JSON.stringify(startmessage));
    }

  };
  const buttonposition = {
    position: 'fixed',
    top: '35%', // 여기서 높이를 조절할 수 있습니다.
    left: '35%',
    fontFamily: 'iceSotong-Rg'
  }
  
  return (
    <div  >
      <div style={buttonposition}>

        <h1>이 기기의 시리얼 번호 : {startmessage.serial}</h1>
        <button  className='btn btn-primary' onClick={sendSerial}>
          등록된 시리얼 번호 인증하기
        </button>
      </div>
      
    </div>
  );
}

export default Verify;
