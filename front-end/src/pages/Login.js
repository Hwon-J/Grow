import React from 'react';
import { TextField, Button, Grid } from '@mui/material';

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 처리 로직
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid spacing={2} justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField label="Email" fullWidth variant="outlined" margin="normal" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField label="Password" fullWidth type="password" variant="outlined" margin="normal" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            로그인
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default Login;
