import React from "react";
import { useSelector } from "react-redux";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import Login from "../auth/login";
import ForgetPassword from "../auth/forget-password";
import Welcome from "../auth/welcome";
import SignUp from "../auth/signup";
import NotFound from "../notFound";
import Layout from "../layout";

import Dashboard from "../dashboard/dashboard";
import TanentList from "../dashboard/tanent-list";
import TanentForm from "../dashboard/create-tenent";
import UserList from "../dashboard/user-list";
import UserForm from "../dashboard/user-create";
import SubscriptionPlan from "../dashboard/subscribe-tenent";

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
        path: "/tanent",
        element: <TanentList />,
      },
      {
        path: "/tanent-create",
        element: <TanentForm />,
      },
      {
        path: "/subscription-create",
        element: <SubscriptionPlan />,
      },
      {
        path: "/user",
        element: <UserList />,
      },
      {
        path: "/user-create",
        element: <UserForm />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export { router };
