import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { userFormValidationSchema } from "../helper/validations";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaKey, FaBuilding } from "react-icons/fa"; // Importing icons
import { endpoints } from "../helper/endpoints";
import { httpRequest } from "../helper/http-service";
import { showError, showSuccess } from "../helper/toast";
import { useSelector } from "react-redux";
import { getUSerAttributes } from "../helper/utils";

const roles = [
  { id: "CustomerSupport", name: "Customer Support" },
  { id: "TenantAdmin", name: "Tenant Admin" },
  { id: "TenantUser", name: "Tenant User" },
];

const UserForm = () => {
  const navigate = useNavigate();
  const [attributes, setAttributes] = useState(null);

  useEffect(() => {
    getAttributes();
  }, []);

  const getAttributes = async () => {
    const attributes = await getUSerAttributes();
    setAttributes(attributes);
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      setSubmitting(true);
      let data = {
        userName: values?.username,
        userEmail: values?.email,
        userRole: values?.role?.id,
        tenantId: attributes?.["custom:tenantId"] ?? values.tenantId,
      };
      const res = await httpRequest.post(endpoints.createUser, data);
      if (res?.success) {
        showSuccess(res.message);
        resetForm();
        navigate(-1);
      }
    } catch (error) {
      showError(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Initial form values
  const initialValues = {
    username: "",
    email: "",
    role: null,
    tenantId: "282b869e-815f-4b56-9270-3fdbd73c4417",
  };

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
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, setFieldValue, errors }) => {
            return (
              <Form className="space-y-4">
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-gray-700 mb-1"
                  >
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
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={values.role?.id || ""}
                      onChange={(e) => {
                        const selectedRole =
                          roles?.find((role) => role.id === e.target.value) ||
                          null;
                        setFieldValue("role", selectedRole); // Store the full object
                      }}
                    >
                      <option value="" disabled>
                        Select a role
                      </option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
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
                  <label
                    htmlFor="tenantId"
                    className="block text-gray-700 mb-1"
                  >
                    Tenant ID *
                  </label>
                  <div className="relative">
                    <Field
                      type="text"
                      name="tenantId"
                      value={attributes?.["custom:tenantId"] ?? values.tenantId}
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
                    {isSubmitting ? "Creating" : "Create"}
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

export default UserForm;
