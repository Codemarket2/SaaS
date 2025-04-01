/**
 *
 *SideMenu Component
 */

import React, { useEffect, useState } from "react";

import image from "../../assets/logo.png";
import widget from "../../assets/icons/widget.png";
import wallet from "../../assets/icons/wallet.png";
import settings from "../../assets/icons/settings.png";
import logoutIcon from "../../assets/icons/logout.png";
import { useNavigate } from "react-router-dom";
import notificationIcon from "../../assets/icons/notification.png";

import Label from "../label";
import { AiOutlineRight } from "react-icons/ai";
import profileIcon from "../../assets/icons/profile.png";
import { eventEmitter } from "../../helper/utils";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/reducers/authSlice";
// import OneSignal from "react-onesignal";
import { SocketService } from "../../helper/socket-services";

const sideBarOptions = [
  { icon: widget, label: "Home", pathName: "/" },
  { icon: wallet, label: "Manage Team", pathName: "/user-list" },
  { icon: wallet, label: "Messages", pathName: "/chat" },
  { icon: settings, label: "Settings", pathName: "/settings" },
  { icon: logoutIcon, label: "Logout", pathName: "/logout" },
];

const userList = [
  {
    profileIcon: profileIcon,
    name: "stewiedewie",
    time: 0,
    isRead: false,
  },
  {
    profileIcon: profileIcon,
    name: "brian1846",
    time: 6,
    isRead: true,
  },
  {
    profileIcon: profileIcon,
    name: "ohheyyitsherbert",
    time: 12,
    isRead: true,
  },
];

function SideMenu({ className, sidebarOpen }) {
  const [pathname, setPathname] = useState(window.location.pathname);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = eventEmitter.subscribe(
      "routeChange",
      handleRouteChange
    );

    window.addEventListener("popstate", () =>
      handleRouteChange({ path: window.location.pathname })
    );

    return () => {
      unsubscribe();
      window.removeEventListener("popstate", () =>
        handleRouteChange({ path: window.location.pathname })
      );
    };
  }, [navigate]);

  const handleRouteChange = (data) => {
    const checkPpathExists = sideBarOptions.find(
      (option) => option.pathName === data?.path
    );
    if (checkPpathExists) {
      setPathname(data?.path);
      // navigate(data?.path);
    }
  };

  const handleNavigation = (index) => {
    if (index === 0) {
      navigate("/");
      setPathname("/");
    } else if (index === 1) {
      navigate("/user-list");
      setPathname("/user-list");
    } else if (index == 2) {
      navigate("/chat");
      setPathname("/chat");
    } else if (index == 3) {
      navigate("/settings");
      setPathname("/settings");
    } else {
      const userConfirmed = window.confirm(`Are you sure you want to logout ?`);
      if (userConfirmed) {
        SocketService.off("joinConversation");
        dispatch(logout());
        // OneSignal.logout();
      }
    }
  };

  return (
    <div
      className={` bg-sec-800 p-4 text-black h-[60%]  ${
        sidebarOpen ? "!min-w-[16rem]" : "!min-w-[16rem]"
      }`}
    >
      <img alt="" src={image} className="h-[100px]" />
      {sideBarOptions?.map((option, index) => {
        return (
          <div key={index} className="flex flex-row justify-between my-4">
            <div
              onClick={() => handleNavigation(index)}
              className={`flex-row flex justify-between items-center p-2 w-full mr-4  ${
                pathname === option?.pathName
                  ? "bg-[#FF6700]"
                  : "bg-transparent"
              } rounded-lg`}
            >
              <div className="flex-row flex items-center ">
                <img
                  alt=""
                  src={option?.icon}
                  className={`h-[20px]  mr-3 filter invert brightness-0 ${
                    index === 4 ? `!h-[18px]` : ""
                  }`}
                />
                <Label
                  label={option?.label}
                  className={`mb-0 text-white  ${
                    index === 4 ? `!text-orange-400` : ``
                  }`}
                  weight="medium"
                  variant="lg"
                />
              </div>
              {index !== 4 && (
                <AiOutlineRight className="text-white w-[10px] h-[10px]" />
              )}
            </div>
            <div
              className={`flex  w-[3px] bg-[#FF6700] p-2" ${
                pathname === option?.pathName
                  ? "bg-[#FF6700]"
                  : "bg-transparent"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}

export default SideMenu;
