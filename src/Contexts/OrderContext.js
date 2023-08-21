'use client'

import { useContext, useEffect, useState } from "react"
import { createContext } from "react"
import { server } from "../../server"
import { UserContextProvider } from "./UserContext"

const OrderContext = ({children}) => {

    const userContext = useContext(UserContextProvider)


    const [order, setorder] = useState([])

    const [name, setname] = useState('')
    const [status, setstatus] = useState('')
    const [from, setfrom] = useState('')
    const [to, setto] = useState('')


    const getOrders = async () => {
        await fetch(`${server}orders/${userContext?.user?.id}?name=${name}&status=${status}&from=${from}&to=${to}`)
            .then((e) => e.json())
            .then((e) => setorder(e))
    }
    useEffect(() => {
        userContext?.user?.id ? getOrders() : null
    }, [name, status, from, to, userContext?.user?.id])

  return (
    <OrderContextProvider.Provider value={{order, setname, setstatus, setfrom, setto, getOrders}}>
        {children}
    </OrderContextProvider.Provider>
  )
}

export default OrderContext
export const OrderContextProvider = createContext()
