import { Tracer } from "@aws-lambda-powertools/tracer";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";
import middy from "@middy/core";
import * as utils from "../../utils";
import * as logger from "../../layers/nodejs/logger";
// import * as metricsManager from "../../layers/nodejs/metricManager";
import * as productServiceDal from "./productServiceDal";

const tracer = new Tracer({ serviceName: "saas-workshop" });

const getProductHandler = async (event, context) => {
  try {
    const tenantId = event.requestContext.authorizer.lambda.tenantId;
    tracer.putAnnotation("TenantId", tenantId);

    logger.logWithTenantContext(event, "Request received to get a product");
    const { id: key } = event.pathParameters;
    logger.logWithTenantContext(event, event.pathParameters);
    logger.logWithTenantContext(event, key);

    const product = await productServiceDal.getProduct(event, key);

    logger.logWithTenantContext(event, "Request completed to get a product");
    // metricsManager.recordMetric(event, "SingleProductRequested", "Count", 1);

    return utils.generateResponse(product);
  } catch (error) {
    return utils.createErrorResponse(
      error?.message ?? error ?? "Something went wrong",
      500
    );
  }
};

export const getProduct = middy(getProductHandler).use(
  captureLambdaHandler(tracer)
);

const createProductHandler = async (event, context) => {
  try {
    const tenantId = event.requestContext.authorizer.lambda.tenantId;
    tracer.putAnnotation("TenantId", tenantId);

    logger.logWithTenantContext(event, "Request received to create a product");
    const payload = JSON.parse(event.body);

    const product = await productServiceDal.createProduct(event, payload);

    logger.logWithTenantContext(event, "Request completed to create a product");
    //   metricsManager.recordMetric(event, "ProductCreated", "Count", 1);

    return utils.generateResponse(product);
  } catch (error) {
    return utils.createErrorResponse(
      error?.message ?? error ?? "Something went wrong",
      500
    );
  }
};

export const createProduct = middy(createProductHandler).use(
  captureLambdaHandler(tracer)
);

const updateProductHandler = async (event, context) => {
  try {
    const tenantId = event.requestContext.authorizer.lambda.tenantId;
    tracer.putAnnotation("TenantId", tenantId);

    logger.logWithTenantContext(event, "Request received to update a product");
    const payload = JSON.parse(event.body);
    //   const { id: key } = event.pathParameters;
    const { _id } = event.pathParameters;

    //   const product = await productServiceDal.updateProduct(event, payload, key);
    const product = await productServiceDal.updateProduct(event, payload, _id);

    logger.logWithTenantContext(event, "Request completed to update a product");
    //   metricsManager.recordMetric(event, "ProductUpdated", "Count", 1);

    return utils.generateResponse(product);
  } catch (error) {
    return utils.createErrorResponse(
      error?.message ?? error ?? "Something went wrong",
      500
    );
  }
};

export const updateProduct = middy(updateProductHandler).use(
  captureLambdaHandler(tracer)
);

export const deleteProductHandler = async (event, context) => {
  try {
    const tenantId = event.requestContext.authorizer.lambda.tenantId;
    tracer.putAnnotation("TenantId", tenantId);

    logger.logWithTenantContext(event, "Request received to delete a product");
    const { id: key } = event.pathParameters;

    await productServiceDal.deleteProduct(event, key);

    logger.logWithTenantContext(event, "Request completed to delete a product");
    // metricsManager.recordMetric(event, "ProductDeleted", "Count", 1);

    return utils.createSuccessResponse("Successfully deleted the product");
  } catch (error) {
    return utils.createErrorResponse(
      error?.message ?? error ?? "Something went wrong",
      500
    );
  }
};

export const deleteProduct = middy(deleteProductHandler).use(
  captureLambdaHandler(tracer)
);

const getProductsHandler = async (event, context) => {
  try {
    const tenantId = event.requestContext.authorizer?.lambda?.tenantId;
    tracer.putAnnotation("TenantId,", tenantId);

    logger.logWithTenantContext(event, "Request received to get all products");
    const response = await productServiceDal.getProducts(event, tenantId);

    // metricsManager.recordMetric(
    //   event,
    //   "ProductsRetrieved",
    //   "Count",
    //   response.length
    // );
    // logger.logWithTenantContext(event, "Request completed to get all products");

    return utils.generateResponse(response);
  } catch (error) {
    return utils.createErrorResponse(
      error?.message ?? error ?? "Something went wrong",
      500
    );
  }
};
export const getProducts = middy(getProductsHandler).use(
  captureLambdaHandler(tracer)
);
