import React, { useState, useEffect } from 'react';


function WebSocketComponent() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const startmessage = {
    "role":"handshake",
    "serial":""
    }
  useEffect(() => {
    // 웹소켓 연결을 설정하는 부분
    const newSocket = new WebSocket('ws://192.168.100.37:30002');
    
    // 웹소켓이 열렸을 때의 이벤트 핸들러
    newSocket.onopen = () => {
      console.log('WebSocket connection established.');
      setSocket(newSocket);
      // socket.send(startmessage)
      console.log('처음 메세지 보냈을까?')
    };
    
    // 웹소켓으로부터 메시지를 받았을 때의 이벤트 핸들러
    newSocket.onmessage = (event) => {
      setReceivedMessage(event.data);
      console.log(event.data)
      console.log('getmessage')
    };
    
    // 웹소켓이 닫혔을 때의 이벤트 핸들러
    newSocket.onclose = () => {
      console.log('WebSocket connection closed.');
    };
    
    // 컴포넌트가 언마운트될 때 웹소켓 연결을 정리하는 함수를 반환
    return () => {
      newSocket.close();
    };
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행

  const handleSendMessage = () => {
    console.log(socket)
    if (socket && message) {
        const sendmessage = startmessage
        sendmessage.serial = message
        console.log('send')
      socket.send(JSON.stringify(sendmessage));
      setMessage('');
    }

  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div>
        <p>Received Message: {receivedMessage}</p>
      </div>
    </div>
  );
}

export default WebSocketComponent;
