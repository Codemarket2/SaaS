import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
// import { Auth } from "aws-amplify";

import Login from "../auth/login";
import ForgetPassword from "../auth/forget-password";
import Welcome from "../auth/welcome";
import SignUp from "../auth/signup";
import NotFound from "../notFound";
import Layout from "../layout";
import Dashboard from "../dashboard/dashboard";
import ProductForm from "../dashboard/create-product";
import UserForm from "../dashboard/user-create";
import OrderForm from "../dashboard/create-order";
import UserList from "../dashboard/user-list1";
import ProductList from "../dashboard/product";
import OrderList from "../dashboard/order";
import ChooseTenantPlans from "../auth/choose-tenent-plans";

import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { login } from "../redux/reducers/authSlice";
import TenantPayment from "../auth/tenant-payment";
import SuccessTenantPayment from "../auth/success-tenant-payment";

// import TanentForm from "../dashboard/create-tenent";

const PublicRoute = () => {
  return (
    // <Layout>
    <Outlet />
    // </Layout>
  );
};

const AuthStatus = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state?.authSlice?.user);
  const { authStatus, user } = useAuthenticator((context) => [
    context.authStatus,
    context.user,
  ]);

  useEffect(() => {
    if (!data && user && authStatus !== "authenticated") {
      dispatch(login(user));
    }
  }, [data, user]);

  return null;
};

export default AuthStatus;

const ProtectedRoute = () => {
  return (
    <Authenticator hideSignUp>
      {({ signOut, user }) => {
        return (
          <Layout signOut={() => signOut()} user={user}>
            <AuthStatus />
            <Outlet />
          </Layout>
        );
      }}
    </Authenticator>
  );
};

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/",
        element: <Welcome />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/choose-tenent-plans",
        element: <ChooseTenantPlans />,
      },
      {
        path: "/tenant-payment",
        element: <TenantPayment />,
      },
      {
        path: "success-tenant-payment",
        element: <SuccessTenantPayment />,
      },
    ],
  },
  {
    element: <ProtectedRoute />, // Wrap private routes with ProtectedRoute
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/product",
        element: <ProductList />,
      },
      {
        path: "/product-create",
        element: <ProductForm />,
      },
      {
        path: "/order",
        element: <OrderList />,
      },
      {
        path: "/order-create",
        element: <OrderForm />,
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
