import {REGISTER_USER} from '../types/types';

const initialState = {
  id: 0,
  name: "",
  email: "",
  accessToken: "",
  refreshToken: "",
}

const userReducer = (state=initialState, action) => {
  if (action.type === REGISTER_USER) {
      return {...state, register: action.payload}
  } else{
    console.log(state)
    return state; 
  }
}
export default userReducer
