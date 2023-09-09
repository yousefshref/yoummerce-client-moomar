"use client";

import { TextField, Button } from "@mui/material";

import { useState, useEffect, useContext } from "react";

import { server } from "../../../server";

import { CartContextProvider } from "@/Contexts/CartContext";
import { UserContextProvider } from "@/Contexts/UserContext";
import { useRouter } from "next/navigation";
import { AuthContextProvider } from "@/Contexts/AuthContext";
import LoginDialog from "@/components/LoginDialog/LoginDialog";
import { OrderContextProvider } from "@/Contexts/OrderContext";
import { ProductsContextProvider } from "@/Contexts/ProductsContext";
import axios from "axios";

const page = () => {
  const [states, setStates] = useState([]);

  const [name, setname] = useState("");
  const [address, setaddress] = useState("");
  const [phone, setphone] = useState<any>();
  const [phone2, setphone2] = useState<any>();
  const [state, setState] = useState<any>();
  const [note, setnote] = useState("");
  const [stateShipping, setStateShipping] = useState<any>();

  const userContext = useContext(UserContextProvider);

  const cartContext = useContext(CartContextProvider);

  const prodcutContex = useContext(ProductsContextProvider);

  const orderContext = useContext(OrderContextProvider);

  const route = useRouter();

  const [create, setcreate] = useState(true);

  const [loading, setloading] = useState(false);

  const createOrder = async () => {
    setloading(true);
    if (create) {
      await axios
        .post(`${server}create_order/`, {
          user: userContext?.user?.id,
          name: name,
          address: address,
          note: note,
          phone: phone,
          phone2: phone2,
          state: state,
        })
        .then((e: any) => {
          if (e.statusText == "OK") {
            cartContext?.carts?.map(async (order: any) => {
              await axios
                .post(`${server}create_order_item/`, {
                  order_item: e.data.id,
                  product: order.product_info.id,
                  quantity: order.quantity,
                })
                .then(async (e) => {
                  if (e.statusText == "OK") {
                    setloading(true);
                    await axios.delete(
                      `${server}cart/${userContext?.user?.id}/delete_user_carts/`
                    );
                    alert("😊 تم الطلب بنجاح , يرجي الانتظار قريبا");
                    prodcutContex?.getProducts();
                    cartContext?.getCarts();
                    orderContext?.getOrders();
                    route.push("/");
                  }
                })
                .catch((err) => console.log(err));
            });
          }
        })
        .catch((err) => console.log(err));
    } else {
      alert("انت تختار كمية اكبر من المتاح, يرجي تغيير العدد من السلة");
      route.push("cart/");
    }
  };

  useEffect(() => {
    cartContext?.getCarts();
    cartContext?.carts?.map((e: any) => {
      if (e.product_info.stock - e.quantity < 0) {
        setcreate(false);
        console.log('no stock available');
      }
    });
  }, [cartContext?.carts]);

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
              <div className="mt-5 w-full">
                <select
                  className="w-[100%]"
                  onChange={(e: any) => {
                    setState(e.target.value.split(',')[0]);
                    setStateShipping(e.target.value.split(',')[1]);
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
                  inputProps={{
                    min: 0,
                    style: { textAlign: "end" },
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }} // the change is here
                  id="standard-basic"
                  label="رقم الهاتف"
                  variant="standard"
                  onChange={(e) => setphone(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <TextField
                  fullWidth
                  inputProps={{
                    min: 0,
                    style: { textAlign: "end" },
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }} // the change is here
                  id="standard-basic"
                  label="رقم هاتف اخر (اختياري)"
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
              {stateShipping ? (
                <div className="flex flex-col gap-5">
                  <strong>سعر الشحن: {stateShipping} </strong>
                  <strong>
                    اجمالي بعد الشحن:{" "}
                    {cartContext?.carts.reduce(
                      (a: any, v: any) => (a = a + v.total_price),
                      0
                    ) + Number(stateShipping)}
                  </strong>
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default page;

// GET THE SHIPPING PRICE AND THE TOTAL AND CREATE ORDER ITEMS
