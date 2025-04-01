import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// import { v4 as uuidv4 } from "uuid";

// import { httpRequest } from "../helper/http-service";
// import { endpoints } from "../helper/endpoints";
// import { showSuccess, showError } from "../helper/toast";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    navigate("/choose-tenent-plans", { state: values });
    setSubmitting(false);

    // try {
    //   // Handle form submission logic here
    //   const res = await httpRequest.post(endpoints.registerTenant, {
    //     tenantId: uuidv4(),
    //     tenantName: values.name,
    //     tenantAddress: values?.address,
    //     tenantEmail: values?.email,
    //     tenantPhone: values?.phone,
    //     tenantTier: values?.plan,
    //     isActive: true,
    //   });
    //   if (res.success) {
    //     showSuccess(res?.message);
    //     navigate(-1);
    //   }
    // } catch (error) {
    //   showError(error);
    // } finally {
    //   setSubmitting(false);
    // }
  };

  return (
    <div className="flex justify-center items-start pt-4 min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold">Provision a new Tenant</h2>
        <p className="text-gray-500 text-sm mb-4">
          Login details will be sent to the email provided.
        </p>
        <Formik
          initialValues={{
            name: "",
            email: "",
            phone: "",
            address: "",
            plan: "",
          }}
          validationSchema={Yup.object({
            name: Yup.string().trim().required("Required"),
            email: Yup.string()
              .trim()
              .email("Invalid email")
              .required("Required"),
            phone: Yup.string(),
            address: Yup.string(),
            // plan: Yup.string().required("Required"), // used in next page
          })}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <Field
                className="w-full p-2 border rounded"
                name="name"
                placeholder="Name *"
              />
              <ErrorMessage
                className="text-red-500 text-sm"
                name="name"
                component="div"
              />

              <Field
                className="w-full p-2 border rounded"
                type="email"
                name="email"
                placeholder="Email *"
              />
              <ErrorMessage
                className="text-red-500 text-sm"
                name="email"
                component="div"
              />

              <Field
                className="w-full p-2 border rounded"
                name="phone"
                placeholder="Phone"
              />

              <Field
                className="w-full p-2 border rounded"
                name="address"
                placeholder="Address"
              />
              {/*    // used in next page
              <Field
                as="select"
                className="w-full p-2 border rounded"
                name="plan"
              >
                <option disabled value="">
                  Select One
                </option>
                <option value="basic">Basic</option>
                <option value="basic">Standard</option>
                <option value="premium">Premium</option>
                <option value="premium">Platinum</option>
              </Field> */}
              <ErrorMessage
                className="text-red-500 text-sm"
                name="plan"
                component="div"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-300 rounded text-gray-700"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
                <button
                  onClick={() => navigate(-1)}
                  type="reset"
                  className="px-4 py-2 bg-red-500 text-white rounded"
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

export default SignUp;
