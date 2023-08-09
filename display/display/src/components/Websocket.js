import React, { useState, useEffect } from 'react';

// 시리얼넘버와 센서 업데이트 함수 props 로 받기
function WebSocketComponent(props) {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  
  const sensor_update = props.sensor_update
  const [watering, setWatering] = useState(false)
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
      const water = mes.content.water
      const newData = {"light":light_value,"moisture":moisture,"temperature":temperature,"temperValue":temperValue, "water":water}
      sensor_update(newData);
      if (water === 'passed'){
        setWatering(true)
      }
      else if (water === 'not passed'){
        console.log('err')
        setWatering(false)
        console.log(watering)
      }

    }
    else if (mes.about === 'gpt') {
      console.log('getgpt')
      const gpt_answer = mes.content
      setReceivedMessage(gpt_answer)
    }
    else if (mes.about === 'closer') {
      console.log('closer')
      setReceivedMessage('좀 더 가까이 와서 말해줘')
    }
    else if (mes.about === 'further') {
      console.log('further')
      setReceivedMessage('답변을 생각중이야')
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
  
  

  // 표시할 메세지 박스의 스타일 설정
  const messagebox = {
    width: '270px',
    overflowY: 'auto',
    whiteSpace: 'normal',
    overflowWrap: 'break-word',
    fontSize : '30px',
    fontFamily: 'iceSotong-Rg'
  };
  return (
    <div >
      
      <div style={messagebox}>
        <p>{receivedMessage}</p>
      </div>
    </div>
  );
}

export default WebSocketComponent;
