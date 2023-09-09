'use client'

import { Yoummerce, server } from "../../../server";
import jwt_decode from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";


const LoginDialog = (props:any) => {
  const [login_state, setlogin_state] = useState(true)
  
  
  const [passErr, setPassErr] = useState<any>(false)


  const [username, setusername] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')


    const google_login = async (credential:any) => {

        const token = await jwt_decode<any>(credential)
    
        localStorage.setItem('image',token.picture)
        
    
        const nameWithoutSpaces = token.name.replace(' ', '')
    
        await fetch(`${server}login/`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify({
            username: nameWithoutSpaces,
            email: token.email,
          })
        })
        .then((e) => e.json())
        .then((e) => {
          localStorage.setItem('email', e.email)
          window.location.reload()
        })
    }


    const login = async (ev:any) => {
      ev.preventDefault()
      await fetch(`${server}logincredentials/`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          email:email,
          password:password
        })
      })
      .then((e) => e.json())
      .then((e) => {
        if(e.success){
          alert(e.success)
          localStorage.removeItem('image')
          localStorage.setItem('email', email)
          window.location.reload()
        }
        if(e.faild){
          alert(e.faild)
        }
        if(e.faild_email){
          alert(e.faild_email)
        }
      })
    }

    const register = async (ev:any) => {
      ev.preventDefault()
      await fetch(`${server}register_credentials/`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          username:username,
          email:email,
          password:password
        })
      })
      .then((e) => e.json())
      .then((e) => {
        if(e.success){
          alert('You registerd successfully, now you can do wahtever you want 😄')
          localStorage.removeItem('image')
          localStorage.setItem('email', email)
          window.location.reload()
        }
        if(e.faild_username){
          alert(e.faild_username)
        }
        if(e.faild_email){
          alert(e.faild_email)
        }
        if(e.faild_information){
          alert(e.faild_information)
        }
      })
    }

    // check username
    useEffect(() => {
      password.length < 20 ? setPassErr(true) : setPassErr(false)
    }, [password])
  return (
    <div className="h-full w-full bg-black bg-opacity-60 fixed top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] shadow-2xl z-10">
        <div className="relative w-[90%] text-center top-[40%] translate-y-[-50%] bg-white p-4 md:w-fit mx-auto rounded-md shadow-2xl hover:scale-105 hover:bg-neutral-200 transition">
            <div className="w-fit ms-0 mb-2">
                <Button onClick={() => props?.setLoginDialog(false)} variant="outlined" size="small" color="error">أغلق</Button>
            </div>
            <h1 className="transition text-2xl md:text-5xl text-neutral-700">سجل الدخول في {Yoummerce}</h1>
            <small className="transition text-neutral-700">عند تسجيل الدخول سيكون لك ميزات كثيرة</small>
            <hr />
            {
              login_state ? (
                <div className="login">
              <form onSubmit={login}>
                <div className="mt-5">
                  <TextField onChange={(e) => setemail(e.target.value)} fullWidth label="Email" variant="standard" />
                </div>
                <div className="mt-5">
                  <TextField onChange={(e) => setpassword(e.target.value)} fullWidth label="Password" variant="standard" />
                </div>
                <div className="mt-5">
                  <Button className="bg-blue-400" onClick={login} variant="contained">سجل الدخول</Button>
                </div>
                <div className="mt-5">
                  <p>ليس لديك حساب؟ <span onClick={() => setlogin_state(false)} className="text-sky-700 cursor-pointer">انشئ حساب جديد</span></p>
                </div>
              </form>
            </div>
              ):(
                <div className="login">
              <form>
                <div className="mt-5">
                  <TextField onChange={(e) => setusername(e.target.value)} fullWidth label="Username" variant="standard" />
                </div>
                <div className="mt-5">
                  <TextField onChange={(e) => setemail(e.target.value)} fullWidth label="Email" variant="standard" />
                </div>
                <div className="mt-5">
                  <TextField onChange={(e) => setpassword(e.target.value)} fullWidth label="Password" variant="standard" />
                  {
                    passErr ? (
                    <div>
                      <p className="text-red-700">{'password should be more than 20 chars'}</p>
                    </div>
                    ):null
                  }
                </div>
                <div className="mt-5">
                  <Button className="bg-blue-600" onClick={register} variant="contained">انشئ حساب</Button>
                </div>
                <div className="mt-5">
                  <p>لديك حساب بالفعل؟ <span onClick={() => setlogin_state(true)} className="text-sky-700 cursor-pointer">سجل الدخول</span></p>
                </div>
              </form>
            </div>
              )
            }
            <div className="mt-5">
              <strong>أو سجل مع</strong>
            </div>
            <span className="flex w-fit mx-auto mt-4">
            <GoogleLogin
              onSuccess={(credentialResponse:any) => {
                google_login(credentialResponse.credential)
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </span>
        </div>
    </div>
  )
}

export default LoginDialog