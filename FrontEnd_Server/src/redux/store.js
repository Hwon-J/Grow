import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // 로컬 스토리지 사용
import { reducer as currentUser } from "../reducers/userSlice"; // userSlice.js에서 reducer를 명시적으로 가져옴

const currentUserPersistConfig = {
  key: "currentUser",
  storage, // 로컬 스토리지 사용
  serialize: (data) => JSON.stringify(data), // 액션 객체를 JSON.stringify를 사용하여 시리얼라이즈
  deserialize: (data) => JSON.parse(data), // JSON 문자열을 파싱하여 액션 객체를 디시리얼라이즈
};

const persistedCurrentUserReducer = persistReducer(
  currentUserPersistConfig,
  currentUser
);

const store = configureStore({
  reducer: {
    currentUser: persistedCurrentUserReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false, // 이 옵션을 사용하여 시리얼라이즈 체크를 비활성화
  }),
});

export const persistor = persistStore(store);

export default store;
