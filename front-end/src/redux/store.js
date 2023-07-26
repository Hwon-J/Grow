import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../reducers/userSlice'; // userSlice.js 파일 경로에 맞게 수정

export default configureStore({
  reducer: {
    currentUser: userSlice,
  }
});
