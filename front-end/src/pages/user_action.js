import axios from 'axios';
import {REGISTER_USER} from './types';

export function registerUser(dataToSubmit) {
  console.log(dataToSubmit);
  const request = axios.post('/api/users/register', dataToSubmit).then(response => response.data)
  
  return {
    type: REGISTER_USER,
    payload: request
  }
}