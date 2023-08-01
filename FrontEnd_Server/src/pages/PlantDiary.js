import React from 'react';
import Calendar from '../components/Calendar';
import MyInfo from '../components/MyInfo'; 
import { Container } from '@mui/material';
import NavTop from '../components/NavTop';
import './PlantDiary.scss'; 

const PlantDiary = () => {
  return (
    <>
    <NavTop/>
    <Container className='centered-elements'>
        <h1>plantDiary</h1>
        <MyInfo/>
        <Calendar/>
    </Container>
  </>
  )
}

export default PlantDiary;