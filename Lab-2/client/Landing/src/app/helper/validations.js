import * as Yup from "yup";
export const formValidation = Yup.object({
  name: Yup.string()
    .required("Product name is required")
    .min(3, "Product name must be at least 3 characters"),
  price: Yup.number()
    .required("Product price is required")
    .positive("Price must be a positive number"),
  sku: Yup.string().trim()
    .required("SKU is required")
  ,
  category: Yup.string().required("Category is required"),
});

export const createOrderValidation = Yup.object().shape({
  orderName: Yup.string()
    .trim()
    .required("Order name is required"),
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
