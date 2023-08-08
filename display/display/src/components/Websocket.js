import React, { useState, useEffect } from 'react';

// 시리얼넘버와 센서 업데이트 함수 props 로 받기
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
  function getmessage (message) {
    console.log(message)
    const mes = JSON.parse(message)
    console.log(mes)
    if (mes.about === 'sensor'){
      console.log('getsensor')
      const light_value = mes.content.light
      const moisture = mes.content.moisture
      const temperature = mes.content.temperature
      const temperValue = mes.content.temperValue
      const newData = {"light":light_value,"moisture":moisture,"temperature":temperature,"temperValue":temperValue}
    sensor_update(newData);

    }
    else if (mes.about === 'gpt') {
      console.log('getgpt')
    }
    else if (mes.about === 'closer') {
      console.log('closer')
    }
    else if (mes.about === 'further') {
      console.log('further')
    }
  }

  useEffect(() => {
    // 웹소켓 연결을 설정하는 부분
    const newSocket = new WebSocket('ws://192.168.100.37:30002');
    console.log(props.serial_number)
    
    // 웹소켓이 열렸을 때의 이벤트 핸들러
    newSocket.onopen = () => {
      console.log('WebSocket connection established.');
      setSocket(newSocket);
      
    };
    
    
    // 웹소켓으로부터 메시지를 받았을 때의 이벤트 핸들러
    newSocket.onmessage = (event) => {
      console.log(event.data)
      console.log('getmessage')
      // setReceivedMessage(event.data)
      setReceivedMessage('안녕 나는 씨앗이야, 오늘 학교에서 무슨 일이 있었니')
      getmessage(event.data)
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
        purpose: "handshake",
        role: "display",
        content: null,
        serial: ""+serial_number
      };
      console.log(handshakemessage);
      socket.send(JSON.stringify(handshakemessage));
    }
  }, [socket]); // socket가 변경될 때마다 useEffect 호출
  
  // 굳이 메세지 보내는 기능은 필요 없지만 임시로 넣어 놓았습니다.
  const handleSendMessage = () => {
    const newData = {'온도':'적당', '조도': '적당', '수분':'충분'}
    sensor_update(newData);
    console.log(socket)
    setReceivedMessage('안녕 나는 씨앗이야, 오늘 학교에서 무슨 일이 있었니')
    if (socket && message) {
        const sendmessage = startmessage
        sendmessage.serial = message
        
        console.log('send')
      socket.send(JSON.stringify(sendmessage));
      setMessage('');
    }

  };

  // 표시할 메세지 박스의 스타일 설정
  const messagebox = {
    width: '270px',
    overflowY: 'auto',
    whiteSpace: 'normal',
    overflowWrap: 'break-word',
    fontSize : '30px'
  };
  return (
    <div >
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div style={messagebox}>
        <p>{receivedMessage}</p>
      </div>
    </div>
  );
}

export default WebSocketComponent;
