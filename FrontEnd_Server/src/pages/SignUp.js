import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Grid, Container } from "@mui/material";
import { registerUserAction } from "../reducers/userSlice";
import NavTop from "../components/NavTop";
import "./Login.scss";
import { useSelector } from "react-redux";
import axios from "axios";

const SignUp = () => {
  // usdDispatch: dispatch를 사용하겠다 선언
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.currentUser);
  const [userid, setUserid] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [checkId, setCheckId] = useState("");
  // username, email, password, confirmPassword 를 비동기로 저장하기 위해 설정
  const onChangeUserid = (e) => {
    setUserid(e.target.value);
  };
  const onChangeName = (e) => {
    setUsername(e.target.value);
  };
  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
    if (password === confirmPassword) {
      setConfirmMessage("비밀번호가 일치합니다")
    } else {
      setConfirmMessage("비밀번호가 일치하지 않습니다")
    }
  };
  const onChangeConfirmPassword = (e) => {
    
    setConfirmPassword(e.target.value);
    // console.log(password, confirmPassword)
    // console.log(e.target.value)
    if (password === e.target.value) {
      setConfirmMessage("비밀번호가 일치합니다")
    } else {
      setConfirmMessage("비밀번호가 일치하지 않습니다")
    }
  };

  //회원가입시
  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      // 비밀번호 다르면 실패
      return alert("입력한 비밀번호가 다릅니다!");
    }
    // Add additional conditions here to check the validity of the registration information
    if (username.length < 3 || username.length > 10) {
      return alert("이름은 3자 이상, 10자 이하로 입력해주세요.");
    }

    if (!email.includes("@") || !email.includes(".")) {
      return alert("유효한 이메일 주소를 입력해주세요.");
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!password.match(passwordRegex)) {
      return alert(
        "비밀번호는 8자 이상이면서 숫자와 영어를 모두 포함해야 합니다."
      );
    }

    const [usernamePart, domainPart] = email.split("@");
    let body = {
      // 해당 폼으로 전달할 예정
      id: userid,
      pw: password,
      name: username,
      email: usernamePart,
      emailDomain: domainPart,
    };
    dispatch(registerUserAction(body)).then((action) => {
      console.log(currentUser);
      console.log(action.payload.code)
      const signup_status = action.payload.code
      if (signup_status === 201) {
        alert('회원가입 성공! 로그인 페이지로 이동합니다.')
        navigate('/login')
      }
      else {
        alert('이미 중복된 아이디이므로 다른 아이디로 가입해주세요.')
        setUserid("")
      }
    });
  };

  // registerUserAction을 부르고 body변수를 props로 전달

  const idChecking = async () => {
    try {
      const response = await axios.get(
        `http://i9c103.p.ssafy.io:30001/api/user/id-check/${userid}`
      );
      console.log(response.data.message);
      setCheckId(response.data.message)
      return 
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      <NavTop />
      <Container className="bgimg">
        <div className="container_box ">
          <div className="flexbox-left"></div>
          <div className="flexbox-right">
            <h2>SignUp</h2>
            <form onSubmit={handleSubmit}>
              <Grid
                className="input-field"
                justifyContent="center"
                alignItems="center"
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={7}>
                    <TextField
                      label={checkId ? checkId : "아이디"}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      value={userid}
                      onChange={onChangeUserid}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <p
                      className="idcheckbtn"
                      variant="contained"
                      color="primary"
                      onClick={idChecking}
                    >
                      중복검사
                    </p>
                  </Grid>
                </Grid>
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
                <Grid item xs={12}>
                  <TextField
                    label={confirmMessage ? confirmMessage : "비밀번호 확인"}
                    fullWidth
                    type="password"
                    variant="outlined"
                    margin="normal"
                    value={confirmPassword}
                    onChange={onChangeConfirmPassword}
                  />
                </Grid>
                <Grid>
                  <button
                    type="submit"
                    variant="contained"
                    className="btn-hover color-5"
                  >
                    SignUp
                  </button>
                </Grid>
              </Grid>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
};

export default SignUp;
