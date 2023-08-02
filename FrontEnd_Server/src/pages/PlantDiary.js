import React from 'react';
import Calendar from '../components/Calendar';
import MyInfo from '../components/MyInfo';
import { Container as MuiContainer } from '@mui/material';
import NavTop from '../components/NavTop';
import { styled } from '@mui/system';
import './PlantDiary.scss';

const ResponsiveContainer = styled(MuiContainer)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),

  [theme.breakpoints.down('sm')]: {
    width: '95%',
  },
  [theme.breakpoints.up('md')]: {
    width: '80%',
  },
  [theme.breakpoints.up('lg')]: {
    width: '70%',
  },
}));

const PlantDiary = () => {
  return (
    <div className='diary_total'>
      <NavTop />
      <ResponsiveContainer className="centered-elements">
        <h1>plantDiary</h1>
        <MyInfo />
        <Calendar />
      </ResponsiveContainer>
    </div>
  );
};

export default PlantDiary;
