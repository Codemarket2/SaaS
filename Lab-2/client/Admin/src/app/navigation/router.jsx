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

const PrivateRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/" replace />
  );
};

const PublicRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
};

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: "/", element: <Welcome /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/login", element: <Login /> },
      { path: "/forget-password", element: <ForgetPassword /> },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/home",
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
