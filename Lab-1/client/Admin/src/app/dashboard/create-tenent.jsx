import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";

import { tanentFormValidationSchema } from "../helper/validations";

const TanentForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    address: "",
  };

  const handleSubmit = (values) => {
    navigate("/subscription-create", { state: values });
  };

  return (
    <div className="p-5 bg-gray-300 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Provision Tenant</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={tanentFormValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty }) => (
            <Form className="space-y-4">
              {/* Name */}
              <div>
                <Field
                  type="text"
                  name="name"
                  placeholder="Enter name *"
                  className="w-full p-2 border rounded-md"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              {/* Email */}
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter email *"
                  className="w-full p-2 border rounded-md"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              {/* Phone */}
              <div>
                <Field
                  type="number"
                  name="phone"
                  placeholder="Enter phone *"
                  className="w-full p-2 border rounded-md"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              {/* Address */}
              <div>
                <Field
                  as="textarea"
                  type="text"
                  name="address"
                  placeholder="Enter address *"
                  className="w-full p-2 border rounded-md "
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`px-4 py-2 rounded-md transition ${
                    isValid
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
                <button
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

export default TanentForm;
