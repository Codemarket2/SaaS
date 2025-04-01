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
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  address: Yup.string().nullable(), // Optional field
  plan: Yup.string().required("Plan selection is required"),
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

export const formValidation = Yup.object({
  name: Yup.string()
    .required("Product name is required")
    .min(3, "Product name must be at least 3 characters"),
  price: Yup.number()
    .required("Product price is required")
    .positive("Price must be a positive number"),
  sku: Yup.string().trim().required("SKU is required"),
  category: Yup.object()
    .shape({
      id: Yup.string(),
      name: Yup.string(),
    })
    .required("Category is required"), // Custom test for null
});

export const createOrderValidation = Yup.object().shape({
  orderName: Yup.string().trim().required("Order name is required"),
  // products: Yup.array()
  //   .of(
  //     Yup.object({
  //       quantity: Yup.number().required("Quantity is required").min(0, "Quantity must be 0 or more"),
  //     })
  //   )
  //   .test(
  //     "at-least-one-product",
  //     "At least one product should have a quantity greater than 0",
  //     (products) => {
  //       // Ensure products is an array and has at least one item with quantity > 0
  //       return Array.isArray(products) && products.some((product) => product.quantity > 0);
  //     }
  //   ),
});
