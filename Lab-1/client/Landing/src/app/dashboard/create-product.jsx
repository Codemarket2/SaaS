/**
 * CreateProduct screen
 */

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLocation, useNavigate } from "react-router-dom";

import { showError, showSuccess } from "../helper/toast";
import { formValidation } from "../helper/validations";
import { httpRequest } from "../helper/http-service";
import { endpoints } from "../helper/endpoints";

const ProductForm = () => {
  const navigation = useNavigate();
  const location = useLocation();
  const { product } = location?.state || {};

  const categories = [
    { id: "67aa4f472dc226b3bfe68f8e", name: "Electronics" },
    { id: "67aa4f472dc226b3bfe68f8f", name: "Fashion" },
    { id: "67aa4f472dc226b3bfe68f8g", name: "Grocery" },
  ];

  const initialValues = {
    name: product?.name || "",
    price: product?.price || "",
    sku: product?.sku || "",
    category: product?.category || null,
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    if (product) {
      updateProduct(
        { ...values, shardId: product?.shardId },
        { resetForm, setSubmitting }
      );
    } else {
      createProduct(values, { resetForm, setSubmitting });
    }

    try {
    } catch (error) {
      showError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const createProduct = async (values, { resetForm, setSubmitting }) => {
    setSubmitting(true);
    const res = await httpRequest.post(endpoints.createProduct, values);
    if (res?._id) {
      showSuccess(
        product
          ? "Product updated successfully."
          : "Product created successfully."
      );
      resetForm();
      navigation(-1);
    }
  };
  const updateProduct = async (values, { resetForm, setSubmitting }) => {
    setSubmitting(true);
    const res = await httpRequest.put(
      `${endpoints?.updateProduct}${product?._id}`,
      values
    );
    if (res?._id) {
      showSuccess(
        product
          ? "Product updated successfully."
          : "Product created successfully."
      );
      resetForm();
      navigation(-1);
    }
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
        <h2 className="text-xl font-semibold mb-4">
          {product ? "Update Product" : "Create new Product"}
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={formValidation}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, setFieldValue, values }) => {
            return (
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
                    value={values.category?.id || ""}
                    onChange={(e) => {
                      const selectedCategory =
                        categories?.find((cat) => cat.id === e.target.value) ||
                        null;
                      setFieldValue("category", selectedCategory); // Store the full object
                    }}
                  >
                    <option value="">Category *</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
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
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    type="reset"
                    onClick={() => navigation(-1)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default ProductForm;
