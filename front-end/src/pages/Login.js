// 김태형
import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { useDispatch } from "react-redux";
import { loginUserAction } from "../reducers/userSlice";
import 'bootstrap/dist/css/bootstrap.min.css';
const Login = () => {
  const dispatch = useDispatch(); // dispatch 사용할 예정

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

    dispatch(loginUserAction(body)) //loginUserAction액션에 body전달  'useSlice확인'
  };

  return (
    
    <div className='containerbox'>
      <div className="flexbox-left">

      </div>
      <div className="flexbox-right">
      <h2>로 그 인</h2>
        <form onSubmit={handleSubmit}>
          <Grid
            spacing={2}
            justifyContent="center"
            alignItems="center"

          >
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="ID"
                fullWidth
                variant="outlined"
                margin="normal"
                value={id}
                onChange={onChangeId}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
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

            <Grid item xs={12} sm={6} md={4}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                로그인
              </Button>
            </Grid>
          </Grid>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
