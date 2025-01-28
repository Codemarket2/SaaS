import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

const Navigation = () => {
  return <RouterProvider router={router} />;
};

export default Navigation;
