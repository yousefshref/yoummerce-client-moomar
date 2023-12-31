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
import { exit } from "process";

const page = () => {
  const [states, setStates] = useState([]);

  const [name, setname] = useState("");
  const [address, setaddress] = useState("");
  const [phone, setphone] = useState<any>();
  const [phone2, setphone2] = useState<any>();
  const [state, setState] = useState<any>();
  const [note, setnote] = useState("");
  const [stateShipping, setStateShipping] = useState<any>();

  const [successMessage, setSuccessMessage] = useState<any>(false);

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
                    setSuccessMessage(true)
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


  useEffect(() => {
    successMessage == true ? alert("😊 تم الطلب بنجاح , يرجي الانتظار قريبا") : null
  }, [successMessage])


  const [isfree, setisfree] = useState(false)

  useEffect(() => {
    for (var i = 0; i < cartContext?.carts?.length; i++) {
      if (cartContext?.carts[i]?.product_info?.free_shipping) {
        setisfree(true)
        break
      } else {
        setisfree(false)
      }
    }
  }, [cartContext?.carts?.length])

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
            <div className="mt-5 w-full border border-neutral-600 p-1">
              <select
                className="w-[100%] text-end"
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
                <input
                placeholder="الاسم"
                className="text-end p-2 w-full border border-neutral-700"
                  id="standard-basic"
                  onChange={(e) => setname(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <input
                placeholder="العنوان"
                className="text-end p-2 w-full border border-neutral-700"
                  id="standard-basic"
                  onChange={(e) => setaddress(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <input
                placeholder="رقم الهاتف"
                className="text-end p-2 w-full border border-neutral-700"
                  onChange={(e) => setphone(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <input
                placeholder="رقم الهاتف الاحتياطي (اختياري)"
                className="text-end p-2 w-full border border-neutral-700"
                  onChange={(e) => setphone2(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <input
                placeholder="الملاحظات"
                className="text-end p-2 w-full border border-neutral-700"
                  onChange={(e) => setnote(e.target.value)}
                />
              </div>

              <div className="w-fit ms-auto">
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
              </div>
            </form>
          </div>
          <div className="finish md:w-[70%] mx-auto w-full mt-10">
            <div className="w-fit mx-auto">
              {
                stateShipping && !isfree ? (
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
                ) : stateShipping && isfree && (
                  <div className="flex flex-col gap-5">
                  <strong>الشحن مجاني</strong>
                  <strong>
                      الاجمالي:{" "}
                      {cartContext?.carts.reduce(
                        (a: any, v: any) => (a = a + v.total_price),
                        0
                      )}
                    </strong>
                </div>
                )
              }
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default page;

// GET THE SHIPPING PRICE AND THE TOTAL AND CREATE ORDER ITEMS
