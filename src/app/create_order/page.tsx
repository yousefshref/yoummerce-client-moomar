'use client'

import { CartContextProvider } from "@/Contexts/CartContext";
import { OrderContextProvider } from "@/Contexts/OrderContext";
import { ProductsContextProvider } from "@/Contexts/ProductsContext";
import { UserContextProvider } from "@/Contexts/UserContext";
import { Button, TextField, styled } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { server } from "../../../server";
import { EGP } from "../../../pound";

import { useSearchParams } from 'next/navigation'

const CreateOrderOne = (context:any) => {
  const searchParams = useSearchParams()
 
  const search = searchParams.get('id')


  console.log(search);

  
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


  const route = useRouter()


  const createOrder = async () => {
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
        console.log(e)
        console.log(context)
        console.log(e?.id)
        console.log(context?.searchParams?.id)
        console.log(context?.searchParams?.quantity)
        if (e.id) {
          if (name && address && phone && state) {
            await fetch(`${server}create_order_item/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                order_item: e?.id,
                product: context?.searchParams?.id,
                quantity: context?.searchParams?.quantity,
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
          } else {
            alert("Check the fields");
          }
        } else {
          alert("Check the fields");
        }
      });
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
        <h1 className="text-4xl text-center">أطلب الأن !</h1>
        <hr />
        <form
          onSubmit={createOrder}
          className="md:w-[70%] text-center mx-auto w-full from-gray-200 bg-gradient-to-t p-4 rounded-lg shadow-2xl"
        >
          <div className={"mt-5 w-full border border-red-500"}>
            <select
              className="w-[100%] text-end"
              onChange={(e: any) => {
                setState(e.target.value[0]);
                setStateShipping(e.target.value.split(',').pop());
              }}
            >
            <option value={''}>
                {'أختر محافظة'}
            </option>
              {states.map((e: any) => (
                <option key={e.id} value={[e.id, e.shipping]}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <TextField
              inputProps={{min: 0, style: { textAlign: 'end' }}} // the change is here
              placeholder="ألاسم"
              fullWidth
              id="standard-basic"
              variant="standard"
              onChange={(e) => setname(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <TextField
              inputProps={{min: 0, style: { textAlign: 'end' }}} // the change is here
              fullWidth
              placeholder="العنوان"
              id="standard-basic"
              variant="standard"
              onChange={(e) => setaddress(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <TextField
              inputProps={{min: 0, style: { textAlign: 'end' }}} // the change is here
              fullWidth
              placeholder="الهاتف"
              type="number"
              id="standard-basic"
              variant="standard"
              onChange={(e) => setphone(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <TextField
              inputProps={{min: 0, style: { textAlign: 'end' }}} // the change is here
              fullWidth
              placeholder="ملاحظات (أختياري)"
              variant="standard"
              multiline
              rows={4}
              onChange={(e) => setnote(e.target.value)}
            />
          </div>
          <Button
            onClick={createOrder}
            className="bg-green-500 mt-5"
            style={{marginTop:"10px"}}
            color="success"
            variant="contained"
          >
            تم
          </Button>
        </form>
      </div>
      <div className="finish md:w-[70%] mx-auto w-full mt-10">
        <div>
            {stateShipping ? 
            
            <div className="flex flex-row-reverse gap-5">
                <strong>: سعر الشحن</strong>
                <strong>{EGP} {stateShipping}</strong>
            </div>
            
            : null}
        </div>
      </div>
    </>
  )
}

export default CreateOrderOne
