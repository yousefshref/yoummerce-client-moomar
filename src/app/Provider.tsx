"use client"
import { GoogleOAuthProvider } from '@react-oauth/google';

const Provider = (props:any) => {
  return (
    <GoogleOAuthProvider clientId="793588415733-vd5cjv6nfuthcv1mgeo8aqmdm09h2on9.apps.googleusercontent.com">
        {props.children}
    </GoogleOAuthProvider>
  )
}

export default Provider