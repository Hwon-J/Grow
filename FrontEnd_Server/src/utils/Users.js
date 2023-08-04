import axios from "axios";

export const checkToken = async () => {
  const persistedCurrentUser = localStorage.getItem('persist:currentUser');
  const parsedCurrentUser = JSON.parse(persistedCurrentUser);
  const token = JSON.parse(parsedCurrentUser.token);
  console.log('Token:', token);


  
  const config = {
    headers: {
      Authorization: token,
    },
  };
  try {
    const response = await axios.post(
      `http://i9c103.p.ssafy.io:30001/api/user/valid`,"", config
    );
    console.log(response)
    if (response.status !== 200) {
      localStorage.removeItem('persist:currentUser');
      console.log('LocalStorage data removed.');
    } 
    
  } catch (error) {
    console.log(error);
  }
};