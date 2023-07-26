import { configureStore } from '@reduxjs/toolkit';
import userSlice, { reducer as currentUser } from '../reducers/userSlice'; // userSlice.js에서 reducer를 명시적으로 가져옴

export default configureStore({
  reducer: {
    currentUser: currentUser,
  }
});
