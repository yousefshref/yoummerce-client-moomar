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
import OrderPreview from "@/components/Order/OrderPreview";

const page = () => {
  const orderContext = useContext(OrderContextProvider);
  const cartContext = useContext(CartContextProvider);
  const userContext = useContext(UserContextProvider);

  const total_commission = orderContext?.order?.reduce(
    (a: any, v: any) => (a = a + v.total_commission),
    0
  );


  // pagination
  const goToPage = (page: any) => {
    window.scrollTo(0, 0)
    orderContext?.setCurrentPage(page);
  };
  // pagination

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
            {userContext?.user?.is_staff ? (
              <div className="flex flex-wrap gap-3 text-end w-fit ms-auto">
                <h3 className="text-2xl text-end my-auto text-green-700">
                  {" "}
                  [اجمالي عمولتك ({EGP} {total_commission})]
                </h3>
                <h1 className="text-4xl text-end">جميع مشترياتك</h1>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 text-end w-fit ms-auto">
                <h1 className="text-4xl text-end">جميع مشترياتك</h1>
              </div>
            )}
            <hr />
            {orderContext?.order?.map((order: any) => (
              <div key={order.id} className="mt-5">
                <OrderPreview order={order} userContext={userContext} />
              </div>
            ))}
          </div>
        </div>

        {/* PAGINATION */}
        <div className="justify-center gap-10 flex mb-10 md:w-[70%] w-[90%] p-5 mx-auto">
          {orderContext?.currentPage > 1 && (
            <div>
              <Button
                variant="contained"
                onClick={() => goToPage(orderContext?.currentPage - 1)}
              >
                الصفحة السابقة
              </Button>
            </div>
          )}
          {orderContext?.currentPage < orderContext?.totalPages && (
            <div>
              <Button
                variant="contained"
                onClick={() => goToPage(orderContext?.currentPage + 1)}
              >
                الصفحة التالية
              </Button>
            </div>
          )}
      </div>
      {/* PAGINATION */}
      </div>
    </>
  );
};

export default page;
