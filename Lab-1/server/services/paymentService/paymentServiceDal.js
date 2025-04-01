const env = require("dotenv");
env.config();

const Stripe = require("stripe");

const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export const createPaymentIntentService = async (event, key) => {
  console.log("event", event.body);
  const {
    email,
    currency,
    payment_method_types = [],
    amount,
    tenantDetails,
    planDetails,
  } = JSON.parse(event.body);

  const { secret_key } = getKeys(payment_method_types[0]);
  const stripe = new Stripe(secret_key, {
    apiVersion: "2022-11-15",
    typescript: true,
  });
  delete planDetails.features;
  const customer = await stripe.customers.create({ email });
  const params = {
    amount,
    currency,
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      tenantDetails: JSON.stringify(tenantDetails),
      planDetails: JSON.stringify(planDetails),
    },
  };

  try {
    const paymentIntent = await stripe.paymentIntents.create({ ...params });
    // Send publishable key and PaymentIntent client_secret to client.
    return paymentIntent;
  } catch (error) {
    console.log("createPaymentIntentService", error);
    return error?.raw?.message ?? error;
  }
};

export const paymentSuccessWebhookService = async (event, key) => {
  try {
    const sig = event.headers["stripe-signature"];
    const { secret_key } = getKeys();
    const stripe = new Stripe(secret_key, {
      apiVersion: "2022-11-15",
      typescript: true,
    });
    event = stripe.webhooks.constructEvent(
      event.body,
      sig,
      stripeWebhookSecret
    );
    const { teantDetails } = event.data.metadata;

    // console.log("event after metadata", metadata);

    // console.log("event after constructEvent", JSON.stringify(event));
    return null;
  } catch (error) {
    console.log("paymentSuccessWebhookService", error);
  }
};

function getKeys(payment_method) {
  let secret_key = stripeSecretKey;
  let publishable_key = stripePublishableKey;

  switch (payment_method) {
    case "grabpay":
    case "fpx":
      publishable_key = process.env.STRIPE_PUBLISHABLE_KEY_MY;
      secret_key = process.env.STRIPE_SECRET_KEY_MY;
      break;
    case "au_becs_debit":
      publishable_key = process.env.STRIPE_PUBLISHABLE_KEY_AU;
      secret_key = process.env.STRIPE_SECRET_KEY_AU;
      break;
    case "oxxo":
      publishable_key = process.env.STRIPE_PUBLISHABLE_KEY_MX;
      secret_key = process.env.STRIPE_SECRET_KEY_MX;
      break;
    case "wechat_pay":
      publishable_key = process.env.STRIPE_PUBLISHABLE_KEY_WECHAT;
      secret_key = process.env.STRIPE_SECRET_KEY_WECHAT;
      break;
    case "paypal":
    case "revolut_pay":
      publishable_key = process.env.STRIPE_PUBLISHABLE_KEY_UK;
      secret_key = process.env.STRIPE_SECRET_KEY_UK;
      break;
    default:
      publishable_key = process.env.STRIPE_PUBLISHABLE_KEY;
      secret_key = process.env.STRIPE_SECRET_KEY;
  }

  return { secret_key, publishable_key };
}
