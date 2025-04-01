/**
 * CreateOrder screen
 */

import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";

import { createOrderValidation } from "../helper/validations";
import { showError, showSuccess } from "../helper/toast";
import { httpRequest } from "../helper/http-service";
import { endpoints } from "../helper/endpoints";

const OrderForm = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await httpRequest.get(endpoints.products);
      // if (res.status === 200) {
      setProducts(
        res?.length > 0
          ? res?.map((prod) => {
              return {
                ...prod,
                quantity: 0,
              };
            })
          : []
      );
      // }
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleQuantityChange = (id, type) => {
    setProducts((prev) =>
      prev.map((item) => {
        return item._id === id
          ? {
              ...item,
              quantity:
                type === "increase"
                  ? item.quantity + 1
                  : Math.max(0, item.quantity - 1),
            }
          : item;
      })
    );
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      setSubmitting(true);
      const filteredProducts = products
        ?.filter((prod) => prod?.quantity > 0) // Filter products with quantity > 0
        ?.map((prod) => ({
          // Transform each filtered product
          productId: prod?._id,
          price: prod?.price,
          quantity: prod?.quantity,
        }));
      const { totalPrice, totalQuantity } = filteredProducts.reduce(
        (totals, prod) => {
          return {
            totalPrice: totals.totalPrice + prod.price * prod.quantity,
            totalQuantity: totals.totalQuantity + prod.quantity,
          };
        },
        { totalPrice: 0, totalQuantity: 0 } // Initial values
      );
      if (totalQuantity === 0) {
        setSubmitting(false);
        return showError({ message: "Please select at least one product" });
      }
      let data = {
        orderName: values?.orderName,
        orderTotalPrice: totalPrice,
        orderTotalQuantity: totalQuantity,
        orderProducts: filteredProducts,
      };
      const res = await httpRequest.post(endpoints.createOrder, data);
      if (res?._id) {
        showSuccess("Order created successfully.");
        resetForm();
        navigate(-1);
      }
    } catch (error) {
      showError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="p-4 bg-gray-200 w-full  "
      style={{
        height: "calc(100vh - 80px)",
        maxHeight: "calc(100vh - 80px)",
      }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full ">
        <h2 className="text-2xl font-bold  mb-4">Create new order</h2>

        <Formik
          initialValues={{ orderName: "" }}
          validationSchema={createOrderValidation}
          onSubmit={handleSubmit}
        >
          {({ values, errors, isSubmitting, isValid, setFieldValue }) => {
            return (
              <Form>
                <label className="block text-gray-700 font-medium mb-2">
                  Enter order name *
                </label>
                <Field
                  type="text"
                  name="orderName"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="orderName"
                  component="div"
                  className="text-red-500 text-sm"
                />
                <div className="mt-4 overflow-scroll overflow-y-auto h-[320px]">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <ClipLoader color="#1447e6" loading={true} size={30} />
                    </div>
                  ) : products?.length === 0 ? (
                    <div className="flex items-center justify-center">
                      No Products Found.
                    </div>
                  ) : (
                    products?.map((item) => (
                      <div
                        key={item?._id}
                        className="grid grid-cols-5 border-b py-2 "
                      >
                        <span className="grid col-span-2">{item?.name}</span>
                        <span className="flex  text-gray-700 font-medium">
                          ${item?.price.toFixed(2)}
                        </span>
                        <span className="flex justify-center text-gray-700">
                          {item.quantity}
                        </span>
                        <div className="flex space-x-2 justify-end ">
                          <button
                            type="button"
                            className="bg-blue-500 text-white p-2 rounded-full"
                            onClick={() =>
                              handleQuantityChange(item._id, "increase")
                            }
                          >
                            <FaPlus />
                          </button>
                          <button
                            type="button"
                            className="bg-red-500 text-white p-2 rounded-full"
                            onClick={() =>
                              handleQuantityChange(item._id, "decrease")
                            }
                          >
                            <FaMinus />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {
                  <div
                    className={`flex justify-between mt-4 ${
                      products?.length === 0 && "justify-end"
                    }`}
                  >
                    {products?.length > 0 && (
                      <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className={`px-4 py-2 rounded text-white ${
                          isValid && !isSubmitting
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                }
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default OrderForm;
