import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUserAction } from "../reducers/userSlice";
import style from "./LoginPage.module.scss";
import NavTop from "../components/NavTop";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { reSwal } from "../utils/reSwal";
const LoginPage = () => {
  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const onChangeId = (e) => {
    setId(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let body = {
      // 해당 폼으로 dispatch전달할 예정
      id: id,
      pw: password,
    };

    // 로그인 유효값 검사 영문, 숫자, 기호
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!password.match(passwordRegex)) {
      return reSwal("warning",
        "비밀번호는 8자 이상이면서 숫자와 영어와 특수문자를 모두 포함해야 합니다."
      );
    }

    // 로그인 액션 부르기 body데이터 넣어서
    dispatch(loginUserAction(body))
      .then((action) => {
        const authToken = action.payload.token; // 토큰이 올떄
        const loginerror = action.payload.message; // 에러메세지가 올떄
        
        if (authToken) { // 토큰이 오면 로그인 되어서 profile페이지로 이동
          navigate("/profile");
          return
        }
        if (loginerror) {  // 에러메세지가 있으면 메세지 나오는 경고창
          reSwal("warning",loginerror)
        }
      })
      .catch((error) => {
        console.log("Registration failed:", error);
      });
  };

  return (
    <div className={style.login_total}>
      <NavTop />
      <div className={style.loginbox}>
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <div className={style.userbox} style={{ marginBottom: "40px" }}>
            <input
              className={style.first}
              type="text"
              name=""
              required=""
              onChange={onChangeId}
            />
            <label>ID</label>
          </div>
          <div className={style.userbox} style={{ marginBottom: "20px" }}>
            <input
              className={style.second}
              type="password"
              name=""
              required=""
              onChange={onChangePassword}
            />
            <label>Password</label>
          </div>
          <a className="text-muted" href="#!">
            Forgot password?
          </a>
          <div className={style.loginbtnWrapper}>
            <button className={style.loginbtn}>Login</button>
          </div>
          <p style={{ marginTop: "30px" }}>
            Don't have an account?{" "}
            <Link to="/signup" className="link-info">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
