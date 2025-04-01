import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useLocation } from "react-router-dom";

import { httpRequest } from "../helper/http-service";
import { endpoints } from "../helper/endpoints";
import { showSuccess } from "../helper/toast";

const SubscribeTenant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tenantData = location.state || {};
  const [loadingPlan, setLoadingPlan] = useState(null);

  const plans = [
    {
      name: "Basic",
      price: "$5/month",
      features: ["Access to basic features", "Community support"],
      color: "blue",
    },
    {
      name: "Standard",
      price: "$10/month",
      features: ["More features included", "Email support"],
      color: "purple",
    },
    {
      name: "Premium",
      price: "$20/month",
      features: ["Access to all features", "Priority support"],
      color: "green",
    },
    {
      name: "Platinum",
      price: "$50/month",
      features: ["All premium features", "24/7 support"],
      color: "red",
    },
  ];

  const colorClasses = {
    blue: "border-blue-500 bg-blue-500 hover:bg-blue-50 hover:text-blue-500",
    purple:
      "border-purple-500 bg-purple-500 hover:bg-purple-50 hover:text-purple-500",
    green:
      "border-green-500 bg-green-500 hover:bg-green-50 hover:text-green-500",
    red: "border-red-500 bg-red-500 hover:bg-red-50 hover:text-red-500",
  };

  const handleSubscribe = async (planName) => {
    try {
      setLoadingPlan(planName);
      // console.log({
      //   tenantId: uuidv4(),
      //   ...tenantData,
      //   plan: planName,
      //   isActive: true,
      // });
      const updatedTenantData = {
        tenantId: uuidv4(),
        tenantName: tenantData.name,
        tenantAddress: tenantData.address,
        tenantEmail: tenantData.email,
        tenantPhone: tenantData.phone,
        tenantTier: planName,
        isActive: true,
      };
      const res = await httpRequest.post(endpoints.registerTenant, {
        ...updatedTenantData,
      });

      if (res.success) {
        showSuccess(res?.message);
        navigate("/tanent");
      }
    } catch (error) {
      console.error("Error registering tenant", error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        Choose Your Plan
      </h1>
      <div className="grid md:grid-cols-4 gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all border-t-4 ${
              colorClasses[plan.color]
            }`}
          >
            <h2 className="text-2xl font-bold text-gray-700">{plan.name}</h2>
            <p className="text-gray-500 text-lg my-3">{plan.price}</p>
            <ul className="text-gray-600 space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i}>✅ {feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.name)}
              disabled={loadingPlan === plan.name || loadingPlan != null}
              className={`mt-5 w-full border text-white py-2 cursor-pointer rounded-lg font-semibold ${
                colorClasses[plan.color]
              } ${loadingPlan && "opacity-50 cursor-not-allowed"}`}
            >
              {loadingPlan === plan.name ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscribeTenant;
