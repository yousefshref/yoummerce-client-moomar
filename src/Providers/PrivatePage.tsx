"use client";


import { useEffect } from "react";

import { useRouter } from "next/navigation";


const PrivatePage = ({ children }: any) => {
  const route = useRouter();

  useEffect(() => {
    !localStorage.getItem('email') ? route.push('/login') : null;
  });

  return children;
};

export default PrivatePage;
