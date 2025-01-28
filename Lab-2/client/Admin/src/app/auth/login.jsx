/**
 * Login screen
 * @format
 */

import { Formik } from "formik";
import React, { useState } from "react";
import { loginValidationSchema } from "../helper/validations";
import Input from "../components/input";
import Button from "../components/button";
import EyeIcon from "../assets/icons/eye.png";
import EyeOff from "../assets/icons/eye-off.png";
import { useNavigate } from "react-router";
import { login } from "../redux/reducers/authSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const [isSecure, setIsSecure] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(login());
    navigate("/home"); // Redirect to home after login
  };

  return (
    <div className="flex justify-center items-start pt-4 min-h-screen bg-gray-100">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginValidationSchema}
        onSubmit={() => {
          handleLogin();
        }}
      >
        {({
          isSubmitting,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => {
          return (
            <div className="h-[380px] bg-white p-8 rounded-sm shadow-md w-96 border-[1px] border-[#BABEC2] mt-5">
              <h2 className="text-lg font-semibold mb-6 text-center">
                Sign In
              </h2>
              <div>
                <Input
                  type="text"
                  placeholder="username"
                  value={values?.email}
                  containerClass={`!mb-6`}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                  error={errors?.email && touched.email ? errors?.email : ""}
                />
              </div>
              <div>
                <Input
                  type={isSecure ? "password" : "text"}
                  placeholder="password"
                  value={values?.password}
                  containerClass={`!mb-6`}
                  error={
                    errors?.password && touched.password ? errors?.password : ""
                  }
                  onChange={(e) => setFieldValue("password", e.target.value)}
                  rightIcon={
                    <img
                      src={isSecure ? EyeIcon : EyeOff}
                      onClick={() => setIsSecure(!isSecure)}
                      className="h-5 max-h-5"
                    />
                  }
                />
              </div>
              <Button
                onClick={() => handleSubmit()}
                type="submit"
                buttonclassName={`flex w-full mb-8`}
              >
                {isSubmitting ? "Signing..." : "Sign in"}
              </Button>
              <div
                onClick={() => navigate(`/forget-password`)}
                className="text-center text-[#367B92] "
              >
                Forgot your password?
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default Login;
