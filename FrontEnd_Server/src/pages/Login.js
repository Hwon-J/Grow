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
// import HomeVideo2 from '../components/HomeVideo2';
// import homevideo2 from '../assets/homevideo2.mp4';



// function HomeBackground () {
//   return (
    
//       <video autoPlay loop muted>
//         <source src={homevideo2} type="video/mp4" />
//       </video>
    
//   )
// }

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
      {/* <Grid container>
        <Grid item xs={5}>
          <div className="login-left"></div>
        </Grid>
        <Grid item xs={7}>
          <div className="login-form">
            <form onSubmit={handleSubmit}>
              <Grid item xs={12}>
                <h1>LOG IN</h1>
              </Grid>

              <Grid item xs={12}>
                <label for="user" className="label">ID</label>
                <input id="user" type="text" className="input" value={id} onChange={onChangeId} />
              </Grid>

              <Grid item xs={12}>
                <label for="pass" className="label">PASSWORD</label>
                <input
                  id="pass"
                  type="password"
                  className="input"
                  data-type="password"
                  value={password}
                  onChange={onChangePassword}
                />
              </Grid>

              <Grid item xs={12}>
                <input type="submit" className="button" value="Log In" />
              </Grid>
            </form>
          </div>
        </Grid>
        
      </Grid> */}



    <div className="bgimg">
      <Grid container>
        <Grid item xs={5}>
          <div className="flexbox-left">
            {/* <HomeBackground /> */}
          </div>
        </Grid>
        <Grid item xs={7}>
          <div className="flexbox-right">
            <h2>Log In</h2>
            <form onSubmit={handleSubmit}>
              <Grid container justifyContent="center" alignItems="center">
                <Grid className='input_box' item xs={12}>
                  <TextField
                    label="ID"
                    fullWidth
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
                    margin="normal"
                    value={password}
                    onChange={onChangePassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  <p>Forgot password?</p>
                  <button type="submit" variant="contained" className="btn-hover color-5">Login</button>
                </Grid>
              </Grid>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
    </>
  );
};

export default Login;
