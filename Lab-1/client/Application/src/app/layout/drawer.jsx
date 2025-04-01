import React from "react";
import { SidebarList } from "../constants/sidebar-options";
import ShoppingCartLogo from "../assets/icons/shopping-cart-logo.png";
import { useNavigate } from "react-router-dom";

const Drawer = () => {
  const navigation = useNavigate();
  return (
    <div className="sm:w-full md:w-[210px] md:max-w-[210px] h-screen bg-gray-800">
      <div>
        <div
          onClick={() => navigation("/")}
          className="h-[70px] w-full bg-white flex justify-center items-center gap-x-1 cursor-pointer"
        >
          <img
            src={ShoppingCartLogo}
            alt=""
            className="h-10 max-h-10 w-10 max-w-10"
          />
          <h3 className="w-[50%] text-gray-500 font-extrabold leading-[20px]">
            SaaS Commerce
          </h3>
        </div>
        <div>
          {SidebarList?.map((sidebarOption, i) => {
            return (
              <div
                onClick={() => navigation(sidebarOption.pathname)}
                key={i}
                className="w-full h-[60px] flex items-center gap-x-3 pl-4 cursor-pointer duration-500 hover:bg-gray-600"
              >
                <img src={sidebarOption?.icon} className="h-5 max-h-5" />
                <h1 className="text-white font-semibold tracking-wider">
                  {sidebarOption?.title}
                </h1>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
