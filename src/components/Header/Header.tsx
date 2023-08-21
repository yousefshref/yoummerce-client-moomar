"use client";

import { Avatar, TextField } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { useState, useEffect } from "react";
import { UserContextProvider } from "@/Contexts/UserContext";
import { AuthContextProvider } from "@/Contexts/AuthContext";
import LoginDialog from "../LoginDialog/LoginDialog";

declare global {
  interface Window {
    google: any; // 👈️ turn off type checking
    googleTranslateElementInit: any; // 👈️ turn off type checking
  }
}

const Header = (props: any) => {
  var [profile_img, setprofile_img] = useState<any>(null);

  useEffect(() => {
    const getItem = () => localStorage.getItem("image");
    const setValue = (value: any) => localStorage.setItem("image", value);

    // Only access localStorage after the component has been rendered to the client.
    if (typeof window !== "undefined") {
      profile_img = getItem();
      setprofile_img(profile_img);
    }
  }, []);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("image");
    window.location.reload();
  };

  const userContext = React.useContext(UserContextProvider);
  const authContext = React.useContext(AuthContextProvider);

  const [dialog, setdialog] = useState(false);

  const handleLogin = () => {
    setdialog(true);
  };

  // language
  const [lang, setlang] = useState(false);

  const handleLanguage = () => {
    setlang(true);
  };

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };
  useEffect(() => {
    var addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, [lang]);

  return (
    <>
      {lang ? (
        <div className="w-full" id="google_translate_element"></div>
      ) : null}
      <div className="header flex-row-reverse w-[90%] flex-wrap justify-center sm:justify-between lg:w-1/2 mx-auto mt-3 rounded-md flex px-3 bg-neutral-600 shadow-xl text-white">
        <div className="flex flex-row-reverse gap-3 p-3 font-medium flex-wrap justify-center">
          <Link href={"/"}>
            <Image
              alt="Yoummerce logo"
              width={60}
              height={60}
              src={"/logo.png"}
              about="yoummerce system logo image"
            />
          </Link>
          <div className="my-auto flex-row-reverse flex gap-5">
            <Link className="hover:text-neutral-300 transition" href={"/"}>
              المنتجات
            </Link>
            <Link className="hover:text-neutral-300 transition" href={"/cart"}>
              السلة
            </Link>
            <Link
              className="hover:text-neutral-300 transition"
              href={"/orders"}
            >
              المشتريات
            </Link>
          </div>
        </div>
        <div className="flex gap-4 my-auto">
          {props.header && (
            <TextField
              focused
              color="info"
              id="outlined-basic"
              label="Outlined"
              variant="outlined"
            />
          )}
          <span className="cursor-pointer" onClick={handleClick}>
            <Avatar
              aria-expanded={open ? "true" : undefined}
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              className="my-auto"
              alt={userContext?.username?.name}
              src={profile_img}
            />
          </span>
          <div>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <div>
                <MenuItem
                  onClick={() => {
                    handleLanguage();
                    handleClose();
                  }}
                >
                  تغيير اللغة
                </MenuItem>

                {!userContext?.user?.id || !localStorage?.getItem("email") ? (
                  <MenuItem
                    onClick={() => {
                      handleLogin();
                      handleClose();
                    }}
                  >
                    سجل الدخول
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={() => {
                      handleLogout();
                      handleClose();
                    }}
                  >
                    سجل الخروج
                  </MenuItem>
                )}
              </div>
            </Menu>
          </div>
        </div>
        {dialog ? <LoginDialog setLoginDialog={setdialog} /> : null}
      </div>
    </>
  );
};

export default Header;
