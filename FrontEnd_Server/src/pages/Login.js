// 김태형
import React, { useState } from 'react';
import { TextField, Grid, Container } from '@mui/material';
import { useDispatch } from "react-redux";
import { loginUserAction } from "../reducers/userSlice";
import NavTop from '../components/NavTop';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.scss';
const Login = () => {
  const dispatch = useDispatch(); // dispatch 사용할 예정
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.currentUser);
  const authToken = currentUser.token;
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChangeId = (e) => {
    setId(e.target.value);
  };
  
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let body = { // 해당 폼으로 dispatch전달할 예정
      id:id,
      pw:password,
    };
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!password.match(passwordRegex)) {
      return alert("비밀번호는 8자 이상이면서 숫자와 영어를 모두 포함해야 합니다.");
    }

    dispatch(loginUserAction(body))
    .then((action) => {
      const authToken = action.payload.token; // Assuming the token is stored in the payload

      // Check if authToken exists and navigate to '/login'
      if (authToken) {
        navigate('/profile');
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during the registration process
      console.log('Registration failed:', error);
    });
  };

  return (
    <>
    <NavTop/>
    <Container className="bgimg">
      <div className="container_box ">
      <div className="flexbox-left">
      </div>
      <div className="flexbox-right">
      <h2>LOG IN</h2>
        <form onSubmit={handleSubmit}>
          <Grid
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <TextField
                label="ID"
                fullWidth
                variant="outlined"
                margin="normal"
                value={id}
                onChange={onChangeId}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="비밀번호"
                fullWidth
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={onChangePassword}
              />
            </Grid>
            
            <Grid item xs={12}>
              {/* <Button type="submit" variant="contained" color="secondary" fullWidth>
                로그인
              </Button> */}
              <p>Forgot password?</p>
              <button type="submit" variant="contained" className="btn-hover color-5">Login</button>
            </Grid>
          </Grid>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
      </div>
    </Container>
    </>
  );
};

export default Login;
