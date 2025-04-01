import React, { useState } from "react";
// import { v4 as uuidv4 } from "uuid";
import { useNavigate, useLocation } from "react-router-dom";

// import { httpRequest } from "../helper/http-service";
// import { endpoints } from "../helper/endpoints";
// import { showError, showSuccess } from "../helper/toast";
import {
  // useStripe,
  // useElements,
  Elements,
  // PaymentElement,
} from "@stripe/react-stripe-js";
import { CheckoutForm } from "../components/checkout/checkout";
import { loadStripe } from "@stripe/stripe-js";

const TenantPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const stripe = useStripe();
  // const elements = useElements();
  const { tenantDetails, planDetails } = location.state || {};
  console.log("tenantDetails", tenantDetails);
  console.log("planDetails", planDetails);

  // const [loadingPlan, setLoadingPlan] = useState(null);

  const stripePromise = loadStripe(
    "pk_test_517LnJnDPrb5EfwdR32Q5Rj8d8T76wemCttovpQUk2ihmwyPPs33zxTHAAzPw83IlJebg0CoKiwPgH5HbXWyCzsP300tCdonr1H"
  );

  const options = {
    mode: "payment",
    amount: planDetails.amount,
    currency: "usd",
    // Fully customizable with appearance API.
    appearance: {
      /*...*/
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm planDetails={planDetails} tenantDetails={tenantDetails} />
    </Elements>
  );
};

export default TenantPayment;
