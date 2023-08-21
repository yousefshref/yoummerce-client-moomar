'use client'

import {server} from '../../server'
import {createContext, useState, useEffect} from 'react'

const AuthContext = (props) => {

    const [isUserExist, setIsUserExist] = useState(false)

    const getUser = async () => {
      const response = await fetch(`${server}users/?email=${localStorage?.getItem('email')}`)
      const data = response.json()

      data.then((e) => {
        if(e.id){
            setIsUserExist(true)
        }else{
            setIsUserExist(false)
        }
      })
      
    }

    useEffect(() => {
      localStorage?.getItem('email') ? getUser() : null;
    }, [])

    return (
      <AuthContextProvider.Provider value={{isUserExist}}>
          {props.children}
      </AuthContextProvider.Provider>
  )
}


export default AuthContext
export const AuthContextProvider = createContext()
