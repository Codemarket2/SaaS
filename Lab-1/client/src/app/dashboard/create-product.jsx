import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { formValidation } from "../helper/validations";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/reducers/productSlice";
import { useNavigate } from "react-router-dom";

const ProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    price: "",
    sku: "",
    category: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    dispatch(addProduct(values));
    resetForm();
    navigate(-1);
  };

  return (
    <div
      className="p-5 bg-gray-300"
      style={{
        height: "calc(100vh - 80px)",
        maxHeight: "calc(100vh - 80px)",
      }}
    >
      <div className="bg-white shadow-lg rounded-lg p-6 w-80">
        <h2 className="text-xl font-semibold mb-4">Create new Product</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={formValidation}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  type="text"
                  name="name"
                  placeholder="Enter product name *"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Product Price */}
              <div>
                <Field
                  type="number"
                  name="price"
                  placeholder="Enter product price *"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <Field
                  type="text"
                  name="sku"
                  placeholder="SKU"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="sku"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <Field
                  as="select"
                  name="category"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Category *</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="grocery">Grocery</option>
                </Field>
                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    navigate(-1);
                  }}
                  type="reset"
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
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

export default ProductForm;
