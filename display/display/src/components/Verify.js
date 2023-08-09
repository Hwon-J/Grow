import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 시리얼넘버와 센서 업데이트 함수 props 로 받기
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
    console.log(message)
    const mes = JSON.parse(message)
    console.log(mes)
    if (mes.content === true){
      alert('등록된 시리얼 번호입니다.')
      navigate('/characterchoice')
    }
    else {
        alert('등록되지 않은 번호입니다. pc에서 시리얼 번호를 등록해주세요.')
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

  
  // 굳이 메세지 보내는 기능은 필요 없지만 임시로 넣어 놓았습니다.
  const sendSerial = () => {
    if (socket && startmessage) {
      socket.send(JSON.stringify(startmessage));
    }

  };

  
  return (
    <div >
      <div>
        
        <button onClick={sendSerial}>등록된 시리얼 번호 인증하기</button>
      </div>
      
    </div>
  );
}

export default Verify;
