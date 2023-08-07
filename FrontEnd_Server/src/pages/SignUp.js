import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUserAction } from "../reducers/userSlice";
import NavTop from "../components/NavTop";
import "./Login.scss";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/Urls";
import { logoutUser } from "../reducers/userSlice";
import { Link } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";
import { Container } from "react-bootstrap";
const SignUp = () => {
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
    if (e.target.value === confirmPassword) {
      setConfirmMessage("비밀번호가 일치합니다");
    } else {
      setConfirmMessage("비밀번호가 일치하지 않습니다");
    }
  };
  const onChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    // console.log(password, confirmPassword)
    // console.log(e.target.value)
    if (password === e.target.value) {
      setConfirmMessage("비밀번호가 일치합니다");
    } else {
      setConfirmMessage("비밀번호가 일치하지 않습니다");
    }
  };

  //회원가입시
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userid.length < 6) {
      return alert("아이디는 6글자 이상으로 입력해주세요")
    }
    if (password !== confirmPassword) {
      // 비밀번호 다르면 실패
      return alert("입력한 비밀번호가 다릅니다!");
    }
    // Add additional conditions here to check the validity of the registration information
    if (username.length < 3 || username.length > 10) {
      return alert("이름은 3자 이상, 10자 이하로 입력해주세요");
    }

    if (!email.includes("@") || !email.includes(".")) {
      return alert("유효한 이메일 주소를 입력해주세요");
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!password.match(passwordRegex)) {
      return alert(
        "비밀번호는 8자 이상이면서 숫자와 영어와 특수문자를 모두 포함해야 합니다."
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
      console.log(action.payload.code);
      const signup_status = action.payload.code;
      if (signup_status === 201) {
        alert("회원가입 성공! 로그인 페이지로 이동합니다.");
        navigate("/login");
      } else {
        alert("이미 중복된 아이디이므로 다른 아이디로 가입해주세요.");
        setUserid("");
      }
    });
  };

  // registerUserAction을 부르고 body변수를 props로 전달

  const idChecking = async () => {
    if (userid.length < 6) {
      return alert("아이디는 6글자 이상으로 입력해주세요")
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/api/user/id-check/${userid}`
      );
      console.log(response.data.message);
      setCheckId(response.data.message);
      return;
    } catch (error) {
      console.log(error);
      setCheckId(error.message);
    }
  };

  return (
    <>
      <NavTop />
      <Container className="auth-container">
        <MDBRow className="auth-row">
          <MDBCol sm="5" className="auth-col-left d-none d-sm-block px-0">
            <img
              src="/static/media/logo.c128bdb58a80345fd3d8.png"
              alt="Home"
              style={{ width: "50px" }}
            />
          </MDBCol>
          <MDBCol sm="7" className="auth-col-right">
            <form onSubmit={handleSubmit}>
              <div className="d-flex flex-row ">
                <img
                  src="/static/media/logo.c128bdb58a80345fd3d8.png"
                  alt="Home"
                  style={{ width: "50px" }}
                />
              </div>
              <div className="d-flex flex-column justify-content-center w-75 pt-4 mt-3">
                <h3
                  className="fw-normal mb-3 ps-5 pb-3"
                  style={{ letterSpacing: "1px" }}
                >
                  Sign Up
                </h3>

                <div className="d-flex form-outline mb-4 mx-5 w-100">
                  <MDBInput
                    className="flex-grow-1 me-2 form-outline" // Use className instead of wrapperClass
                    placeholder="ID"
                    type="text"
                    size="lg"
                    value={userid}
                    onChange={onChangeUserid}
                  />
                  <button
                    type="button"
                    className="form-outline check-btn"
                    style={{ flex: "0 0 40%" }}
                    onClick={idChecking}
                  >
                    중복확인
                  </button>
                </div>
                <p
                  className={`ms-5 ${
                    checkId !== "사용할 수 있는 아이디입니다"
                      ? "text-danger"
                      : ""
                  }`}
                >
                  {checkId}
                </p>
                <MDBInput
                  wrapperClass="mb-4 mx-5 w-100"
                  placeholder="이름"
                  id="formControlLg"
                  type="text"
                  size="lg"
                  value={username}
                  onChange={onChangeName}
                />
                <MDBInput
                  wrapperClass="mb-4 mx-5 w-100"
                  placeholder="Email"
                  id="formControlLg"
                  type="email"
                  size="lg"
                  value={email}
                  onChange={onChangeEmail}
                />
                <MDBInput
                  wrapperClass="mb-4 mx-5 w-100"
                  placeholder="password"
                  id="formControlLg"
                  type="password"
                  size="lg"
                  value={password}
                  onChange={onChangePassword}
                />
                <MDBInput
                  wrapperClass="mb-1 mx-5 w-100"
                  placeholder="confirmPassword"
                  id="formControlLg"
                  type="password"
                  size="lg"
                  value={confirmPassword}
                  onChange={onChangeConfirmPassword}
                />
                <p
                  className={`ms-5 ${
                    confirmMessage !== "비밀번호가 일치합니다"
                      ? "text-danger"
                      : ""
                  }`}
                >
                  {confirmMessage}
                </p>
                <button className="mb-4 px-5 mx-5 w-100 auth-btn">
                  SingUp
                </button>
                <p className="ms-5">
                  Do you have an account?{" "}
                  <Link to="/login" className="link-info">
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </Container>
    </>
  );
};

export default SignUp;
