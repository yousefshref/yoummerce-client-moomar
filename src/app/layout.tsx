// import HeaderContext from "@/Contexts/HeaderContext";
import ProductsContext from "@/Contexts/ProductsContext";
import UserContext from "@/Contexts/UserContext";
import CartContext from "@/Contexts/CartContext";

import Provider from "./Provider";
import "./globals.css";
import type { Metadata } from "next";
import Head from "next/head";
import AuthContext from "@/Contexts/AuthContext";
import OrderContext from "@/Contexts/OrderContext";

export const metadata: Metadata = {
  title: "Car accessories",
  description:
    "Yoummerce - E-commerce system that helps you to manage your business",
  icons: "/logo.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        <body>
        <Provider>
          <AuthContext>
            <ProductsContext>
              <UserContext>
                <CartContext>
                  <OrderContext>
                    {children}
                  </OrderContext>
                </CartContext>
              </UserContext>
            </ProductsContext>
          </AuthContext>
        </Provider>
        </body>
      </html>
    </>
  );
}
