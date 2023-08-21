"use client";

import { useContext, useEffect, useState } from "react";
import { server } from "../../../../../server";
import Header from "@/components/Header/Header";
import ProductDetails from "@/components/ProductDetails/ProductDetails";
import ProductCard from "@/components/Products/ProductCard/ProductCard";
import { AuthContextProvider } from "@/Contexts/AuthContext";
import { CartContextProvider } from "@/Contexts/CartContext";
import LoginDialog from "@/components/LoginDialog/LoginDialog";
import { NextSeo, ProductJsonLd } from "next-seo";
import Head from "next/head";

const page = (context: any) => {
  // single product
  const [product, setProduct] = useState<any>();

  const getProduct = async () => {
    await fetch(`${server}products/${context.params.id}`)
      .then((e) => e.json())
      .then((e) => setProduct(e));
  };

  useEffect(() => {
    getProduct();
  }, [context.params.id]);

  // handle cart for product cart
  const authContext = useContext(AuthContextProvider);
  const cartContext = useContext(CartContextProvider);
  const [loginDialog, setLoginDialog] = useState<any>(false);

  const addToCart = async (
    user: any,
    product: any,
    quantity: any,
    setQuantity: any
  ) => {
    if (!authContext?.isUserExist || !localStorage?.getItem("email")) {
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
          setQuantity(1);
        })
        .finally(() => cartContext?.getCarts());
    }
  };

  return (
    <>
      <Head>
        <title>{product?.title} | Yoummerce</title>
        <meta name="description" content={product?.description} />
      </Head>
      <NextSeo title={product?.title} description={product?.description} />
      <ProductJsonLd
        productName={"Yoummerce | " + product?.title}
        images={product?.images?.map((e: any) => e.image)}
        description={product?.description}
        slogan={product?.title}
        releaseDate={product?.date}
        mpn={product?.id}
      />
      <Header />
      <div className="mt-5 px-10">
        <ProductDetails product={product} />
      </div>

      <hr className="my-10" />

      <div className="related_products">
          <div className="px-10">
            <h1 className="text-3xl">
              منتجات مرتبطة ب{" "}
              <span className="text-red-800">{product?.title}</span>:
            </h1>
            <div className="products flex justify-center flex-wrap">
              {product?.related_products?.map((e: any) => (
                <div key={e.id}>
                  <ProductCard
                    addToCart={addToCart}
                    setLoginDialog={setLoginDialog}
                    product={e}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      {loginDialog ? <LoginDialog setLoginDialog={setLoginDialog} /> : null}

      {/* </PrivatePage> */}
    </>
  );
};

export default page;
