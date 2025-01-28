import React from "react";
import { useLocation } from "react-router-dom";

import Drawer from "./drawer";

const Layout = ({ children }) => {
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
