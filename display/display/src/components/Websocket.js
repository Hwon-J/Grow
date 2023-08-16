import React, { useState, useEffect, useRef } from 'react';
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
  const [isgpt, setIsgpt] = useState(false);

  // 메세지들을 받는다면 그 관련 비동기 처리를 위해 임의의 변수 effect 설정
  // effect가 변할 때 마다 관련 useEffect 처리
  const [effect, setEffect] = useState('')
  
  
  // 백에서 메세지를 받았을 때 실행하는 함수 설정
  function getmessage (message) {
    // JSON 해체
    const mes = JSON.parse(message)
    console.log(mes)
    
    // 받은 메세지가 센서와 관련된 거라면
    if (mes.about === 'sensor'){
      console.log('getsensor')
      // 각 센서에 대한 센서값을 새로운 변수에 설정하여
      const light = mes.content.light
      const moisture = mes.content.moisture
      const temperature = mes.content.temperature
      const temperValue = mes.content.temperValue
      const water = mes.content.water
      // 새 객체에 담기
      const newData = {"light":light,"moisture":moisture,"temperature":temperature,"temperValue":temperValue, "water":water}
      // 새 객체로 센서값 업데이트하는 함수 실행
      sensor_update(newData);

      // 센서 객체 내 water의 value가 passed라면 물 줘야하는 날짜가 지났을 때
      // 물을 줘야 하는 경우
      if (water === 'passed' && moisture === '부족') {
        // 물 줘야 할 때 true로 변경
        setWatering(true)
      }
      // 아직 물 줄 때가 되지 않았다면
      else if (water === 'not passed' || moisture !== '부족') {
        // 물 줘야 할 때를 false로 변경
        setWatering(false)
      }

    }

    // 받은 메세지가 gpt 답변이라면
    else if (mes.about === 'gpt') {
      setEffect(mes)

    }

    //받은 메세지가 hear라면 gpt가 듣고 있는 상태이다.
    else if (mes.about === 'hear') {
      setEffect(mes)

    }

    // 받은 메세지가 좀더 가까이 와달라는 메시지라면
    else if (mes.about === 'closer') {
      setEffect(mes)

    }

    // 받은 메세지가 아이가 멀어졌다고 생각해 답변이 끝난 경우라면
    else if (mes.about === 'further') {
      setEffect(mes)

    }
    // 받은 메세지가 break라면 아이가 근처에 왔지만 말하는 것을 취소했을 경우이기 때문에
    // 말풍선 초기화
    else if (mes.about === 'break') {
      setEffect(mes)
    }
  }

  useEffect(() => {
    
    // 웹소켓 링크 설정
    const newSocket = new WebSocket('ws://i9c103.p.ssafy.io:30002');
    // const newSocket = new WebSocket('ws://localhost:5000');
    // const newSocket = new WebSocket('ws://192.168.100.37:30002');
    
    // 웹소켓이 열렸을 때의 이벤트 핸들러
    newSocket.onopen = () => {
      console.log('메인 웹소켓 시작');
      setSocket(newSocket);
      
    };
    
    
    // 웹소켓으로부터 메시지를 받았을 때의 이벤트 핸들러
    newSocket.onmessage = (event) => {
      // 메세지 받았을 때 함수 설정
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
      
      socket.send(JSON.stringify(handshakemessage));
    }
  }, [socket]); // socket가 변경될 때 : 즉 소켓에 설정한 링크로 변경 됐을 때 자동으로 실행
  


  useEffect(() => {
    // gpt 답변이라면 시간설정
    if (effect.about === 'gpt') {
      console.log(effect)
      const gpt_answer = effect.content
    
      // 캐릭터 생각 상태 off
      set_thinking(false)
      // 캐릭터 말하는 상태 on
      set_talking(true)
      // gpt 답변으로 받은(말풍선 안에 띄울) 메세지 변경
      setReceivedMessage(gpt_answer)
      // gpt 답변이니 관련 변수 true
      const displayTimeout = setTimeout(() => {
        console.log('20초 종료')
        // setIsgpt(false)
        setReceivedMessage('');
        // gpt 답변이 끝났으니 다시 false로 설정
        
        
      }, 20000);

      return () => {
        
        setTimeout(()=> 
      
        
        clearTimeout(displayTimeout))

      };
    }
    else if (effect.about === 'closer')
    {
      
      setReceivedMessage('대화를 시작하려면 좀 더 가까이 와줘')
      set_talking(true)
    }
    else if (effect.about === 'hear')
    {
      
      
      setReceivedMessage('지금 얘기 듣고 있어~')
      
      set_talking(true)
    }
    else if (effect.about === 'further') {
      setReceivedMessage('답변을 생각중이야')
      set_thinking(true)
      // 말하기 상태 off
      set_talking(false)
    }

    else if (effect.about === 'break') {
      setReceivedMessage('')
      set_thinking(false)
      // 말하기 상태 off
      set_talking(false)
    }
 }, [effect]);

  // 표시할 메세지 박스의 스타일 설정
  const messagebox = {
    width: '470px',
    height: '600px',
    overflowY: 'auto',
    whiteSpace: 'normal',
    overflowWrap: 'break-word',
    fontSize : '40px',
    fontFamily: 'Pretendard-Regular'
  };


  // 자동 스크롤 내리기에 관련된 함수와 변수들
  const [scrollPosition, setScrollPosition] = useState(0);
  // 말풍선 div 관련 정보
  const scrollableDivRef = useRef(null);
  // 말풍선 내용에 해당하는 p태그 관련 정보
  const paragraphRef = useRef(null);
  // 스크롤이 내려가거나 멈추도록 설정하는 변수
  const [isScrolling, setIsScrolling] = useState(true);
  

  useEffect(() => {
    // scrollposition과 message가 바꼈을 때
    // 메시지가 빈 값이 아니고, 스크롤이 가능할 때
    if (receivedMessage !== '' && isScrolling) {
    console.log(scrollableDivRef.current.clientHeight, paragraphRef.current.clientHeight)
    // 스크롤을 밑으로 내리는 함수 호출
    scrollToBottom()}
  }, [scrollPosition, receivedMessage]);

  // 스크롤 내리는 함수 선언
  function scrollToBottom() {
    // 말풍선 div가 존재하고, 스크롤이 가능하고, 말풍선 내용 p가 말풍선 크기 div보다 클 때
    if (scrollableDivRef.current && isScrolling && (paragraphRef.current.clientHeight > scrollableDivRef.current.clientHeight)) {
      // 0부터 시작하는 scroll위치가 div를 초과하는만큼의 p 크기에 도달하고 스크롤 포지션이 0이 아니고 p태그 높이도 0이 아닐 때
      if (scrollPosition >= (paragraphRef.current.clientHeight - scrollableDivRef.current.clientHeight) && scrollPosition !== 0 && paragraphRef.current.clientHeight !== 0) {
        // 스크롤 가능 변수 false 설정 > 스크롤 그만
        setIsScrolling(false)
        // 스크롤 포지션 다시 0으로 리셋
        setScrollPosition(0)
        // 함수 종료
        return
      }
      // 스크롤 포지션 0.03씩 내리기
      setScrollPosition(prevPosition => (prevPosition + 0.03) )
      // 현재 말풍선 div의 스크롤 윗부분을 스크롤 포지션 변수값으로 할당하여 점점 내리기
      scrollableDivRef.current.scrollTop = scrollPosition;
    }
    setTimeout(scrollToBottom, 1000000);
  }
  // 웹소켓 컴포넌트 구조
  // 그냥 메시지만 띄울 뿐
  return (
    <div >
      
      <div ref={scrollableDivRef} style={messagebox} >
        
        <p ref={paragraphRef}>{receivedMessage}</p>
        
      </div>
    </div>
  );
}

export default WebSocketComponent;
