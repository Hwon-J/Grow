import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../features/userSlice'
import "./Login.css"
const Login = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({
      name: name,
      email: email,
      password: password,
    }));
    // dispatch(login({
    //   name: name,
    //   email: email,
    //   password: password,
    //   loggedIn: true,
    // }));
  };

  return (
    <div className="login">
      <form className="login__form" onSubmit={(e) => handleLogin(e)}>
        <h1>Login Here 😆</h1>
        <input 
        type="name" 
        placeholder="Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)}/>
        <input 
        type="email" 
        placeholder="Email" 
        value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input 
        type="password" 
        placeholder="password" 
        value={password}  
        onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit" className="submit__btn">Submit</button>
      </form>
    </div>
  )
}

export default Login
