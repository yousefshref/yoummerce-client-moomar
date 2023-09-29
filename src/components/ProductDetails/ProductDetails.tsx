import { EGP } from "../../../pound";

import { TextField, Button } from "@mui/material";
import "swiper/css";
import ImageSlider from "../ImageSlider/ImageSlider";

import { useContext, useState } from "react";
import { UserContextProvider } from "@/Contexts/UserContext";
import { NextSeo } from "next-seo";
import { CartContextProvider } from "@/Contexts/CartContext";
import { AuthContextProvider } from "@/Contexts/AuthContext";
import { server } from "../../../server";
import LoginDialog from "../LoginDialog/LoginDialog";
import Link from "next/link";

const ProductDetails = ({ product }: any) => {
  // const cartContext = useContext(CartContextProvider);
  const userContext = useContext(UserContextProvider);
  // const authContext = useContext(AuthContextProvider);

  const [quantity, setQuanity] = useState<any>(1);

  // handle add to cart
  const [loginDialog, setLoginDialog] = useState<any>(false);

  // const addToCart = async (user: any, product: any, quantity: any) => {
  //   if (!localStorage?.getItem("email") || !authContext?.isUserExist) {
  //     setLoginDialog(true);
  //   } else {
  //     await fetch(`${server}cart/`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         user: user.id,
  //         product: product,
  //         quantity: quantity,
  //       }),
  //     })
  //       .then((e) => e.json())
  //       .then((e) => {
  //         alert(`You've added/changed ${e.product_info.title} to your cart`);
  //         setQuanity(1);
  //         // window.location.reload()
  //       })
  //       .finally(() => cartContext?.getCarts());
  //   }
  // };
  return (
    <>
      <NextSeo
        title={"Yoummerce | " + product?.title}
        description={product?.description}
      />
      <h1 className="text-center text-3xl mb-2 text-neutral-700 shadow-xl">
        {product?.title}
      </h1>
      <div className="shadow-xl from-slate-300 bg-gradient-to-br">
        <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
          <div
            style={{ maxWidth: "300px", maxHeight: "300px" }}
            className="overflow-hidden"
          >
            <ImageSlider obj={product} />
            {/* <img src="/1.jpg" /> */}
          </div>
          <div className="my-auto" style={{ maxWidth: "500px" }}>
            <div className="flex flex-wrap gap-2">
              <h2 className="font-medium text-lg">{product?.title}</h2>
              {product?.stock < 5 ? (
                <p className="my-auto text-red-600">
                  {product?.stock} in stock
                </p>
              ) : null}
            </div>
            <p className="w-auto">{product?.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-10 mt-5 bg-slate-200 p-3 rounded-xl">
          <div className="flex gap-2 my-auto">
            <strong className="text-green-600">
              {product?.sell_price} {EGP}
            </strong>
            {product?.before_disc ? (
              <p>
                instead of {product?.before_disc} {EGP}
              </p>
            ) : null}
          </div>
          {userContext?.user?.is_staff && (
            <div className="flex gap-2 my-auto">
              <strong>commission:</strong>
              <p>
                {product?.commission} {EGP}
              </p>
            </div>
          )}
          <div className="flex flex-col gap-2 mt-3">
            <TextField
              type="number"
              label="Add To Your Cart"
              fullWidth
              variant="outlined"
              value={quantity}
              onChange={(e: any) => setQuanity(e.target.value)}
            />
            <div className="flex flex-col gap-3">
              {/* <Button
                onClick={() =>
                  addToCart(userContext.user, product.id, quantity)
                }
                fullWidth
                className="bg-slate-500"
                variant="contained"
              >
                أضف للعربة
              </Button> */}
              <Link
                href={{
                  pathname: "/create_order",
                  query: {
                    id: product?.id,
                    quantity: quantity,
                    s: product?.stock,
                  },
                }}
              >
                <Button
                  // className="bg-green-600"
                  fullWidth
                  variant="contained"
                  color="success"
                >
                  أشتري الأن
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {loginDialog ? <LoginDialog setLoginDialog={setLoginDialog} /> : null}
    </>
  );
};

export default ProductDetails;
