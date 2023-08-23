'use client'

import {server} from '../../server'
import {createContext, useState, useEffect} from 'react'

const ProductsContext = (props) => {
  // all products
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [products, setProducts] = useState([])
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // pagination

  const getProducts = async () => {
    await fetch(`${server}products/?page_number=${currentPage}&search=${search}&category=${category}&from=${from}&to=${to}`)
    .then((e) => e.json())
    .then((e) => {
      setProducts(e.results)
      setTotalPages(e.totalPages);
    })
  }
  useEffect(() => {
    getProducts()
  }, [search, category, from, to, currentPage])



  // all catoegories
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      await fetch(`${server}categories/`)
      .then((e) => e.json())
      .then((e) => setCategories(e))
    }
    getCategories()
  }, [])

    return (
      <ProductsContextProvider.Provider value={{products, setSearch, category, setCurrentPage,currentPage,totalPages, setCategory, setFrom, setTo, categories, getProducts}}>
          {props.children}
      </ProductsContextProvider.Provider>
  )
}


export default ProductsContext
export const ProductsContextProvider = createContext()
