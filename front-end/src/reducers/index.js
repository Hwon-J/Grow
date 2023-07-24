// src/reducers/index.js
import { combineReducers } from 'redux';
import userReducer from './user_reducers';
import loginUserReducer from './login_reducers';
const rootReducer = combineReducers({
  // 여러 리듀서를 추가할 수 있습니다.
  userReducer, loginUserReducer
});

export default rootReducer;