import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { useDispatch } from "react-redux";
import { loginUserAction } from "../actions/user_action";

const Login = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let body = {
      id:email,
      pw:password,
    };

    dispatch(loginUserAction(body))
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid
          spacing={2}
          justifyContent="center"
          alignItems="center"
          style={{ height: "100vh" }}
        >
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="이메일"
              fullWidth
              variant="outlined"
              margin="normal"
              value={email}
              onChange={onChangeEmail}
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
  );
};

export default Login;
