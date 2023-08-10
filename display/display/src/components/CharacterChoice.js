
import React, { useState, useEffect } from 'react';
import './CharacterChoice.css';
import lettucecharacter from '../assets/lettucecharacter.png';

import beancharacter from '../assets/beancharacter.png';
import tomatocharacter from '../assets/tomatocharacter.png';
import logo from '../assets/logo.png';
import { BrowserRouter, Route, Routes, useNavigate, useParams } from 'react-router-dom';

export default function CharacterChoice() {
    // navigate와 dispatch를 사용하기 위해 기능 변수 설정
    const navigate = useNavigate()
    const [socket, setSocket] = useState(null);
    const params = useParams()
    const base_serial_number = params.serial_number
    // console.log(base_serial_number)
    const character_list = [beancharacter, lettucecharacter, tomatocharacter]
    
    useEffect(() => {
      // 웹소켓 연결을 설정하는 부분
      // const newSocket = new WebSocket('ws://i9c103.p.ssafy.io:30002');
      const newSocket = new WebSocket('ws://192.168.100.37:30002');
      
      
      // 웹소켓이 열렸을 때의 이벤트 핸들러
      newSocket.onopen = () => {
        console.log('캐릭터 등록 웹소켓 준비 완료');
        setSocket(newSocket);
        
      };
      
      
      // 웹소켓으로부터 메시지를 받았을 때의 이벤트 핸들러
      
      
      // 웹소켓이 닫혔을 때의 이벤트 핸들러
      newSocket.onclose = () => {
        console.log('캐릭터 등록 웹소켓 종료');
      };
      
      // 컴포넌트가 언마운트될 때 웹소켓 연결을 정리하는 함수를 반환
      return () => {
        newSocket.close();
      };
    }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행
  
    return (
      <div className='characterchoice'>
        <div>

        <h1> 마음에 드는 캐릭터를 골라주세요. </h1>
        {character_list.map((character, index) => (
          <img key={index} src={character} alt={`Character ${index}`} 
          onClick={() => {
            const character_message = {
              purpose: "character",
              role: "display",
              content: index,
              serial: base_serial_number,
            }
            socket.send(JSON.stringify(character_message))
            navigate(`/conversation/${index}/${base_serial_number}`)
          }}/>
          ))}
        </div>
      </div>
    )
  
  }

