import React from 'react';
import Calendar from '../components/Calendar';
import MyInfo from '../components/MyInfo';
import { Container, Grid } from '@mui/material';
import NavTop from '../components/NavTop';
import QuestPage from '../components/QuestPage';
import './PlantDiary.scss';

const PlantDiary = () => {
  return (
    <div className='diary_total'>
      <NavTop />
      <Container className="centered-elements">
        <h1>plantDiary</h1>
        <Grid container className="diary-container" spacing={2}>
          <Grid item sm={12} md={4}>
            <MyInfo />
            <Calendar />
          </Grid>
          <Grid item sm={12} md={8}>
            <QuestPage />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default PlantDiary;
