import React from 'react';
import Calendar from '../components/Calendar';
import MyInfo from '../components/MyInfo'; 
import { Container } from '@mui/material';
import './PlantDiary.scss'; 

const PlantDiary = () => {
  return (
    <div className='diary'>
    <Container >
        <h1>plantDiary</h1>
        <MyInfo/>
        <Calendar/>
    </Container>
    </div>
  )
}

export default PlantDiary;