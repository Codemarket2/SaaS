import { Tracer } from "@aws-lambda-powertools/tracer";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";
import middy from "@middy/core";
import {
  generateResponse,
  createSuccessResponse,
  createErrorResponse,
} from "../../utils";
import * as logger from "../../layers/nodejs/logger";
// import * as metricsManager from "../../layers/nodejs/metricManager";
import * as orderServiceDal from "./orderServiceDal";
import { getPolicyForUser } from "../../layers/nodejs/authManager";

const tracer = new Tracer({ serviceName: "saas-workshop" });

export const getOrder = tracer.captureLambdaHandler(async (event, context) => {
  try {
    const tenantId = event.requestContext.authorizer.lambda.tenantId;
    tracer.putAnnotation("TenantId", tenantId);

    logger.logWithTenantContext(event, "Request received to get an order");
    const { id: key } = event.pathParameters;
    logger.logWithTenantContext(event, event.pathParameters);

    const order = await orderServiceDal.getOrder(event, key);

    logger.logWithTenantContext(event, "Request completed to get an order");
    // metricsManager.recordMetric(event, "SingleOrderRequested", "Count", 1);

    return generateResponse(order);
  } catch (error) {
    return createErrorResponse(
      error?.message ?? error ?? "Something went wrong",
      500
    );
  }
});

export const createOrderHandler = async (event, context) => {
  try {
    const tenantId = event.requestContext.authorizer.lambda.tenantId;
    tracer.putAnnotation("TenantId", tenantId);

    logger.logWithTenantContext(event, "Request received to create an order");
    const payload = JSON.parse(event.body);

    const order = await orderServiceDal.createOrder(event, payload);

    logger.logWithTenantContext(event, "Request completed to create an order");
    // metricsManager.recordMetric(event, "OrderCreated", "Count", 1);

    return generateResponse(order);
  } catch (error) {
    return createErrorResponse(
      error?.message ?? error ?? "Something went wrong",
      500
    );
  }
};
export const createOrder = middy(createOrderHandler).use(
  captureLambdaHandler(tracer)
);
export const updateOrder = tracer.captureLambdaHandler(
  async (event, context) => {
    try {
      const tenantId = event.requestContext.authorizer.lambda.tenantId;
      tracer.putAnnotation("TenantId", tenantId);

      logger.logWithTenantContext(event, "Request received to update an order");
      const payload = JSON.parse(event.body);
      const { id: key } = event.pathParameters;

      const order = await orderServiceDal.updateOrder(event, payload, key);

      logger.logWithTenantContext(
        event,
        "Request completed to update an order"
      );
      // metricsManager.recordMetric(event, "OrderUpdated", "Count", 1);

      return generateResponse(order);
    } catch (error) {
      return createErrorResponse(
        error?.message ?? error ?? "Something went wrong",
        500
      );
    }
  }
);

export const deleteOrder = tracer.captureLambdaHandler(
  async (event, context) => {
    try {
      const tenantId = event.requestContext.authorizer.lambda.tenantId;
      tracer.putAnnotation("TenantId", tenantId);

      logger.logWithTenantContext(event, "Request received to delete an order");
      const { id: key } = event.pathParameters;

      await orderServiceDal.deleteOrder(event, key);

      logger.logWithTenantContext(
        event,
        "Request completed to delete an order"
      );
      // metricsManager.recordMetric(event, "OrderDeleted", "Count", 1);

      return createSuccessResponse("Successfully deleted the order");
    } catch (error) {
      return createErrorResponse(
        error?.message ?? error ?? "Something went wrong",
        500
      );
    }
  }
);

const getOrdersHandler = async (event, context) => {
  try {
    const tenantId = event.requestContext.authorizer.lambda.tenantId;
    tracer.putAnnotation("TenantId", tenantId);
    logger.logWithTenantContext(event, "Request received to get all orders");
    const response = await orderServiceDal.getOrders(event, tenantId);
    console.log("response", response);
    // metricsManager.recordMetric(
    //   event,
    //   "OrdersRetrieved",
    //   "Count",
    //   response.length
    // );
    logger.logWithTenantContext(event, "Request completed to get all orders");

    return generateResponse(response);
  } catch (error) {
    return createErrorResponse(
      error?.message ?? error ?? "Something went wrong",
      500
    );
  }
};
export const getOrders = middy(getOrdersHandler).use(
  captureLambdaHandler(tracer)
);
