import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  msg: "",
  user:"",
  token: "",
  loading: false,
  error:""
}

export const signUpUser = createAsyncThunk('signUpUser', async(body)=> {
const res = await fetch("http://localhost:5000", {
  method: "post",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
})
return await res.json();
})

export const loginUser = createAsyncThunk('loginUser', async(body)=> {
  const res = await fetch("http://localhost:5000", {
    method: "post",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  return await res.json();
  })


export const userSlice = createSlice({
  name: "user", 
  initialState: {
    msg: "",
    user:null,
    token: "",
    loading: false,
    error:""
  },
  reducers: {
    addToken: (state, action)=> {
      state.token = localStorage.getItem("token")
    },
    addUser: (state, action)=> {
      state.user = localStorage.getItem("user")
    },

    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = ""
      localStorage.clear();
    },
  },
  extraReducers: {
    [loginUser.pending]: (state, action) => {
      state.loading = true
    },
    [loginUser.fulfilled]: (state, {payload:{error,msg, token, user}}) => {
      state.loading = false;
      if(error){
        state.error = error;
      } else {
        state.msg = msg;
        state.token = token;
        state.user = user;

        localStorage.setItem("msg", msg)
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("token", token)
      }
    },
    [loginUser.rejected]: (state, action) => {
      state.loading = true
    },
    ///////////////
    [signUpUser.pending]: (state, action) => {
      state.loading = true
    },
    [signUpUser.fulfilled]: (state, {payload:{error,msg}}) => {
      state.loading = false;
      if(error){
        state.error = error
      } else {
        state.msg = msg
      }
    },
    [signUpUser.rejected]: (state, action) => {
      state.loading = true
    },
  }
});

export const {login, logout, addToken, addUser} = userSlice.actions;

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;