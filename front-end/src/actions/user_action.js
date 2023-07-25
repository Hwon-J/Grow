import axios from "axios";
import { REGISTER_USER , LOGIN_USER} from "../types/types";

export function registerUser(dataToSubmit) {
  console.log(dataToSubmit);
  const request = axios
    .post("/api/users/signup", dataToSubmit)
    .then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function loginUserAction(dataToSubmit) {
  const request = axios
    .post("/api/users/login", dataToSubmit)
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request,
  }
}