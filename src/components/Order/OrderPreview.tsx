"use client";

import { Button } from "@mui/material";
import ImageSlider from "../ImageSlider/ImageSlider";
import axios from "axios";
import { server } from "../../../server";
import { EGP } from "../../../pound";

const OrderPreview = ({ order, userContext }: any) => {
  // cancel order
  const cancelOrder = async (id: any) => {
    console.log(id);
    await axios
      .post(`${server}cancel_order/?order_id=${id}`, {
        is_arrived: 10,
      })
      .then(function (response) {
        alert(response.data.success);
        window?.location.reload();
        // console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // cancel order
  return (
    <>
      <div>
        {/* cancel order */}
        <div className="flex justify-between w-fit ms-auto mb-2">
          {order?.is_arrived == 4 ? (
            <Button
              onClick={() => {
                cancelOrder(order?.id);
              }}
              variant="contained"
              color="warning"
              className="bg-orange-500"
            >
              الغي الطلب
            </Button>
          ) : null}
        </div>
        {/* cancel order */}
        <div className="text-end">{order?.order_item_info?.length} :عدد المنتجات</div>
        <div className="order flex justify-center gap-5 md:justify-between border p-1 rounded-md my-4 shadow-xl">
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
            {order.phone2 == "phone2" ||
            order.phone2 == "" ||
            order.phone2 == 0 ? null : (
              <div>
                <strong>{order.phone2}</strong>
              </div>
            )}
            <hr />
            <div className="flex gap-1">
              <strong className="text-red-700 text-xs my-auto">
                (اجمالي الاوردر)
              </strong>
              <strong>{order.total_order}</strong>
            </div>
            {userContext?.user?.is_staff && (
              <div className="flex gap-1">
                <strong className="text-red-700 text-xs my-auto">
                  (العمولة)
                </strong>
                <strong>{order.total_commission}</strong>
              </div>
            )}
            <div className="flex gap-3">
              <strong className="text-red-700 text-xs my-auto">(الحالة)</strong>
              <strong>{order.is_arrived_name}</strong>
            </div>
            <div className="flex gap-3">
              <strong className="text-red-700 text-xs my-auto">
                (التاريخ)
              </strong>
              <strong>{order.date}</strong>
            </div>
            <hr />
            {order.note ? (
              <div className="text-red-700">
                <strong>{" :ملاحظة"}</strong>
                <br />
                <strong>{order.note}</strong>
              </div>
            ) : null}
          </div>
          <div className="order_details w-[330px] h-[400px] overflow-y-scroll">
            {order?.order_item_info?.map((order_item: any) =>
              order_item?.is_returned == true ? null : (
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
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPreview;
