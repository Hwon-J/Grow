import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./Urls.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logoutUser } from "../reducers/userSlice";
import { useLocation } from "react-router";
import Swal from "sweetalert2";
import { reSwal } from "./reSwal.js";
// 로그인 되어있는지 persist:currentUser에서 확인
export const Islogin = () => {
  const persistedCurrentUser = localStorage.getItem("persist:currentUser");
  const parsedCurrentUser = JSON.parse(persistedCurrentUser) ? JSON.parse(persistedCurrentUser) :"";
  const token = JSON.parse(parsedCurrentUser.token) ? JSON.parse(parsedCurrentUser.token) : "";
  console.log("IsLogin 확인");
  if (parsedCurrentUser) {      // 로그인 되어있으면 토큰 return
    return token;
  }
  return false;
};

// 유효한 토큰인지 확인하는 함수
const CheckToken = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [previousPath, setPreviousPath] = useState(null);  // 이전페이지 확인용 변수
  // 다른페이지 이동시마다 이전페이지 pathname저장
  useEffect(() => {
    if (previousPath !== location.pathname) {
      setPreviousPath(location.pathname);
    }
  }, [location.pathname, previousPath]);

  // 토큰 유효성 검사 함수
  const checkToken = async () => { // 비동기 처리
      // /home 경로에서는 아무 동작도 하지 않음
    if (location.pathname === "/home" || location.pathname === "/home/") {
      return;
    }
    const checkLogin = Islogin();  // 로그인 되어있는지 확인 token ? false
    console.log(checkLogin, "로그인 확인")
    if (!checkLogin) {            // 로그인 되어있지 않을때
      if (      // 로그인을 제외한 다른페이지에서 프로필로 갈때, plantinfo, diary페이지라면 
        (location.pathname === "/profile" && previousPath !== "/login") ||
        location.pathname === "/plantinfo" ||
        location.pathname.startsWith("/diary")
      ) {
        // 경고창 내보내고 
        Swal.fire({     
          icon: "warning",
          title: "경고",
          text: `로그인 후 해당 서비스로 접근 해주세요`,
          showCancelButton: false,
          confirmButtonText: "확인",
        // 확인을 누르면 login페이지로 이동
        }).then((res) => {
          if (res.isConfirmed) {
            return (window.location.href = "/login");
          }
        });
      }
      return;
    }
    // 로그인 되어있을떄 처리 시작
    const config = {
      headers: {
        Authorization: checkLogin,
      },
    };
    // 로그인 되어있으니까 토큰 유효성 검사 
    try {
      const response = await axios.get(`${BASE_URL}/api/user/valid`, config);
      // 유효하다면 그냥 넘어가고
    } catch (error) {
      reSwal("error", "토큰이 만료되었습니다 다시 로그인 해주세요")
      // 에러이면 useSlice의 로그아웃 액션 실행
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
