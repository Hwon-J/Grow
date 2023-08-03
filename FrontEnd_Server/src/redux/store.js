import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 로컬 스토리지 사용
import { reducer as currentUser } from '../reducers/userSlice'; // userSlice.js에서 reducer를 명시적으로 가져옴

const currentUserPersistConfig = {
  key: 'currentUser',
  storage, // 로컬 스토리지 사용
};

const persistedCurrentUserReducer = persistReducer(
  currentUserPersistConfig,
  currentUser
);

const store = configureStore({
  reducer: {
    currentUser: persistedCurrentUserReducer,
  },
});

export const persistor = persistStore(store);

export default store;
