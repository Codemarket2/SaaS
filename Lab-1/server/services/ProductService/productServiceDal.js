import mongoose from "mongoose";
import random from "random";
// import { v4 as uuidv4 } from "uuid";

import { Product } from "../../models/productModel";
// import * as metricsManager from "../../layers/nodejs/metricManager";
import * as logger from "../../layers/nodejs/logger";
import { checkAuthorization } from "../../layers/nodejs/authManager";

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const suffixStart = 1;
const suffixEnd = 10;

// Get a product by shardId and productId
export const getProduct = async (event, key) => {
  try {
    checkAuthorization(event, ["read:all", "read:products"]);
    const [shardId, productId] = key.split(":");
    logger.logWithTenantContext(event, shardId);
    logger.logWithTenantContext(event, productId);

    const product = await Product.findOne({ shardId, productId });

    if (!product) {
      throw new Error("Product not found");
    }

    // metricsManager.recordMetric(event, "ReadCapacityUnits", "Count", 1);
    logger.info("GetItem succeeded: " + JSON.stringify(product));
    return product;
  } catch (error) {
    logger.error("Error getting a product", error);
    throw new Error(error?.message ?? "Error getting a product" ?? error);
  }
};

// Delete a product
export const deleteProduct = async (event, key) => {
  try {
    checkAuthorization(event, ["delete:all", "delete:products"]);
    const [shardId, productId] = key.split(":");
    const response = await Product.deleteOne({ shardId, productId });

    // metricsManager.recordMetric(event, "WriteCapacityUnits", "Count", 1);
    logger.info("DeleteItem succeeded");
    return response;
  } catch (error) {
    logger.error("Error deleting a product", error);
    throw new Error(error?.message ?? "Error deleting a product" ?? error);
  }
};

// Create a new product
export const createProduct = async (event, payload) => {
  try {
    checkAuthorization(event, ["write:all", "write:products"]);
    const tenantId = event.requestContext.authorizer.lambda.tenantId;
    const suffix = random.int(suffixStart, suffixEnd);
    const shardId = `${tenantId}-${suffix}`;
    // const productId = uuidv4();

    const newProduct = new Product({
      shardId,
      // productId,
      sku: payload.sku,
      name: payload.name,
      price: payload.price,
      category: payload.category,
    });
    await newProduct.save();
    // metricsManager.recordMetric(event, "WriteCapacityUnits", "Count", 1);
    logger.info("PutItem succeeded");
    return newProduct;
  } catch (error) {
    logger.error("Error adding a product", error);
    throw new Error(error?.message ?? "Error adding a product" ?? error);
  }
};

// Update an existing product
export const updateProduct = async (event, payload, _id) => {
  try {
    // const [shardId, productId] = key.split(":");
    checkAuthorization(event, ["write:all", "write:products"]);
    const { shardId } = payload;
    logger.logWithTenantContext(event, shardId);
    logger.logWithTenantContext(event, _id);

    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      {
        sku: payload.sku,
        name: payload.name,
        price: payload.price,
        category: payload.category,
        shardId,
      },
      { new: true }
    );

    // metricsManager.recordMetric(event, "WriteCapacityUnits", "Count", 1);
    logger.info("UpdateItem succeeded");
    return updatedProduct;
  } catch (error) {
    logger.error("Error updating a product", error);
    throw new Error("Error updating a product", error?.message ?? error);
  }
};

// Get all products for a tenant
export const getProducts = async (event, tenantId) => {
  try {
    checkAuthorization(event, ["read:all", "read:products"]);
    const allProducts = [];
    await queryAllPartitions(tenantId, allProducts, event);
    logger.info("Get products succeeded");
    return allProducts;
  } catch (error) {
    logger.error("Error getting all products", error);
    throw new Error(error?.message ?? "Error getting all products" ?? error);
  }
};

// Query all partitions (simulating parallel queries)
const queryAllPartitions = async (tenantId, allProducts, event) => {
  const promises = [];

  for (let suffix = suffixStart; suffix < suffixEnd; suffix++) {
    const partitionId = `${tenantId}-${suffix}`;
    promises.push(getTenantData(partitionId, allProducts, event));
  }

  await Promise.all(promises);
};

// Fetch tenant data
const getTenantData = async (partitionId, allProducts, event) => {
  logger.info(partitionId);
  const products = await Product.find({ shardId: partitionId });

  if (products.length > 0) {
    allProducts.push(...products);
  }

  //   metricsManager.recordMetric(event, "ReadCapacityUnits", "Count", 1);
};
