
import React from 'react';
import './CharacterChoice.css';
import lettucecharacter from '../assets/lettucecharacter.png';

import beancharacter from '../assets/beancharacter.png';
import tomatocharacter from '../assets/tomatocharacter.png';
import logo from '../assets/logo.png';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

export default function CharacterChoice() {
    // navigate와 dispatch를 사용하기 위해 기능 변수 설정
    const navigate = useNavigate();
    const base_serial_number = '97745'
    const character_list = [beancharacter, lettucecharacter, tomatocharacter]
    
    
    return (
      <div className='characterchoice'>
        <div>

        <h1> 마음에 드는 캐릭터를 골라주세요. </h1>
        {character_list.map((character, index) => (
          <img key={index} src={character} alt={`Character ${index}`} 
          onClick={() => {
            navigate(`/conversation/${index}/${base_serial_number}`)
          }}/>
          ))}
        </div>
      </div>
    )
  
  }

