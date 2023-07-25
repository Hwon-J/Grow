import {LOGIN_USER} from '../types/types';

const initialState = {
    id: "",
    pw: "",
    // email: "",
    // accessToken: "",
    // refreshToken: "",
};

const loginUserReducer = (state=initialState, action) => {
    if (action.type === LOGIN_USER) {
        return {...state, currentUser: action.payload}
    } else
    console.log(state)
    return state
}

export default loginUserReducer