import logo from './logo.svg';
import './App.css';
import LoginForm from './components/LoginForm';
import { useEffect, useState } from 'react';
import TodoList from './components/TodoList';
function App() {
  const [loggedIn,setLoggedIn]=useState(false);
  const [error,setError]=useState(undefined);
  const [userName,setUserName]=useState(undefined);

  const signupHandler=(username,password)=>{
    loginSignUp('https://todo-backend-mayur.herokuapp.com/signup',
            username,
            password);
  }
  const signinHandler=(username,password)=>{
    loginSignUp('https://todo-backend-mayur.herokuapp.com/login',
            username,
            password);
  }
  const loginSignUp=(url,username,password)=>{
    fetch(url,{
      method:"POST",
      body: JSON.stringify({userName:username,password}),
      headers:{
        "Content-Type":"application/json",
      },
      credentials:"include"
    })
    .then((r)=>{
      if(r.ok){
        return {success:true};
      }else{
        return r.json();
      }
    })
    .then((r)=>{
      if(r.success===true){
        return getUserName();
      }else{
        setError(r.err);
      }
    })
  }

  const getUserName=()=>{
    return fetch('https://todo-backend-mayur.herokuapp.com/userinfo',{credentials:"include"})
    .then(r=>{
      if(r.ok){
        return r.json();
      } else {
        setLoggedIn(false);
        setUserName(undefined);
        return {success:false};
      }
    }).then(r=>{
      if(r.success!==false){
        setLoggedIn(true);
        setUserName(r.userName);
      }
    });
  }
  
  const logoutHandler=()=>{
    return fetch('https://todo-backend-mayur.herokuapp.com/logout',{credentials:"include"})
    .then(r=>{
      if(r.ok) {
        setLoggedIn(false);
        setUserName(undefined);
      }
    })
  }

  useEffect(()=>{
    getUserName();
  },[]);

  return (
    <div className="App">
      <h1>Mayur's Todo App</h1>
      {loggedIn?<TodoList username={userName} logoutHandler={logoutHandler}/>:
      <LoginForm
        signinHandler={signinHandler}
        signupHandler={signupHandler}
        error={error}
      />}
    </div>
  );
}

export default App;
