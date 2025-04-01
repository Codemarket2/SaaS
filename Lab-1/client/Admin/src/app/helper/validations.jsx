/**
 * Validation schemes
 */

import * as Yup from "yup";
const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;
export const passregex = /^(?=.*[0-9])(?=.*[!@#\$%^&*])(?=.{6,})/;

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});
export const signupValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8)
    .matches(
      passregex,
      "Password must contain 1 uppercase, 1 lowercase, 1 special character and 1 number"
    ),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export const forgetPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export const verifyOtpValidation = Yup.object({
  otp: Yup.string()
    .required("otp is required")
    .min(6, "otp must be at least 6 characters"),
});

export const createPasswordValidation = Yup.object({
  password: Yup.string()
    .required("Password is required")
    .min(8)
    .matches(
      passregex,
      "Password must contain 1 uppercase, 1 lowercase, 1 special character and 1 number"
    ),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export const createOrderValidation = Yup.object().shape({
  orderName: Yup.string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("Order name is required"),
});

// Validation schema using Yup
export const createProductValidationSchema = Yup.object({
  name: Yup.string().trim().required("Product name is required"),
  price: Yup.number()
    .required("Product price is required")
    .positive("Price must be a positive number"),
  sku: Yup.string()
    .required("SKU is required")
    .matches(/^[a-zA-Z0-9]+$/, "SKU must be alphanumeric"),
  category: Yup.string().required("Category is required"),
});

export const tanentFormValidationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-8]+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 8 digits")
    .max(15, "Phone number must be at most 15 digits")
    .required(),
  address: Yup.string().nullable().required(), // required by backend
  // plan: Yup.string().required("Plan selection is required"),
});

export const userFormValidationSchema = Yup.object().shape({
  username: Yup.string().trim().required("Name is required"),
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
  tenantId: Yup.string().trim().required("TenantId is required."),
  role: Yup.object()
    .shape({
      id: Yup.string().required("Role is required"),
      name: Yup.string().required("Role is required"),
    })
    .required("Role is required"), // Custom test for null
});
