"use client";

import { Button } from "@mui/material";
import { CartContextProvider } from "@/Contexts/CartContext";
import CartItem from "@/components/CartItem/CartItem";
import Header from "@/components/Header/Header";
import { useContext } from "react";
import { EGP } from "../../../pound";
import { useRouter } from "next/navigation";
import { UserContextProvider } from "@/Contexts/UserContext";
import type { Metadata } from "next";

const page = () => {
  const cartContext = useContext(CartContextProvider);
  const userContext = useContext(UserContextProvider);

  // if(userContext?.user?.id == 18){
  //   console.log('admin');
  // }
  // else{
  //   console.log('not admin');
  // }

  const router = useRouter();

  if (cartContext?.carts?.length == 0) {
    return (
      <div className="text-center mt-10 flex flex-col gap-2">
        <div className="ms-10">
          <Button
            onClick={() => router.back()}
            className="w-fit"
            variant="outlined"
          >
            Back
          </Button>
        </div>
        <h1 className="text-center mt-10">You don't have any cart</h1>
        <strong>Add products to your cart to see them 😊</strong>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="cart_container mt-10 px-10 mb-10">
        {cartContext.carts.map((cart: any) => (
          <div key={cart.id}>
            <CartItem cart={cart} />
          </div>
        ))}
      </div>
      <hr />
      <div className="create_order px-10 mb-10">
        <h1 className="text-center text-3xl">أطلب الأن 😊</h1>
        <div className="w-[100%] md:w-[70%] mx-auto my-2 p-5 bg-slate-200 rounded-lg shadow-xl flex flex-wrap justify-center gap-16 mt-5">
          <div className="flex gap-3">
            <p>
              {cartContext?.carts.reduce(
                (a: any, v: any) => (a = a + v.total_price),
                0
              )}{" "}
              {EGP}
            </p>
            <strong>:اجمالي الاوردر </strong>
          </div>
          <div className="flex gap-3">
            <p>
              {cartContext?.carts.length}
            </p>
            <strong>:عدد المنتجات </strong>
          </div>
          {userContext?.user?.is_staff && (
            <div className="flex gap-3">
              <p>
                {cartContext?.carts.reduce(
                  (a: any, v: any) => (a = a + v.total_commission),
                  0
                )}{" "}
                {EGP}
              </p>
              <strong>: اجمالي العمولة </strong>
            </div>
          )}
          <div>
            <Button
              onClick={() => router.push("order/")}
              color="success"
              variant="contained"
              className="bg-green-600"
            >
              !أطلب الأن
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
