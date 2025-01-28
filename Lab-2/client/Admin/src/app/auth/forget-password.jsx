/**
 * Forget Password screen
 * @format
 */

import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import {
  createPasswordValidation,
  forgetPasswordValidationSchema,
  verifyOtpValidation,
} from "../helper/validations";
import Input from "../components/input";
import Button from "../components/button";
import { useNavigate } from "react-router-dom";
import Label from "../components/label";
import Modal from "../components/modal";
import EyeIcon from "../assets/icons/eye.png";
import EyeOff from "../assets/icons/eye-off.png";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const formikRef = useRef(null);
  const [isSecure, setIsSecure] = useState(true);
  const [isSecureNew, setIsSecureNew] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(61);
  let timerRef = useRef(null);

  useEffect(() => {
    startTimer();
    return () => clearTimeout(timerRef.current);
  }, [formikRef?.current?.values?.email && timeLeft]);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef = setTimeout(() => {
      if (timeLeft <= 0) {
        clearTimeout(timerRef);
        return false;
      }
      setTimeLeft(timeLeft - 1);
    }, 1000);
  };

  return (
    <div className="flex w-full h-full justify-center  bg-gray-100">
      <Formik
        innerRef={formikRef} // Attach Formik instance to the ref
        initialValues={{ email: "", password: "" }}
        validationSchema={forgetPasswordValidationSchema}
        onSubmit={() => setIsModalOpen(true)}
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
            <div className="h-[300px] bg-white p-8 rounded-sm shadow-md w-96 border-[1px] border-[#BABEC2] mt-5">
              <h2 className="text-lg font-semibold mb-6 text-center">
                Reset your password
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
              <Button
                onClick={() => handleSubmit()}
                type="submit"
                buttonclassName={`flex w-full mb-8`}
              >
                {isSubmitting ? "Sending code..." : "Send code"}
              </Button>
              <div
                onClick={() => navigate(-1)}
                className="text-center text-[#367B92] "
              >
                {"Back to Sign In"}
              </div>
            </div>
          );
        }}
      </Formik>
      <Modal isOpen={isModalOpen}>
        <Formik
          initialValues={{ otp: "" }}
          validationSchema={verifyOtpValidation}
          onSubmit={() => {
            setIsModalOpen(false);
            setTimeout(() => {
              setIsPasswordModalOpen(true);
            }, 500);
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
              <div className="flex flex-col bg-white rounded-[19px] px-[26px] py-[34px] ">
                <Label
                  variant="2xl"
                  weight="bold"
                  label={"Verify Otp"}
                  className="mb-9 text-center !font-poppins"
                />
                <Label
                  variant="xl"
                  weight="semibold"
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
                  {timeLeft <= 0 && formikRef?.current?.values?.email ? (
                    <div>
                      {/* <div onClick={resendCode}> */}
                      <Label
                        variant="base"
                        // label={loading ? "Sending Otp..." : "Resend Otp"}
                        className="text-[#294890] !font-poppins"
                      />
                    </div>
                  ) : (
                    `Resend otp in 00:${timeLeft < 10 ? "0" : ""}${timeLeft}`
                  )}
                </div>
              </div>
            );
          }}
        </Formik>
      </Modal>
      <Modal isOpen={isPasswordModalOpen}>
        <Formik
          initialValues={{ confirmPassword: "", password: "" }}
          validationSchema={createPasswordValidation}
          onSubmit={() => {
            setIsPasswordModalOpen(false);
            navigate("/login");
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
              <div className="flex flex-col  bg-white rounded-[19px] px-[26px] py-[34px] ">
                <Label
                  variant="2xl"
                  weight="bold"
                  label={"Reset Password"}
                  className="mb-9 text-center !font-poppins"
                />
                <div>
                  <Input
                    type={isSecure ? "password" : "text"}
                    placeholder="Password"
                    value={values?.password}
                    containerClass={`!mb-[14px]`}
                    error={
                      errors?.password && touched.password
                        ? errors?.password
                        : ""
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
                <div>
                  <Input
                    type={isSecureNew ? "password" : "text"}
                    placeholder="Confirm Password"
                    value={values?.confirmPassword}
                    containerClass={`!mb-[14px]`}
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

                <Button
                  onClick={() => handleSubmit()}
                  type="submit"
                  isLoading={isSubmitting}
                  buttonclassName={"hover:border-[#294890] !font-poppins"}
                >
                  {"Create Password"}
                </Button>
              </div>
            );
          }}
        </Formik>
      </Modal>
    </div>
  );
};

export default ForgetPassword;
