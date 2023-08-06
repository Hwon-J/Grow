// 김태형
import React, { useState } from "react";
import loginImage from "../assets/0002.png";
import { useDispatch } from "react-redux";
import { loginUserAction } from "../reducers/userSlice";
import NavTop from "../components/NavTop";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./Login.scss";
const Login = () => {
  const dispatch = useDispatch(); // dispatch 사용할 예정
  const navigate = useNavigate();

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

    let body = {
      // 해당 폼으로 dispatch전달할 예정
      id: id,
      pw: password,
    };
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!password.match(passwordRegex)) {
      return alert(
        "비밀번호는 8자 이상이면서 숫자와 영어를 모두 포함해야 합니다."
      );
    }

    dispatch(loginUserAction(body))
      .then((action) => {
        const authToken = action.payload.token; // Assuming the token is stored in the payload

        // Check if authToken exists and navigate to '/login'
        if (authToken) {
          navigate("/profile");
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the registration process
        console.log("Registration failed:", error);
      });
  };

  return (
    <>
      <NavTop />
      <MDBContainer className="auth-container">
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
              <div className="d-flex flex-row">
                <img
                  src="/static/media/logo.c128bdb58a80345fd3d8.png"
                  alt="Home"
                  style={{ width: "50px" }}
                />
              </div>

              <div className="d-flex flex-column justify-content-center h-custom-2 w-75 pt-4 mt-5">
                <h3
                  className="fw-normal mb-3 ps-5 pb-3"
                  style={{ letterSpacing: "1px" }}
                >
                  Log in
                </h3>

                <MDBInput
                  wrapperClass="mb-4 mx-5 w-100"
                  placeholder="ID"
                  id="formControlLg"
                  type="text"
                  size="lg"
                  value={id}
                  onChange={onChangeId}
                />
                <MDBInput
                  wrapperClass="mb-4 mx-5 w-100"
                  placeholder="Password"
                  id="formControlLg"
                  type="password"
                  size="lg"
                  value={password}
                  onChange={onChangePassword}
                />

                <button className="mb-4 px-5 mx-5 w-100 auth-btn">
                  Login
                </button>
                <p className="small mb-5 pb-lg-3 ms-5">
                  <a class="text-muted" href="#!">
                    Forgot password?
                  </a>
                </p>
                <p className="ms-5">
                  Don't have an account?{" "}
                  <Link to="/signup" className="link-info">
                    Register here
                  </Link>
                </p>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default Login;
