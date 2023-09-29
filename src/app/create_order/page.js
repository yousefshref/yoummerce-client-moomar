"use client";

import { CartContextProvider } from "@/Contexts/CartContext";
import { OrderContextProvider } from "@/Contexts/OrderContext";
import { ProductsContextProvider } from "@/Contexts/ProductsContext";
import { UserContextProvider } from "@/Contexts/UserContext";
import { Button, TextField, styled } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { server } from "../../../server";
import { EGP } from "../../../pound";
import axios from "axios";

import { useSearchParams } from "next/navigation";

const page = (context  ) => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const quantity = searchParams.get("quantity");
  const price = searchParams.get("price");
  const stock = searchParams.get("s");
  const free_shipping = searchParams.get("free_shipping");

  const [states, setStates] = useState([]);

  const [name, setname] = useState("");
  const [address, setaddress] = useState("");
  const [phone, setphone] = useState  ();
  const [phone2, setphone2] = useState  ();
  const [state, setState] = useState  ();
  const [note, setnote] = useState("");
  const [stateShipping, setStateShipping] = useState  ();

  const userContext = useContext(UserContextProvider);

  const cartContext = useContext(CartContextProvider);

  const prodcutContex = useContext(ProductsContextProvider);

  const orderContext = useContext(OrderContextProvider);

  const route = useRouter();

  const [loading, setloading] = useState  (false);


  const createOrder = async () => {
    setloading(true);
    if (Number(stock) - Number(quantity) > 0) {
      await axios
        .post(`${server}create_order/`, {
          user:
            !userContext?.user?.id || !localStorage?.getItem("email")
              ? 4
              : userContext?.user?.id,
          name: name,
          address: address,
          note: note,
          phone: phone,
          phone2: phone2,
          state: state,
        })
        .then(async function (response) {
          if (response.data.id) {
            await axios
              .post(`${server}create_order_item/`, {
                order_item: response.data.id,
                product: id,
                quantity: quantity,
              })
              .then((e) => {
                if (e.statusText == "OK") {
                  setloading(false);
                  alert("😊 تم انشاء طلبك بنجاح, يرجي انتظارنا قريبا");
                  prodcutContex?.getProducts();
                  cartContext?.getCarts();
                  orderContext?.getOrders();
                  route.push("/");
                }
              })
              .catch(function (error) {
                alert("حدث شيئا ما, بالرجاء المحاولة مره اخري");
                console.log(error);
              });
          }
        })
        .catch(function (error) {
          alert("حدث شيئا ما, بالرجاء المحاولة مره اخري");
          console.log(error);
        });
    } else {
      alert("انت تختار كمية اكبر من المتاحة يرجي تعديل الكمية من السلة");
      route.push("cart/");
    }
  };

  

  useEffect(() => {
    const getStates = async () => {
      await fetch(`${server}states/`)
        .then((e) => e.json())
        .then((e) => setStates(e));
    };
    getStates();
  }, [state]);



  return (
    <>
      {loading ? (
        <div className="flex justify-center text-center mt-10">
          <h1>جاري تنفيذ طلبك</h1>
        </div>
      ) : (
        <>
          <div className="create_order px-10 mt-10">
            <h1 className="text-4xl text-center">أطلب منتجاتك بخطوات بسيطة</h1>
            <hr />
            <form
              onSubmit={createOrder}
              className="md:w-[70%] mx-auto w-full from-gray-200 bg-gradient-to-t p-4 rounded-lg shadow-2xl"
            >
              <div>
                <TextField
                  fullWidth
                  id="standard-basic"
                  label="الأسم"
                  variant="standard"
                  onChange={(e) => setname(e.target.value)}
                />
              </div>
              <div className="mt-5 w-full border border-neutral-600 p-1">
                <select
                  className="w-[100%]"
                  onChange={(e  ) => {
                    setState(e.target.value.split(',')[0]);
                    setStateShipping(e.target.value.split(',')[1]);
                  }}
                >
                  <option value={""}>{"أختر المحافظة"}</option>
                  {states.map((e  ) => (
                    <option key={e.id} value={[e.id, e.shipping]}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3">
                <TextField
                  fullWidth
                  id="standard-basic"
                  label="العنوان"
                  variant="standard"
                  onChange={(e) => setaddress(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <TextField
                  fullWidth
                  type="tel"
                  id="standard-basic"
                  label="رقم الهاتف"
                  variant="standard"
                  onChange={(e) => setphone(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <TextField
                  fullWidth
                  type="tel"
                  id="standard-basic"
                  label="رقم الهاتف اخر (اخياري)"
                  variant="standard"
                  onChange={(e) => setphone2(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <TextField
                  fullWidth
                  label="الملاحظات (اختياري)"
                  variant="standard"
                  multiline
                  rows={4}
                  onChange={(e) => setnote(e.target.value)}
                />
              </div>

              <Button
                onClick={() =>
                  phone?.length == 11 &&
                  name.length > 0 &&
                  address.length > 0 &&
                  state
                    ? createOrder()
                    : alert("تحقق من الخانات المطلوبة")
                }
                className="bg-green-500 mt-5"
                style={{ marginTop: "10px" }}
                color="success"
                variant="contained"
              >
                تم
              </Button>
            </form>
          </div>
          <div className="finish md:w-[70%] mx-auto w-full mt-10">
            <div>
              {
                stateShipping && !free_shipping ? (
                  <div>
                    <div className="flex flex-col gap-5">
                      <strong>سعر الشحن: {stateShipping} </strong>
                    </div>
                    <div className="flex gap-1">
                      <strong>
                        {" "}
                        {EGP}{" "}
                        {Number(quantity) * Number(price) + Number(stateShipping)}{" "}
                      </strong>
                      <strong> :الاجمالي بعد الشحن</strong>
                    </div>
                  </div>
                ) : <div>
                <div className="flex flex-col gap-5">
                  <strong>الشحن مجاني 🤑 </strong>
                </div>
                <div className="flex gap-1">
                  <strong>
                    {" "}
                    {EGP}{" "}
                    {Number(quantity) * Number(price)}{" "}
                  </strong>
                  <strong> :الاجمالي</strong>
                </div>
              </div>
              }
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default page;
