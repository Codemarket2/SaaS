import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { userFormValidationSchema } from "../helper/validations";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaKey, FaBuilding } from "react-icons/fa"; // Importing icons

const UserForm = () => {
  const navigate = useNavigate();

  // Initial form values
  const initialValues = {
    username: "",
    email: "",
    role: "",
    tenantId: "",
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
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Create User
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Upon submission, a new user account will be created, and we will send
          an email to the provided address with login instructions.
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={userFormValidationSchema}
          onSubmit={() => navigate(-1)}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-gray-700 mb-1">
                  Username *
                </label>
                <div className="relative">
                  <Field
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-none"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                    <FaUser />
                  </span>
                </div>
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-none"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                    <FaEnvelope />
                  </span>
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* User Role */}
              <div>
                <label htmlFor="role" className="block text-gray-700 mb-1">
                  User Role *
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    name="role"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-none"
                  >
                    <option value="" disabled>
                      Select a role
                    </option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </Field>
                  {/* <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                    <FaKey />
                  </span> */}
                </div>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Tenant ID */}
              <div>
                <label htmlFor="tenantId" className="block text-gray-700 mb-1">
                  Tenant ID *
                </label>
                <div className="relative">
                  <Field
                    type="text"
                    name="tenantId"
                    placeholder="Enter tenant ID"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-none"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                    <FaBuilding />
                  </span>
                </div>
                <ErrorMessage
                  name="tenantId"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="reset"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition focus:border-none"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition focus:border-none"
                >
                  Create
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UserForm;
