import * as Yup from "yup";
export const formValidation = Yup.object({
  name: Yup.string()
    .required("Product name is required")
    .min(3, "Product name must be at least 3 characters"),
  price: Yup.number()
    .required("Product price is required")
    .positive("Price must be a positive number"),
  sku: Yup.string()
    .required("SKU is required")
    .matches(/^[a-zA-Z0-9]+$/, "SKU must be alphanumeric"),
  category: Yup.string().required("Category is required"),
});

export const createOrderValidation = Yup.object().shape({
  orderName: Yup.string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("Order name is required"),
});
