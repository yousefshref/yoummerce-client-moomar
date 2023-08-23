"use client";

import { ProductsContextProvider } from "@/Contexts/ProductsContext";
import { useContext, useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import ProductCard from "@/components/Products/ProductCard/ProductCard";
import { NextSeo, WebPageJsonLd } from "next-seo";
import { DefaultSeo } from "next-seo";
import { Yoummerce, host } from "../../../server";
import Search from "@/components/Products/Search/Search";
import { CartContextProvider } from "@/Contexts/CartContext";
import { AuthContextProvider } from "@/Contexts/AuthContext";
import { server } from "../../../server";
import LoginDialog from "@/components/LoginDialog/LoginDialog";
import Head from "next/head";
import { Button } from "@mui/material";



// declare global {
//   interface Window {
//     google: any;
//     googleTranslateElementInit: any;
//   }
// }


const page = () => {
  const productContexts = useContext(ProductsContextProvider);

  const cartContext = useContext(CartContextProvider);
  const authContext = useContext(AuthContextProvider);

  // add to cart check if login
  const [loginDialog, setLoginDialog] = useState<any>(false);


  const addToCart = async (user: any, product: any, quantity: any, setQuantity:any) => {
    if (!localStorage?.getItem("email") || !authContext?.isUserExist) {
      setLoginDialog(true);
    } else {
      await fetch(`${server}cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user.id,
          product: product,
          quantity: quantity,
        }),
      })
        .then((e) => e.json())
        .then((e) => {
          alert(`You've added/changed ${e.product_info.title} to your cart`);
          setQuantity(1)
        })
        .finally(() => cartContext?.getCarts());
    }
  };

  // pagination
  const goToPage = (page: any) => {
    window.scrollTo(0, 0)
    productContexts?.setCurrentPage(page);
  };
  // pagination


  return (
    <>
      <Head>
        <title>{Yoummerce} | Products</title>
        <meta name="description" content="all categories and all products with offers for all products" />
      </Head>

      <NextSeo
        title="Yoummerce | Products List"
        description="buy anything with great offers with yoummerce"
      />
      <DefaultSeo
        openGraph={{
          type: "website",
          locale: "en_IE",
          url: `${host}`,
          siteName: "Yoummerce",
          images: [
            {
              url: "./logo.png",
              width: 800,
              height: 600,
              alt: "yoummerce website logo",
            },
          ],
        }}
      />
      <WebPageJsonLd
        description={Yoummerce + " | Find the best offers for you favourite products"}
        id={host}
      />

      <Header />
      <Search />
      <hr className="w-[90%] mx-auto" />
      <div className="products_container flex flex-wrap justify-center">
        {productContexts?.products?.map((product: any) => (
          <div key={product.id}>
            <ProductCard addToCart={addToCart} product={product} />
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="justify-center gap-10 flex mb-10 md:w-[70%] w-[90%] p-5 mx-auto">
        {productContexts?.currentPage > 1 && (
          <div>
            <Button
              variant="contained"
              onClick={() => goToPage(productContexts?.currentPage - 1)}
            >
              الصفحة السابقة
            </Button>
          </div>
        )}
        {productContexts?.currentPage < productContexts?.totalPages && (
          <div>
            <Button
              variant="contained"
              onClick={() => goToPage(productContexts?.currentPage + 1)}
            >
              الصفحة التالية
            </Button>
          </div>
        )}
      </div>
      {/* PAGINATION */}
      {
        loginDialog ? (
          <LoginDialog setLoginDialog={setLoginDialog} />
        ):null
      }
    </>
  );
};

export default page;
