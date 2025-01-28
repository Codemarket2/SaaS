import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { tanentFormValidationSchema } from "../helper/validations";
import { useNavigate } from "react-router-dom";

const TanentForm = () => {
  const navigate = useNavigate();
  // Initial form values
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    address: "",
    plan: "",
  };

  // const handleSubmit = (values) => {
  //   console.log("Form Submitted:", values);
  // };

  return (
    <div
      className="p-5 bg-gray-300"
      style={{
        height: "calc(100vh - 80px)",
        maxHeight: "calc(100vh - 80px)",
      }}
    >
      <div className="bg-white shadow-lg rounded-lg p-6 w-80">
        <h2 className="text-xl font-semibold mb-4">Provision Tannet</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={tanentFormValidationSchema}
          onSubmit={() => navigate(-1)}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/*  Name */}
              <div>
                <Field
                  type="text"
                  name="name"
                  placeholder="Enter name *"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  type="text"
                  name="email"
                  placeholder="Enter email *"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-none"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/*  Phone */}
              <div>
                <Field
                  type="number"
                  name="phone"
                  placeholder="Enter phone"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-none"
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
                  type="text"
                  name="address"
                  placeholder="address"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-none"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Plan */}
              <div>
                <Field
                  as="select"
                  name="plan"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-none"
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="platinum">Platinum</option>
                </Field>
                <ErrorMessage
                  name="plan"
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
                  onClick={() => navigate(-1)}
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
