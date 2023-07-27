//김태형
import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { TextField, Button, Grid } from "@mui/material";
import { registerUserAction } from "../reducers/userSlice";
import "./signup.css"
const SignUp = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      return alert("입력한 비밀번호가 다릅니다!");
    }
    
    let body = {
      id:username,
      pw:password,
      name:"김태형",
      email:email,
      emailDomain: "하이.com"
    };
    dispatch(registerUserAction(body))
  };

  return (
<div className="bgimg">
    <div className="containerbox ">
      <div className="flexbox-left">
       
      </div>
      <div className="flexbox-right container">
        <h2>회 원 가 입</h2>
        <form onSubmit={handleSubmit}>
          <Grid
            className="input-field"
   
            justifyContent="center"
            alignItems="center"
            
          >
            
            <Grid>
              <TextField
                label="이름"
                fullWidth
                variant="outlined"
                margin="normal"
                value={username}
                onChange={onChangeName}
              />
            </Grid>
            <Grid>
              <TextField
                label="이메일"
                fullWidth
                variant="outlined"
                margin="normal"
                value={email}
                onChange={onChangeEmail}
              />
            </Grid>
            <Grid>
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
            <Grid >
              <TextField
                label="비밀번호"
                fullWidth
                type="password"
                variant="outlined"
                margin="normal"
                value={confirmPassword}
                onChange={onChangeConfirmPassword}
              />
            </Grid>
            <Grid>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                회원가입
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
    </div>
  );
};

export default SignUp;
