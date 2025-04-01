/**
 * Login screen
 * @format
 */

import { Formik } from "formik";
import React, { useRef, useState } from "react";
import { signIn, signUp, confirmSignUp } from "@aws-amplify/auth";

import {
  loginValidationSchema,
  signupValidationSchema,
  verifyOtpValidation,
} from "../helper/validations";
import Input from "../components/input";
import Button from "../components/button";
import EyeIcon from "../assets/icons/eye.png";
import EyeOff from "../assets/icons/eye-off.png";
import { useNavigate } from "react-router";
import { login } from "../redux/reducers/authSlice";
import { useDispatch } from "react-redux";
import Modal from "../components/modal";
import Label from "../components/label";

const Login = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const formikRef = useRef(null);
  const [isSecure, setIsSecure] = useState(true);
  const [isSecureNew, setIsSecureNew] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("signin");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    try {
      if (selectedMethod === "signup") {
        const res = await signUp({
          username: values.email,
          password: values.password,
          options: {
            userAttributes: {
              email: values.email,
            },
            authFlowType: "USER_PASSWORD_AUTH",
          },
        });
        setIsModalOpen(true);
      } else {
        const res = await signIn({
          username: values.email,
          password: values.password,
          options: {
            userAttributes: {
              email: values.email,
            },
            authFlowType: "USER_PASSWORD_AUTH",
          },
        });
      }
    } catch (error) {}
    navigate("/home"); // Redirect to home after login
  };

  const handleEmailVerify = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      const res = await confirmSignUp(
        formikRef.current?.values?.email,
        values?.otp
      );
      dispatch(login());
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  let initialvalues =
    selectedMethod === "signin"
      ? {
          email: "sonika@apprido.com",
          password: "Sonika@1",
          confirmPassword: "Sonika@1",
        }
      : {
          email: "sonika@apprido.com",
          password: "Sonika@1",
        };

  return (
    <div className="flex justify-center items-start pt-4 min-h-screen bg-gray-100">
      <Formik
        innerRef={formikRef}
        initialValues={initialvalues}
        validationSchema={
          selectedMethod === "signup"
            ? signupValidationSchema
            : loginValidationSchema
        }
        onSubmit={handleLogin}
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
            <div
              className={`${
                selectedMethod === "signup" ? "h-[420px]" : "h-[380px]"
              } bg-white p-8 rounded-sm shadow-md w-96 border-[1px] border-[#BABEC2] mt-5`}
            >
              <div className="flex flex-row">
                <h2
                  onClick={() => setSelectedMethod("signin")}
                  className="text-lg font-semibold mb-6 text-center w-1/2"
                >
                  Sign In
                </h2>
                <h2
                  onClick={() => setSelectedMethod("signup")}
                  className="text-lg font-semibold mb-6 text-center w-1/2"
                >
                  Create Account
                </h2>
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={values?.email}
                  containerClass={`!mb-6`}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                  error={errors?.email && touched.email ? errors?.email : ""}
                />
              </div>
              <div>
                <Input
                  type={isSecure ? "password" : "text"}
                  placeholder="Enter password"
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
              {selectedMethod === "signup" && (
                <div>
                  <Input
                    type={isSecureNew ? "password" : "text"}
                    placeholder="Enter password again"
                    value={values?.confirmPassword}
                    containerClass={`!mb-6`}
                    error={
                      errors?.confirmPassword && touched.confirmPassword
                        ? errors?.confirmPassword
                        : ""
                    }
                    onChange={(e) =>
                      setFieldValue("confirmPassword", e.target.value)
                    }
                    rightIcon={
                      <img
                        src={isSecureNew ? EyeIcon : EyeOff}
                        onClick={() => setIsSecureNew(!isSecureNew)}
                        className="h-5 max-h-5"
                      />
                    }
                  />
                </div>
              )}
              <Button
                onClick={() => handleSubmit()}
                type="submit"
                buttonclassName={`flex w-full mb-8`}
                isLoading={isSubmitting}
              >
                {selectedMethod === "signup" ? "Sign Up" : "Sign in"}
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
      <Modal isOpen={isModalOpen}>
        <Formik
          initialValues={{ otp: "" }}
          validationSchema={verifyOtpValidation}
          onSubmit={handleEmailVerify}
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
              <div className=" flex flex-col  bg-white px-[26px] py-[34px]  ">
                <Label
                  variant="2xl"
                  weight="bold"
                  label={"Verify Email"}
                  className="mb-9 text-center !font-poppins"
                />
                <Label
                  variant="xl"
                  label={`Otp has been sent to your email "${formikRef.current?.values?.email}"`}
                  className="mb-9 text-center !font-poppins"
                />

                <div>
                  <Input
                    type="text"
                    placeholder="Otp"
                    value={values?.otp}
                    containerClass={`!mb-[14px]`}
                    onChange={(e) => setFieldValue("otp", e.target.value)}
                    error={errors?.otp && touched.otp ? errors?.otp : ""}
                  />
                </div>

                <Button
                  onClick={() => handleSubmit()}
                  type="submit"
                  isLoading={isSubmitting}
                  buttonclassName={"hover:border-[#294890] !font-poppins"}
                >
                  {"Verify"}
                </Button>
                <div className=" flex justify-end text-[#3d3d3d] mt-4 font-openSans">
                  {timer <= 0 && userId ? (
                    <div onClick={resendCode}>
                      <Label
                        variant="base"
                        label={loading ? "Sending Otp..." : "Resend Otp"}
                        className="text-[#294890] !font-poppins"
                      />
                    </div>
                  ) : (
                    `Resend otp in 00:${timer < 10 ? "0" : ""}${timer}`
                  )}
                </div>
              </div>
            );
          }}
        </Formik>
      </Modal>
    </div>
  );
};

export default Login;
