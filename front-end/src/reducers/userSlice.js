import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://localhost:';

export const registerUserAction = createAsyncThunk(
    "signupUser/registerUser",
    async (userData) => {
        console.log(userData)
      try {
        const response = await axios.post(`${API_URL}/api/register`, userData);
        return response.data;
      } catch (err) {
        throw err;
      }
    }
  );

export const loginUserAction  = createAsyncThunk(
"user/login",
async (loginData) => {
    console.log(loginData)
    try {
    const response = await axios.post(`${API_URL}/api/login`, loginData);
    return response.data;
    } catch (err) {
    throw err;
    }
}
);

const userSlice  = createSlice({
    name: 'user',
    initialState: {
        id: "",
        pw: "",
        name: "",
        email: "",
        email_domain: "",
        register_date: "",
        salt: "",
        token: "",
        status: "idle", // 상태 초기값 추가
        error: null, // 에러 초기값 추가
        isAuth: false, // 인증 상태 초기값 추가
    },
    reducers: {},
    extraReducers: (builder) => {
        // 회원가입 비동기 액션 크리에이터와 연결
        builder.addCase(registerUserAction.pending, (state) => {
        state.status = "loading";
        });
        builder.addCase(registerUserAction.fulfilled, (state, action) => {
        state.status = "success";
        state.isAuth = true;
        state.user = action.payload;
        });
        builder.addCase(registerUserAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        });

        // 로그인 비동기 액션 크리에이터와 연결
        builder.addCase(loginUserAction.pending, (state) => {
        state.status = "loading";
        });
        builder.addCase(loginUserAction.fulfilled, (state, action) => {
        state.status = "success";
        state.isAuth = true;
        state.user = action.payload;
        });
        builder.addCase(loginUserAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        });
    },
});

export const { reducer } = userSlice;
export default userSlice;
