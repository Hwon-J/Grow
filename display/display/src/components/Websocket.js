import React, { useState, useEffect } from 'react';
// 웹소켓 컴포넌트 정의
// 시리얼넘버와 센서 업데이트 함수 props 로 받기
function WebSocketComponent(props) {
  // 대화창 컴포넌트의 상태를 바꿔주는 함수를 그대로 props 받으면 여기서 그 함수를 실행해도 대화창 컴포넌트 상태값 변경 가능
  // 센서값 바꾸는 함수
  const sensor_update = props.sensor_update
  // 캐릭터 말하는 상태 바꾸는 함수
  const set_talking = props.set_talking
  // 캐릭터 생각하는 상태 바꾸는 함수
  const set_thinking = props.set_thinking
  const setWatering = props.setWatering
  // 시리얼 번호 가져오기
  const serial_number = props.serial_number
  // 소켓 설정
  const [socket, setSocket] = useState(null);
  
  // 캐릭터 말풍선에 띄울 텍스트 설정
  const [receivedMessage, setReceivedMessage] = useState('');
  // gpt 답변인지 구별을 위한 변수 설정
  const [isgpt, setIsgpt] = useState(null);
  
  
  // 백에서 메세지를 받았을 때 실행하는 함수 설정
  function getmessage (message) {
    // JSON 해체
    const mes = JSON.parse(message)
    console.log(mes)
    
    // 받은 메세지가 센서와 관련된 거라면
    if (mes.about === 'sensor'){
      console.log('getsensor')
      // 각 센서에 대한 센서값을 새로운 변수에 설정하여
      const light_value = mes.content.light
      const moisture = mes.content.moisture
      const temperature = mes.content.temperature
      const temperValue = mes.content.temperValue
      const water = mes.content.water
      // 새 객체에 담기
      const newData = {"light":light_value,"moisture":moisture,"temperature":temperature,"temperValue":temperValue, "water":water}
      // 새 객체로 센서값 업데이트하는 함수 실행
      sensor_update(newData);

      // 센서 객체 내 water의 value가 passed라면 물 줘야하는 날짜가 지났을 때
      // 물을 줘야 하는 경우
      if (water === 'passed' && moisture === '부족'){
        // 물 줘야 할 때 true로 변경
        setWatering(true)
      }
      // 아직 물 줄 때가 되지 않았다면
      else if (water === 'not passed'){
        // 물 줘야 할 때를 false로 변경
        setWatering(false)
      }

    }

    // 받은 메세지가 gpt 답변이라면
    else if (mes.about === 'gpt') {
      // gpt 답변에 대해 새로운 변수 할당
      const gpt_answer = mes.content
      
      console.log('위쪽')
      console.log('위쪽', isgpt)
      // 캐릭터 생각 상태 off
      set_thinking(false)
      // 캐릭터 말하는 상태 on
      set_talking(true)
      // gpt 답변으로 받은(말풍선 안에 띄울) 메세지 변경
      setReceivedMessage(gpt_answer)
      // gpt 답변이니 관련 변수 true
      setIsgpt(true)
      console.log(isgpt)
      // 5초 시간 지연 뒤 위에서 설정한 displayTimeout 함수 실행
      // console.log('위 true로 바꾸고', isgpt)
      setTimeout(function() {
        console.log(isgpt)
        setIsgpt(false)
        console.log('5초뒤?')
        console.log(isgpt)
      }, 5000);
    }
    else if (mes.about === 'hear' && isgpt === false) {
      console.log('hear')
      // 캐릭터 말하기 상태 on > 말풍선 켜짐
      set_talking(true)
      setReceivedMessage('지금 얘기 듣고 있어~')
    }
    // 받은 메세지가 좀더 가까이 와달라는 메시지라면
    else if (mes.about === 'closer' && isgpt === false) {
      console.log('closer')
      console.log('closer', isgpt)
      // 캐릭터 말하기 상태 on > 말풍선 켜짐
      set_talking(true)
      setReceivedMessage('좀 더 가까이 와서 말해줘')
    }

    // 받은 메세지가 아이가 멀어졌다고 생각해 답변이 끝난 경우라면
    else if (mes.about === 'further' && isgpt === false ) {
      console.log('further')
      // 생각 중 상태 on
      set_thinking(true)
      // 말하기 상태 off
      set_talking(false)
      setReceivedMessage('답변을 생각중이야')
    }
  }

  useEffect(() => {
    // isGpt()
    // 웹소켓 링크 설정
    // const newSocket = new WebSocket('ws://i9c103.p.ssafy.io:30002');
    const newSocket = new WebSocket('ws://localhost:5000');
    // const newSocket = new WebSocket('ws://192.168.100.37:30002');
    
    // 웹소켓이 열렸을 때의 이벤트 핸들러
    newSocket.onopen = () => {
      console.log('메인 웹소켓 시작');
      setSocket(newSocket);
      
    };
    
    
    // 웹소켓으로부터 메시지를 받았을 때의 이벤트 핸들러
    newSocket.onmessage = (event) => {
      // 메세지 받았을 때 함수 설정
      // console.log('getmessage')
      getmessage(event.data)
    };
    
    // 웹소켓이 닫혔을 때의 이벤트 핸들러
    newSocket.onclose = () => {
      console.log('메인 웹소켓 종료');
    };
    
    // 컴포넌트가 언마운트될 때 웹소켓 종료
    return () => {
      newSocket.close();
    };
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행

  useEffect(() => {
    // 소켓이 있다면
    if (socket) {
      // 핸드세이크 메세지 설정 후 JSON 변환 후 보내기
      const handshakemessage = {
        purpose: "handshake",
        role: "display",
        content: null,
        serial: ""+serial_number
      };
      // console.log(handshakemessage);
      socket.send(JSON.stringify(handshakemessage));
    }
  }, [socket]); // socket가 변경될 때 : 즉 소켓에 설정한 링크로 변경 됐을 때 자동으로 실행
  
//   useEffect(() => {
//     console.log('useEffect 제일 윗줄')
//     // gpt 답변이라면 시간설정
    
//     if (isgpt === true) {
//       console.log('useEffect하자마자 true일때',isgpt)
      
//       const displayTimeout = setTimeout(() => {
//         setReceivedMessage('');
//         // gpt 답변이 끝났으니 다시 false로 설정
//         // setIsgpt(false)
//         console.log('5초뒤 메세지 지우고 setisgpt false로 바꾸고 난 직후',isgpt)
//         // console.log('13579')
//       }, 5000);

//       return () => {
//         // setIsgpt(true)
//         console.log('useEffct에서 반환하는 곳 시간지연함수 직전', isgpt)
//         clearTimeout(displayTimeout);

//       };
//     }
//     else {
//       console.log('useEffect실행은 됐지만 isgpt false일때',isgpt)
//     }
//  }, [isgpt, receivedMessage]);

  // 표시할 메세지 박스의 스타일 설정
  const messagebox = {
    width: '470px',
    overflowY: 'auto',
    whiteSpace: 'normal',
    overflowWrap: 'break-word',
    fontSize : '40px',
    fontFamily: 'Pretendard-Regular'
  };

  // 웹소켓 컴포넌트 구조
  // 그냥 메시지만 띄울 뿐
  return (
    <div >
      
      <div style={messagebox}>
        <p>{receivedMessage}</p>
        <h1>{isgpt}</h1>
      </div>
    </div>
  );
}

export default WebSocketComponent;
