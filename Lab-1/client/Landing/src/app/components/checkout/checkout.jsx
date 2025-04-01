import React, { useState } from "react";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { showError } from "../../helper/toast";
import { httpRequest } from "../../helper/http-service";
import { endpoints } from "../../helper/endpoints";
// import PRODUCT from "../productInfo";

export const CheckoutForm = ({ planDetails, tenantDetails }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const getPaymentIntent = async (paymentInfo) => {
    // get the client secert (payment intent) for payment
    try {
      const res = await httpRequest.post(endpoints.createPaymentIntent, {
        amount: paymentInfo.amount,
        currency: "usd",
        email: paymentInfo.email,
        tenantDetails,
        planDetails,
      });
      return res;
    } catch (error) {
      showError(error?.message ?? "Something went wrong");
      console.error("Error getting payment intent", error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    event.preventDefault();
    try {
      if (elements == null || stripe == null) {
        return;
      }

      // Trigger form validation and wallet collection
      const { error: submitError } = await elements.submit();
      if (submitError?.message) {
        // Show error to your customer
        setErrorMessage(submitError.message);
        return;
      }

      // setLoadingPlan(plan.name);
      const clientSecret = await getPaymentIntent({
        amount: planDetails.amount.toString(),
        currency: "usd",
        email: tenantDetails.email,
      });

      //4242 4242 4242 4242
      // const res = await httpRequest.post(endpoints.registerTenant, {
      //   ...tenantDetails,
      // });

      const { error } = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success-tenant-payment`,
        },
      });

      if (error) {
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        setErrorMessage(error.message);
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    } catch (error) {
      showError(error?.message ?? "Something went wrong");
      console.error("Error registering tenant", error);
    } finally {
      //   setLoadingPlan(null);
      setLoading(false);
    }
  };
  console.log("planDetails.amount", planDetails.amount);
  return (
    <form onSubmit={handleSubmit} className="px-4">
      <h2 className="text-3xl font-bold ">Amount : {planDetails.amount}</h2>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="bg-indigo-500 text-white hover:bg-indigo-600 font-bold rounded shadow-[0.25rem_0.25rem_0px_0px_rgba(0,0,0,1)] focus:outline-none border-gray-900 hover:border-gray-900 border-2"
      >
        Pay
      </button>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};
