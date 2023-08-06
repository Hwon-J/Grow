import React, { useState, useEffect } from 'react';


function WebSocketComponent(props) {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const startmessage = {
    "role":"handshake",
    "serial":""
    }
  console.log(props)
  const sensor_update = props.sensor_update
  useEffect(() => {
    // 웹소켓 연결을 설정하는 부분
    const newSocket = new WebSocket('ws://192.168.100.37:30002');
    console.log(props.serial_number)
    
    // 웹소켓이 열렸을 때의 이벤트 핸들러
    newSocket.onopen = () => {
      console.log('WebSocket connection established.');
      setSocket(newSocket);
      // console.log(socket)
      // const handshakemessage = {
      //   "role": "handshake", "serial": serial_number
      // }
      // console.log(handshakemessage)
      // socket.send(JSON.stringify(handshakemessage));
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

  useEffect(() => {
    const serial_number = props.serial_number
    if (socket) {
      const handshakemessage = {
        "role": "handshake", "serial":serial_number
      };
      console.log(handshakemessage);
      socket.send(JSON.stringify(handshakemessage));
    }
  }, [socket]); // socket 또는 serial_number가 변경될 때마다 useEffect 호출
  
  const handleSendMessage = () => {
    const newData = {'온도':'3', '조도': '52', '수분':'2'}
    sensor_update(newData);
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
