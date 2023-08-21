"use client";

import { TextField, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useContext, useState } from "react";
import { EGP } from "../../../../pound";
import ProductImages from "../../ProductCard/ProductImages/ProductImages";
import { UserContextProvider } from "@/Contexts/UserContext";
import Link from "next/link";
import { AuthContextProvider } from "@/Contexts/AuthContext";

const ProductCard = (props: any) => {
  const userContext = useContext(UserContextProvider);
  const authContext = useContext(AuthContextProvider);

  const [quantity, setQuantity] = useState(1);



  return (
    <>
      {props?.product?.stock ? (
        <>
          <div className="product_card m-5 my-10 p-5 w-[300px] from-slate-200 bg-gradient-to-b rounded-lg shadow-lg transition-all hover:from-slate-400 hover:shadow-2xl">
            <Swiper slidesPerView={1}>
              {props?.product?.images.map((e: any) => (
                <SwiperSlide key={e.id}>
                  <ProductImages
                    product={props?.product}
                    noswip={props.product.images.length == 1 ? true : false}
                    product_title={props.product.title}
                    product_id={props.product.id}
                    e={e}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div>
              <h3
                className="text-3xl font-medium text-neutral-600"
                style={{ maxWidth: "300px" }}
              >
                {props.product?.title}{" "}
                {props.product?.stock < 5 ? (
                  <span className="text-sm text-red-700">
                    ({props.product?.stock} في المخزون)
                  </span>
                ) : null}
              </h3>
              <hr />
              <p className="text-xl flex flex-row-reverse gap-2 font-medium text-green-600">
                {props.product?.sell_price} {EGP}{" "}
                {props.product?.before_disc ? (
                  <span className="text-sm flex flex-row-reverse my-auto">
                    <span>بدلا من{" "}</span>
                    <span>
                      {props.product?.before_disc} {EGP}
                    </span>
                  </span>
                ) : null}
              </p>
              {props.product?.commission && userContext?.user?.is_staff ? (
                <p className="font-medium">
                  العمولة: {props.product?.commission} {EGP}
                </p>
              ) : null}
              <div className="flex flex-col gap-2 mt-3">
                <TextField
                  type="number"
                  value={quantity}
                  onChange={(e: any) => setQuantity(e.target.value)}
                  label="أضف الي السلة"
                  fullWidth
                  variant="outlined"
                />
                {
                  !userContext?.user?.id || !localStorage?.getItem("email") ? null : (
                <Button
                  onClick={() =>
                    props.addToCart(
                      userContext?.user,
                      props?.product?.id,
                      quantity,
                      setQuantity
                    )
                  }
                  fullWidth
                  className="bg-slate-500"
                  variant="contained"
                >
                  أضف الي السلة
                </Button>
                  )
                }
                <Link href={{
                  pathname:'/create_order',
                  query: {
                    id: props?.product?.id,
                    quantity:quantity
                }
                }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  className="bg-green-600"
                >
                  أشتري الأن
                </Button>
                </Link>
              </div>
            </div>
          </div>

        </>
      ) : null}
    </>
  );
};

export default ProductCard;
