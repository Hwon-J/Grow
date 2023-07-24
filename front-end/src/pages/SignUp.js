import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from './user_action';
import { TextField, Button, Grid } from '@mui/material';
const SignUp = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onChangeName = (e) => {
    setUsername(e.target.value);
  };
  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const onChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert('입력한 비밀번호가 다릅니다!');
    }

    let body = {
      username,
      email,
      password,
    };
    dispatch(registerUser(body))
      .then((res) => {
        if (res.payload.success) {
          // 로그인 페이지로 리다이렉션
          window.location.href = '/login';
        } else {
          alert('회원가입에 실패했습니다.');
        }
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <Grid  spacing={2} justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField label="이름" fullWidth variant="outlined" margin="normal" value={username} onChange={onChangeName} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField label="이메일" fullWidth variant="outlined" margin="normal" value={email} onChange={onChangeEmail} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField label="비밀번호" fullWidth type="password" variant="outlined" margin="normal" value={password} onChange={onChangePassword}  />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField label="비밀번호" fullWidth type="password" variant="outlined" margin="normal" value={confirmPassword} onChange={onChangeConfirmPassword}  />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            회원가입
          </Button>
        </Grid>
      </Grid>
      </form>
    </div>
  );
};

export default SignUp;
