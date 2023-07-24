import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { signUpUser } from '../features/userSlice'

const SignUp = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")

  const dispatch = useDispatch();

  const handleSignUp = (e) => {
    e.preventDefault();
    console.log(name, email, password, password2)
    if (password === password2) {
      dispatch(signUpUser({
        name: name,
        email: email,
        password: password,
        password2: password2,
      }));
    } else {
      alert("비밀번호를 동일하게 작성하시오")
      setName("")
      setEmail("")
      setPassword("")
      setPassword2("")
    }
  };

  return (
    <div className="login">
      <form className="login__form" onSubmit={(e) => handleSignUp(e)}>
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
        <input 
        type="password" 
        placeholder="password2" 
        value={password2}  
        onChange={(e) => setPassword2(e.target.value)}/>
        <button type="submit" className="submit__btn">Submit</button>
      </form>
    </div>
  )
}
export default SignUp