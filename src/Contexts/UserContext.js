'use client'

import {createContext, useEffect, useState} from 'react'
import { server } from '../../server'

const ProductsContext = (props) => {

    const [user, setUser] = useState([])

    const getUser = async () => {
      const response = await fetch(`${server}users/?email=${localStorage?.getItem('email')}`)
      const data = response.json()

      data.then((e) => {
        setUser(e)
      })
      
    }

    useEffect(() => {
      localStorage?.getItem('email') ? getUser() : null;
    }, [])

    return (
      <UserContextProvider.Provider value={{user}}>
          {props.children}
      </UserContextProvider.Provider>
  )
}


export default ProductsContext
export const UserContextProvider = createContext()
