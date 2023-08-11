import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUserAction } from "../reducers/userSlice";
import NavTop from "../components/NavTop";
import style from "./SignupPage.module.scss";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/Urls";
import { Link } from "react-router-dom";
import { reSwal } from "../utils/reSwal";

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // id, name, email, password, confirmpassword
  // confirmMessage : 비밀번호 일치 불일치 확인 메세지
  // checkId : id가 사용가능한지 확인
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
    if (e.target.value === confirmPassword) {
      setConfirmMessage("비밀번호가 일치합니다");
    } else {
      setConfirmMessage("비밀번호가 일치하지 않습니다");
    }
  };
  const onChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    if (password === e.target.value) {
      setConfirmMessage("비밀번호가 일치합니다");
    } else {
      setConfirmMessage("비밀번호가 일치하지 않습니다");
    }
  };


  //회원가입시
  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkId !== "사용할 수 있는 아이디입니다") {
      reSwal("warning", `아이디 중복확인을 해주세요`);
      return;
    }
    if (userid.length < 6) {
      reSwal("warning", `아이디는 6글자 이상으로 입력해주세요`);
      return;
    }
    if (password !== confirmPassword) {
      // 비밀번호 다르면 실패
      reSwal("warning", `입력한 비밀번호가 다릅니다!`);
      return;
    }
    // Add additional conditions here to check the validity of the registration information
    if (username.length < 3 || username.length > 10) {
      reSwal("warning", `이름은 3자 이상, 10자 이하로 입력해주세요`);
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      reSwal("warning", "유효한 이메일 주소를 입력해주세요");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!password.match(passwordRegex)) {
      reSwal(
        "warning",
        `비밀번호는 8자 이상이면서 숫자와 영어와 특수문자를 모두 포함해야 합니다`
      );
      return;
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

    // redux 액션(body)값 보내고 실행
    dispatch(registerUserAction(body)).then((action) => {
      const signup_status = action.payload.code;
      if (signup_status === 201) {
        reSwal("success", `회원가입 성공! 로그인 페이지로 이동합니다.`);
        navigate("/login");
      } else {
        reSwal(
          "warning",
          `이미 중복된 아이디이므로 다른 아이디로 가입해주세요.`
        );
        setUserid("");
      }
    });
  };

  // registerUserAction을 부르고 body변수를 props로 전달
  const idChecking = async () => {
    if (userid.length < 6) {
      reSwal("warning", `아이디는 6글자 이상으로 입력해주세요`);
      return;
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/api/user/id-check/${userid}`
      );
      setCheckId(response.data.message);
      return;
    } catch (error) {
      console.log(error);
      setCheckId(error.message);
    }
  };

  return (
    <div className={style.signup_total}>
      <NavTop />
      <div className={style.signupbox}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div
            className={style.userbox}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <input
              className={style.first}
              type="text"
              name=""
              required=""
              onChange={onChangeUserid}
            />
            <label>ID</label>
            <button
              type="button"
              className={style.confirmbtn}
              onClick={idChecking}
            >
              중복확인
            </button>
          </div>
          <p
            className={` ${
              checkId !== "사용할 수 있는 아이디입니다" ? "text-danger" : ""
            }`}
            style={{ marginTop: "-15px" }}
          >
            {checkId}
          </p>
          <div
            className={style.userbox}
            style={{ marginBottom: "30px", marginTop: "40px" }}
          >
            <input
              className={style.first}
              type="text"
              name=""
              required=""
              onChange={onChangeName}
            />
            <label>Username</label>
          </div>
          <div className={style.userbox} style={{ marginBottom: "30px" }}>
            <input
              className={style.first}
              type="email"
              name=""
              required=""
              onChange={onChangeEmail}
            />
            <label>Email</label>
          </div>
          <div className={style.userbox} style={{ marginBottom: "30px" }}>
            <input
              className={style.second}
              type="password"
              name=""
              required=""
              onChange={onChangePassword}
            />
            <label>Password</label>
          </div>
          <div className={style.userbox} style={{ marginBottom: "10px" }}>
            <input
              className={style.second}
              type="password"
              name=""
              required=""
              onChange={onChangeConfirmPassword}
            />
            <label>Password Confirm</label>
          </div>
          <p
            className={` ${
              confirmMessage !== "비밀번호가 일치합니다" ? "text-danger" : ""
            }`}
            style={{ marginTop: "-5px" }}
          >
            {confirmMessage}
          </p>
          <div className={style.signupbtnWrapper}>
            <button className={style.signupbtn}>SignUp</button>
          </div>
          <p>
            Do you have an account?{" "}
            <Link to="/login" className="link-info">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
