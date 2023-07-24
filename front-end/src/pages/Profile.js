import React from 'react';
import PlantCard from '../components/plantCard';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const currentUser = {
    name: '김태형',
    email: 'sol20s@naver.com'
  };



  function cardSet() {
    const arr = [];
    for (let i = 0; i < 2; i++) {
      arr.push(<PlantCard  key={i} />);
    }
    return arr;
  }

  return (
    <React.Fragment>
      <div>
        <h1>Profile</h1>
        <h2>name: {currentUser.name}</h2>
        <h2>email: {currentUser.email}</h2>
      </div>
      <div className="container">
        {cardSet()}
      </div>
    </React.Fragment>
  );
};

export default Profile;
