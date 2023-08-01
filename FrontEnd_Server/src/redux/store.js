import { configureStore } from '@reduxjs/toolkit';
import { reducer as currentUser } from '../reducers/userSlice'; // userSlice.js에서 reducer를 명시적으로 가져옴

// store에 currentUser 변수 저장

export default configureStore({
  reducer: {
    currentUser: currentUser,
  }
});
