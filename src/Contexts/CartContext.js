'use client'

import { createContext, useContext, useState, useEffect } from 'react'

import { UserContextProvider } from '../Contexts/UserContext'

import { server } from '../../server'

const CartContext = ({ children }) => {
    const [statuses, setstaus] = useState([])
    useEffect(() => {
        const getStatus = async () => {
            await fetch(`${server}status/`)
                .then((e) => e.json())
                .then((e) => setstaus(e))
        }
        getStatus()
    }, [])


    const userContext = useContext(UserContextProvider)
    const [carts, setCarts] = useState([])
    
    const getCarts = async () => {
        await fetch(`${server}cart/${userContext.user.id}`)
            .then((e) => e.json())
            .then((e) => setCarts(e))
    }
    useEffect(() => {
        userContext?.user?.id ? getCarts() : null
    }, [userContext?.user?.id])
    

    // const addToCart = async (user, product, quantity) => {
    //     if (localStorage.getItem('email')){
    //       await fetch(`${server}cart/`,{
    //         method:"POST",
    //         headers:{
    //             "Content-Type":"application/json"
    //         },
    //         body: JSON.stringify({
    //             user:user.id,
    //             product:product,
    //             quantity:quantity
    //         })
    //     })
    //     .then((e) => e.json())
    //     .then((e) => {
    //       alert(`You've added/changed ${e.product_info.title} to your cart`)
    //       // window.location.reload()
    //     })
    //     .finally(() => getCarts())
    //     }else{
    //       return <h1>login requierd</h1>
    //     }
    //   }


    return (
        <CartContextProvider.Provider value={{ carts, statuses, getCarts }}>
            {children}
        </CartContextProvider.Provider>
    )
}

export default CartContext
export const CartContextProvider = createContext()