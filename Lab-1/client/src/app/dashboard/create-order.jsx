import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createOrderValidation } from "../helper/validations";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const products = [
  { id: 1, name: "Product A", price: 100, quantity: 1 },
  { id: 2, name: "Product B", price: 200, quantity: 2 },
  { id: 3, name: "Product C", price: 150, quantity: 1 },
];

const OrderForm = () => {
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState(products);

  const handleQuantityChange = (id, type) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === "increase"
                  ? item.quantity + 1
                  : Math.max(0, item.quantity - 1),
            }
          : item
      )
    );
  };

  return (
    <div
      className="p-4 bg-gray-200 w-full"
      style={{
        height: "calc(100vh - 80px)",
        maxHeight: "calc(100vh - 80px)",
      }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-[650px]">
        <h2 className="text-2xl font-bold text-center mb-4">
          Create new order
        </h2>

        <Formik
          initialValues={{ orderName: "" }}
          validationSchema={createOrderValidation}
          onSubmit={(values, { setSubmitting }) => {
            navigate(-1);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, isValid }) => (
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

              <div className="mt-4">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b py-2"
                  >
                    <span>{item.name}</span>
                    <span className="text-gray-700 font-medium">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-gray-700">{item.quantity}</span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="bg-blue-500 text-white p-2 rounded-full"
                        onClick={() =>
                          handleQuantityChange(item.id, "increase")
                        }
                      >
                        <FaPlus />
                      </button>
                      <button
                        type="button"
                        className="bg-red-500 text-white p-2 rounded-full"
                        onClick={() =>
                          handleQuantityChange(item.id, "decrease")
                        }
                      >
                        <FaMinus />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={`px-4 py-2 rounded text-white ${
                    isValid && !isSubmitting
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Submit
                </button>

                <button
                  onClick={() => navigate(-1)}
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default OrderForm;
