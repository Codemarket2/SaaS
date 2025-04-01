import { Tracer } from "@aws-lambda-powertools/tracer";
import Stripe from "stripe";
import {
  generateResponse,
  createSuccessResponse,
  createErrorResponse,
} from "../../utils";
import * as logger from "../../layers/nodejs/logger";
import {
  createPaymentIntentService,
  paymentSuccessWebhookService,
} from "../paymentService/paymentServiceDal";

const tracer = new Tracer({ serviceName: "saas-workshop" });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
  typescript: true,
});

export const createPaymentIntent = async (event, context) => {
  try {
    //   logger.logWithTenantContext(
    //     event,
    //     "Request received to create paymentIntent"
    //   );
    // logger.logWithTenantContext(event, event.pathParameters);
    const paymentIntent = await createPaymentIntentService(event, context);
    return generateResponse(paymentIntent.client_secret);
  } catch (error) {
    return createErrorResponse(
      error?.message ?? error ?? "Something went wrong",
      500
    );
  }
};

export const paymentSuccessWebhook = async (event, context) => {
  try {
    console.log("PaymentSuccessWebhook", event);
    if (
      event.body.type == "charge.succeeded" &&
      event?.body?.data?.metadata?.teantDetails
    ) {
      const res = await paymentSuccessWebhookService(event, context);
      logger.logWithTenantContext(event, "PaymentSuccessWebhook");
    }
    return null;
  } catch (error) {
    return createErrorResponse(
      error?.message ?? error ?? "Something went wrong",
      500
    );
  }
};
