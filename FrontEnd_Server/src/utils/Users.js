import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "./Urls.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser } from "../reducers/userSlice";

export const Islogin = () => {
  const persistedCurrentUser = localStorage.getItem("persist:currentUser");
  const parsedCurrentUser = JSON.parse(persistedCurrentUser);
  const token = JSON.parse(parsedCurrentUser.token);
  console.log("IsLogin 확인");
  if (parsedCurrentUser) {
    return token;
  }
  return false;
};

const CheckToken = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkToken = async () => {
    const checkLogin = Islogin();
    if (!checkLogin) {
      console.log(checkLogin + "체크로그인");
      return;
    }
    const config = {
      headers: {
        Authorization: checkLogin,
      },
    };

    try {
      const response = await axios.get(`${BASE_URL}/api/user/valid`, config);
      console.log("response", response);
    } catch (error) {
      console.log("에러");
      dispatch(logoutUser());
      console.log(error);
    }
  };

  useEffect(() => {
    // 페이지가 열릴 때 checkToken 함수 실행
    checkToken();
  }, [dispatch, navigate]);

  // 함수 컴포넌트이므로 렌더링할 필요가 없으므로 null 반환
  return null;
};

export default CheckToken;
