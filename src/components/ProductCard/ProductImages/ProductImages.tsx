import { server } from "../../../../server";
import { useSwiper } from "swiper/react";
import "swiper/css";

import { BsFillArrowRightCircleFill } from "react-icons/bs";

import Link from "next/link";
import Image from "next/image";

const ProductImages = ({
  e,
  noswip,
  product_id,
  product_title,
  product,
}: any) => {

  const swiper = useSwiper();

  // console.log(product_id);
  
  

  return (
    <>
      <Link
        href={`/${product_title}/${product_id}`}
        style={{ maxWidth: "300px", height: "auto" }}
        className="overflow-hidden"
      >
        <Image
          src={server + e.image}
          alt={e.alt}
          width={300}
          height={300}
        />
      </Link>
      {!noswip ? (
        <div className="flex justify-between absolute top-1/2 w-full">
          <button className="rotate-180" onClick={() => swiper.slidePrev()}>
            <BsFillArrowRightCircleFill />
          </button>
          <button onClick={() => swiper.slideNext()}>
            <BsFillArrowRightCircleFill />
          </button>
        </div>
      ) : null}
    </>
  );
};

export default ProductImages;
