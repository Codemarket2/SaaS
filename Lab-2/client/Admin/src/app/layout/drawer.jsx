import React from "react";
import { useNavigate } from "react-router-dom";

import { SidebarList } from "../constants/sidebar-options";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducers/authSlice";

const Drawer = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="sm:w-full md:w-[210px] md:max-w-[210px] h-screen bg-gray-800">
      <div>
        <div className="h-[70px] w-full bg-white flex justify-center items-center gap-x-1 cursor-pointer"></div>
        <div>
          {SidebarList?.map((sidebarOption, i) => {
            return (
              <div
                onClick={() => {
                  if (sidebarOption.title === "Logout") {
                    const userConfirmed = window.confirm(
                      `Are you sure you want to logout ?`
                    );
                    if (userConfirmed) {
                      dispatch(logout());
                    }
                  } else {
                    navigation(sidebarOption.pathname);
                  }
                }}
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
