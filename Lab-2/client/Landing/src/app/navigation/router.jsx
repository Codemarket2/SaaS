import React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import NotFound from "../notFound";
import Dashboard from "../dashboard/dashboard";
import Product from "../dashboard/product";
import Order from "../dashboard/order";
import Layout from "../layout";
import ProductForm from "../dashboard/create-product";
import OrderForm from "../dashboard/create-order";

const PublicRoute = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/product",
        element: <Product />,
      },
      {
        path: "/product-create",
        element: <ProductForm />,
      },
      {
        path: "/order",
        element: <Order />,
      },
      {
        path: "/order-create",
        element: <OrderForm />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export { router };
