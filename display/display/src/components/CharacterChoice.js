
import React, { useState, useEffect } from 'react';
import './CharacterChoice.css';
import lettucecharacter from '../assets/lettucecharacter.png';

import beancharacter from '../assets/beancharacter.png';
import tomatocharacter from '../assets/tomatocharacter.png';

import { useNavigate, useParams } from 'react-router-dom';

// 캐릭터 선택 컴포넌트 정의
export default function CharacterChoice() {
    // navigate를 사용하기 위해 기능 변수 설정
    const navigate = useNavigate()
    // 넘겨 받은 시리얼 번호 등록
    const params = useParams()
    const base_serial_number = params.serial_number
    // 몇 번 캐릭터를 골랐는지 백으로 보내주기 위해 미리 소켓 설정
    const [socket, setSocket] = useState(null);
    // 현재 존재하는 캐릭터들을 다 보여주기 위해 리스트 형식으로 정의
    const character_list = [beancharacter, lettucecharacter, tomatocharacter]
    
    useEffect(() => {
      // 웹소켓하고 싶은 링크 설정
      const newSocket = new WebSocket('ws://i9c103.p.ssafy.io:30002');
      // const newSocket = new WebSocket('ws://192.168.100.37:30002');
      
      
      // 웹소켓이 연결됐을 때 설정한 웹소켓 링크로 변경
      newSocket.onopen = () => {
        console.log('캐릭터 등록 웹소켓 준비 완료');
        setSocket(newSocket);
        
      };
      
      // 웹소켓이 닫혔을 때
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
        {/* 캐릭터 리스트의 인덱스에 따라 map 반복 실행  */}
        {character_list.map((character, index) => (
          <img key={index} src={character} alt={`Character ${index}`} 
          onClick={() => {
            // 해당 이미지를 누르면 백으로 데이터베이스에 캐릭터 인덱스를 저장하라는 메세지 보내기
            // 그 후 캐릭터 인덱스와 시리얼 번호를 가지고 대화창 컴포넌트로 이동
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

