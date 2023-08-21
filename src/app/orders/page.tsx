"use client";

import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { Button, TextField } from "@mui/material";
import Header from "@/components/Header/Header";
import ImageSlider from "@/components/ImageSlider/ImageSlider";

import { useContext } from "react";
import { UserContextProvider } from "@/Contexts/UserContext";
import { OrderContextProvider } from "@/Contexts/OrderContext";
import { CartContextProvider } from "@/Contexts/CartContext";
import { EGP } from "../../../pound";

const page = () => {
  const orderContext = useContext(OrderContextProvider);
  const cartContext = useContext(CartContextProvider);
  const userContext = useContext(UserContextProvider);


  const total_commission = orderContext?.order?.reduce(
    (a: any, v: any) => (a = a + v.total_commission),
    0
  )
  



  return (
    <>
      <div>
        <Header />

        <div className="orders_search gap-5 flex flex-wrap justify-between my-10 px-10">
          <div className="my-auto">
            <TextField
              value={orderContext?.name}
              onChange={(e) => orderContext?.setname(e.target.value)}
              label="Search with name"
              variant="standard"
              fullWidth
            />
          </div>
          <div className="my-auto">
            <select
              className="bg-neutral-200 p-1 rounded-lg shadow-xl"
              onChange={(e: any) => orderContext?.setstatus(e.target.value)}
            >
              <option value={""}>{"select a status"}</option>
              {cartContext?.statuses?.map((status: any) => (
                <option key={status.id} value={status.name}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
          <div className="my-auto flex flex-col gap-2">
            <div>
              <p>From:</p>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={""}
                  onChange={(e: any) =>
                    orderContext?.setfrom(
                      e?.$y && e?.$M && e?.$D
                        ? e?.$y + "-" + (e?.$M + 1) + "-" + e?.$D
                        : ""
                    )
                  }
                />
              </LocalizationProvider>
            </div>
            <div>
              <p>To:</p>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={""}
                  onChange={(e: any) =>
                    orderContext?.setto(
                      e?.$y && e?.$M && e?.$D
                        ? e?.$y + "-" + (e?.$M + 1) + "-" + e?.$D
                        : ""
                    )
                  }
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>

        <div className="orders md:w-[85%] md:mx-auto px-10 mt-10">
          <hr />
          <div className="orders">
            {
              userContext?.user?.is_staff ? (
                <div className="flex flex-wrap gap-3 text-end w-fit ms-auto">
                  <h3 className="text-2xl text-end my-auto"> اجمالي عمولتك ({EGP} {total_commission})</h3>
                  <h1 className="text-4xl text-end">جميع مشترياتك</h1>
                </div>
              ):(
                <div className="flex flex-wrap gap-3 text-end w-fit ms-auto">
                  <h1 className="text-4xl text-end">جميع مشترياتك</h1>
                </div>
              )
            }
            <hr />
            {orderContext?.order?.map((order: any) => (
              <div key={order.id} className="mt-5">
                <strong>الأوردر:</strong>
                <div className="order flex flex-wrap justify-center gap-5 md:justify-between border p-1 rounded-md my-4 shadow-xl">
                  <div className="order_up flex flex-col justify-center">
                    <div>
                      <strong>{order?.name}</strong>
                    </div>
                    <div>
                      <strong>{order.state_name?.name}</strong>
                    </div>
                    <div>
                      <strong>{order.address}</strong>
                    </div>
                    <div>
                      <strong>{order.phone}</strong>
                    </div>
                    <hr />
                    <div className="flex gap-1">
                      <strong>{order.total_order}</strong>
                      <strong className="text-red-700 text-xs my-auto">
                        (اجمالي الاوردر)
                      </strong>
                    </div>
                    {userContext?.user?.is_staff && (
                      <div className="flex gap-1">
                        <strong>{order.total_commission}</strong>
                        <strong className="text-red-700 text-xs my-auto">
                          (العمولة)
                        </strong>
                      </div>
                    )}
                    <div>
                      <strong>{order.is_arrived_name}</strong>
                    </div>
                    <div>
                      <strong>{order.date}</strong>
                    </div>
                  </div>
                  <div className="order_details w-[330px] h-[400px] overflow-y-scroll">
                    {order?.order_item_info?.map((order_item: any) => (
                      <div
                        className="order_detail border p-1 m-1"
                        key={order_item.id}
                      >
                        <div className="product_details">
                          <div>
                            <ImageSlider obj={order_item?.product_info} />
                          </div>
                          <div>
                            <strong>
                              {order_item.product_info?.title.toUpperCase()}
                            </strong>
                          </div>
                        </div>
                        <div className="order_detail_down text-center">
                          <hr />
                          <div>
                            <strong>{"الكمية: "}</strong>
                            <strong>{order_item.quantity}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
