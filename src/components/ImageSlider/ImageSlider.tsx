'use client'

import { Swiper, SwiperSlide } from "swiper/react";
import ProductImages from "../ProductCard/ProductImages/ProductImages";
import "swiper/css";


const ImageSlider = ({obj}:any) => {
  // console.log(obj);
  

  return (
    <Swiper navigation autoplay pagination={{clickable: true}} slidesPerView={1}>
      {obj?.images?.map((e: any) => (
        <SwiperSlide key={e.id}>
          <span>
            <ProductImages
              product={obj}
              product_id={obj.id}
              product_title={obj.title}
              e={e}
            />
          </span>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageSlider;
