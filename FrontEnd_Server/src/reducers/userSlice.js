import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../utils/Urls";

//백앤드 기본 url 설정

// const API_URL = 'http://192.168.100.37:30001';
//action registerUserAction AJAX비동기 요청
// signup에서 submit할떄 import 후 실행하기
export const registerUserAction = createAsyncThunk(
  "signupUser/registerUser",
  async (userData) => {
    console.log(userData);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/signup`,
        userData,
        { withCredentials: false }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
//action loginUserAction AJAX비동기 요청
// login에서 submit할떄 import 후 실행하기
export const loginUserAction = createAsyncThunk(
  "user/login",
  async (loginData) => {
    console.log("로그인요청" + loginData);
    console.log(loginData);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/login`,
        loginData
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
      throw err;
    }
  }
);

// user 정보를 store에 저장하기 위한 함수
// createSlice사용하여 정의
//initialState  : store에 저장할 model폼
const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    email: "",
    emailDomain: "",
    token: "",
    status: "", // 상태 초기값 추가
    error: null, // 에러 초기값 추가
    isAuth: false, // 인증 상태 초기값 추가
  },
  reducers: {
    logoutUser: (state) => {
      // 로그아웃 reducer의 logoutUser액션이 불려졌을때 초기값으로 만들어 주는 코드
      return {
        name: null,
        email: null,
        emailDomain: null,
        token: null,
        status: "",
        error: null,
        isAuth: false,
      };
    },
  },
  // 동기적으로 사용할 action들을 모아놓는 reducers

  extraReducers: (builder) => {
    // 회원가입 비동기 액션 크리에이터와 연결

    // registerUserAction이 실행되었을때 상태값 바꿔주기
    builder.addCase(registerUserAction.pending, (state) => {
      state.status = "loading";
    });
    // registerUserAction이 성공했을때 상태값 바꿔주기
    //받은 데이터 저장
    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      state.status = "success";
      state.isAuth = true;

      console.log(action.payload);
    });
    //registerUserAction이 실패했을때 상태값 바꿔주기
    // 에러메세지 변경
    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      console.log(action);
    });

    // 로그인 비동기 액션 크리에이터와 연결
    //로그인도 위의 signup과 같은 방법으로 연결
    builder.addCase(loginUserAction.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.status = "success";
      state.isAuth = true;
      state.token = action.payload.token; // 응답 데이터에서 JWT 토큰을 저장합니다.
      state.name = action.payload.name; // 응답 데이터에서 JWT 토큰을 저장합니다.
      state.email = action.payload.email; // 응답 데이터에서 JWT 토큰을 저장합니다.
      state.emailDomain = action.payload.emailDomain; // 응답 데이터에서 JWT 토큰을 저장합니다.
    });
    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
      console.log(state.error);
    });
  },
});

export const { reducer, actions } = userSlice;
export const { logoutUser } = actions; // 다른 component에서 logoutUser를 사용하기 위해서 export
export default userSlice;
