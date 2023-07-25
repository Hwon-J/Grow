import axios from "axios";
import { REGISTER_USER , LOGIN_USER} from "../types/types";



export function registerUser(dataToSubmit) {
  console.log(dataToSubmit);
  const request = axios
    .post("http://192.168.100.37:3000/api/user/signup", dataToSubmit)
    .then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function loginUserAction(dataToSubmit) {
  const request = axios
    .post("http://192.168.100.37:3000/api/user/login", dataToSubmit)
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request,
  }
}