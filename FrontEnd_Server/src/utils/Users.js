import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from "./Urls.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser } from "../reducers/userSlice";
import { useLocation } from 'react-router';
import Swal from "sweetalert2";

export const Islogin = () => {
  const persistedCurrentUser = localStorage.getItem('persist:currentUser');
  const parsedCurrentUser = JSON.parse(persistedCurrentUser);
  const token = JSON.parse(parsedCurrentUser.token);
  console.log("IsLogin 확인")
  if (parsedCurrentUser) {
    return token;
  } 
  return false;
}

const CheckToken = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [previousPath, setPreviousPath] = useState(null);
  useEffect(() => {
    if (previousPath !== location.pathname) {
      setPreviousPath(location.pathname);
    }
  }, [location.pathname, previousPath]);
  const checkToken = async () => {
    const checkLogin = Islogin(); 
    if (!checkLogin) {
      if ((location.pathname === "/profile" && previousPath !== "/login") ||
      location.pathname === "/plantinfo" ||
      location.pathname.startsWith("/diary")) {
        Swal.fire({
          icon: "warning",
          title: "경고",
          text: `로그인 후 해당 서비스로 접근 해주세요`,
          showCancelButton: false,
          confirmButtonText: "확인",
        }).then((res) => {
          if (res.isConfirmed) {
            return window.location.href = "/login";
          }
        });
      }
      return
    }
    const config = {
      headers: {
        Authorization: checkLogin,
      },
    };

    try {
      const response = await axios.get(
        `${BASE_URL}/api/user/valid`, config
      );
      console.log("response", response);
    } catch (error) {
      
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
