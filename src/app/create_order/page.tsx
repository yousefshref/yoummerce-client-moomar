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

import { useSearchParams } from "next/navigation";

const CreateOrderOne = (context: any) => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const quantity = searchParams.get("quantity");

  const [states, setStates] = useState([]);
  

  const [name, setname] = useState("");
  const [address, setaddress] = useState("");
  const [phone, setphone] = useState<any>();
  const [state, setState] = useState<any>({});
  const [note, setnote] = useState("");
  const [stateShipping, setStateShipping] = useState<any>();

  const userContext = useContext(UserContextProvider);

  const cartContext = useContext(CartContextProvider);

  const prodcutContex = useContext(ProductsContextProvider);

  const orderContext = useContext(OrderContextProvider);

  const route = useRouter();

  const createOrder = async () => {
    if (name && address && phone?.length == 11 && state) {
      await fetch(`${server}create_order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user:
            !userContext?.user?.id || !localStorage?.getItem("email")
              ? 4
              : userContext?.user?.id,
          name: name,
          address: address,
          note: note,
          phone: phone,
          state: state,
        }),
      })
        .then((e) => e.json())
        .then(async (e) => {
          if (e.id) {
            await fetch(`${server}create_order_item/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                order_item: e?.id,
                product: id,
                quantity: quantity,
              }),
            }).then((e) => {
              if (e.ok) {
                e.json().then((e: any) => {
                  if (e.id) {
                    alert(
                      "Congratulations, you've successfully create your order, be waiting us"
                    );
                    prodcutContex?.getProducts();
                    route.push("/");
                    cartContext?.getCarts();
                    orderContext?.getOrders();
                  }
                });
              } else {
                alert(
                  "you are choosing quantity more than the stocks, please decrease it"
                );
              }
            });
          }
        });
    } else {
      alert("Check the fields");
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
      <div className="create_order px-10 mt-10">
        <h1 className="text-4xl text-center">أطلب منتجاتك بخطوات بسيطة</h1>
        <hr />
        <form
          onSubmit={createOrder}
          className="md:w-[70%] mx-auto w-full from-gray-200 bg-gradient-to-t p-4 rounded-lg shadow-2xl"
        >
          <div className="mt-5 w-full">
            <select
              className="w-[100%]"
              onChange={(e: any) => {
                setState(e.target.value[0]);
                setStateShipping(e.target.value.split(",").pop());
              }}
            >
              <option value={""}>{"أختر المحافظة"}</option>
              {states.map((e: any) => (
                <option key={e.id} value={[e.id, e.shipping]}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <TextField
              fullWidth
              id="standard-basic"
              label="الأسم"
              variant="standard"
              onChange={(e) => setname(e.target.value)}
            />
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
              label="الملاحظات (اختياري)"
              variant="standard"
              multiline
              rows={4}
              onChange={(e) => setnote(e.target.value)}
            />
          </div>

          <Button
            onClick={() => phone?.length == 11 ? createOrder() : alert('رقم الهاتف يجب ان يكون 11 رقم')}
            className="bg-green-500 mt-5"
            style={{ marginTop: "10px" }}
            color="success"
            variant="contained"
          >
            أطلب
          </Button>
        </form>
      </div>
      <div className="finish md:w-[70%] mx-auto w-full mt-10">
        <div>
          {stateShipping ? (
            <div className="flex flex-col gap-5">
              <strong>سعر الشحن: {stateShipping} </strong>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default CreateOrderOne;
