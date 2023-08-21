'use client'

import { useContext, useState } from "react";

import { TextField, Button } from "@mui/material";

import { EGP } from "../../../pound";
import { UserContextProvider } from "@/Contexts/UserContext";
import ProductImages from "../ProductCard/ProductImages/ProductImages";
import ImageSlider from "../ImageSlider/ImageSlider";
import { server } from "../../../server";
import { AuthContextProvider } from "@/Contexts/AuthContext";
import { CartContextProvider } from "@/Contexts/CartContext";
import LoginDialog from "../LoginDialog/LoginDialog";


const CartItem = (cart: any) => {
    const userContext = useContext(UserContextProvider)
    const authContext = useContext(AuthContextProvider)
    const cartContext = useContext(CartContextProvider)

    const [quantity_change, setquantity_change] = useState(cart?.cart?.quantity)

    const deleteCart = async (id:any) => {
      await fetch(`${server}cart/${id}/delete/`,{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json"
        }
      }
      
      )
      .then((e) => e.json())
      .then((e) => {
        alert(e.Success)
      })
      .then(() => cartContext?.getCarts())
    }

    // add to cart check if login
    const [loginDialog, setLoginDialog] = useState<any>(false);


    const addToCart = async (user: any, product: any) => {
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
            quantity: quantity_change,
          }),
        })
          .then((e) => e.json())
          .then((e) => {
            alert(`You've added/changed ${e.product_info.title} to your cart`);
            setquantity_change(1)
          })
          .finally(() => cartContext?.getCarts());
      }
    };

  return (
    <>
    <div id="delete" className="absolute right-0 px-10  z-10">
      <Button onClick={() => deleteCart(cart?.cart?.id)} color="error" variant="outlined">أغلق</Button>
    </div>

    <div className="cart_item flex flex-col gap-5 bg-neutral-100 p-5 shadow-xl mb-10">
      <div className="flex justify-center sm:justify-start w-full flex-wrap gap-5">
        <div style={{maxWidth:"320px"}}>
          <ImageSlider obj={cart?.cart?.product_info} />
        </div>
        <div className="w-auto my-auto">
          <div>
            <h3 className="font-medium text-2xl">
              {cart?.cart?.product_info?.title}{" "}
              {cart?.cart?.product_info?.stock < 10 ? (
                <span className="text-sm text-red-700 my-auto">
                  {cart?.cart?.product_info?.stock} في المخزون
                </span>
              ) : null}
            </h3>
            <p>{cart?.cart?.product_info?.description}</p>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex justify-center gap-10 flex-wrap">
        <div className="my-auto">
          <strong className="text-green-600">
            {cart?.cart?.total_price} {EGP}
          </strong>
        </div>
        {cart?.cart?.total_commission ? (
          userContext?.user?.is_staff ? (
            <div className="my-auto">
            <strong>
              العمولة:{" "}
              <span className="font-medium">
                {cart?.cart?.total_commission} {EGP}
              </span>
            </strong>
          </div>
          ):null
        ) : null}
        <div className="flex flex-wrap gap-2 justify-center">
          <TextField onChange={(e:any) => setquantity_change(e.target.value)} value={quantity_change} label="Quantity" variant="outlined" />
          <Button onClick={() => addToCart(userContext.user, cart?.cart?.product_info?.id)} variant="outlined">تغيير</Button>
        </div>
      </div>
    </div>
    {
      loginDialog ? <LoginDialog /> : null
    }
    </>
  );
};

export default CartItem;
