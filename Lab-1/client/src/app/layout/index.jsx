import React from "react";
import Drawer from "./drawer";
import Header from "./header";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  return (
    <div className="flex h-full w-full">
      <Drawer />
      <div className="h-screen w-full relative overflow-hidden">
        {children}
        <div className="w-full h-[80px] bg-gray-100 flex items-center pl-4 absolute bottom-0 left-0">
          <p>Serverless SaaS Workshop &copy; 2022 AWS</p>
        </div>
      </div>
    </div>
  );
};

export default Layout;
