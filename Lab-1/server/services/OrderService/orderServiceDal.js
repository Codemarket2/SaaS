// Import necessary libraries
import mongoose from "mongoose";
// import { v4 as uuidv4 } from "uuid";
import random from "random";

import { Order } from "../../models/orderModel";
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

// Get an order by shardId and orderId
export const getOrder = async (event, key) => {
  try {
    const [shardId, orderId] = key.split(":");
    logger.logWithTenantContext(event, shardId);
    logger.logWithTenantContext(event, orderId);

    const order = await Order.findOne({ shardId, orderId });

    if (!order) {
      throw new Error("Order not found");
    }

    // metricsManager.recordMetric(event, "ReadCapacityUnits", "Count", 1);
    return order;
  } catch (error) {
    logger.error("Error getting an order", error);
    throw new Error("Error getting an order", error);
  }
};

// // Delete an order
// export const deleteOrder = async (event, key) => {
//   try {
//     const [shardId, orderId] = key.split(":");
//     const response = await Order.deleteOne({ shardId, orderId });

//     metricsManager.recordMetric(event, "WriteCapacityUnits", "Count", 1);
//     logger.info("Delete succeeded");
//     return response;
//   } catch (error) {
//     logger.error("Error deleting an order", error);
//     throw new Error("Error deleting an order", error);
//   }
// };

// Create a new order
export const createOrder = async (event, payload) => {
  try {
    checkAuthorization(event, ["write:all", "write:orders"]);
    const tenantId = event.requestContext.authorizer.lambda.tenantId;
    const suffix = random.int(suffixStart, suffixEnd);
    const shardId = `${tenantId}-${suffix}`;
    // const orderId = uuidv4();

    const newOrder = new Order({
      shardId,
      // orderId,
      orderName: payload.orderName,
      orderProducts: payload.orderProducts,
    });

    newOrder.key = `${shardId}:${newOrder._id}`;
    await newOrder.save();
    // metricsManager.recordMetric(event, "WriteCapacityUnits", "Count", 1);
    logger.info("Order created successfully");
    return newOrder;
  } catch (error) {
    logger.error("Error adding an order", error);
    throw new Error(error?.message ?? "Error adding an order");
  }
};

// // Update an existing order
// export const updateOrder = async (event, payload, key) => {
//   try {
//     const [shardId, orderId] = key.split(":");
//     logger.logWithTenantContext(event, shardId);
//     logger.logWithTenantContext(event, orderId);

//     const updatedOrder = await Order.findOneAndUpdate(
//       { shardId, orderId },
//       {
//         orderName: payload.orderName,
//         orderProducts: payload.orderProducts,
//       },
//       { new: true }
//     );

//     metricsManager.recordMetric(event, "WriteCapacityUnits", "Count", 1);
//     logger.info("Order updated successfully");
//     return updatedOrder;
//   } catch (error) {
//     logger.error("Error updating an order", error);
//     throw new Error("Error updating an order", error);
//   }
// };

// Get all orders for a tenant
export const getOrders = async (event, tenantId) => {
  try {
    checkAuthorization(event, ["read:all", "read:orders"]);
    const allOrders = [];
    await queryAllPartitions(tenantId, allOrders, event);
    logger.info("Get orders succeeded");
    return allOrders;
  } catch (error) {
    logger.error("Error getting all orders", error);
    throw new Error(error?.message ?? "Error getting all orders");
  }
};

// Query all partitions (simulating parallel queries)
const queryAllPartitions = async (tenantId, allOrders, event) => {
  const promises = [];

  for (let suffix = suffixStart; suffix < suffixEnd; suffix++) {
    const partitionId = `${tenantId}-${suffix}`;
    promises.push(getTenantData(partitionId, allOrders, event));
  }

  await Promise.all(promises);
};

// Fetch tenant data
const getTenantData = async (partitionId, allOrders, event) => {
  logger.info(partitionId);
  const orders = await Order.find({ shardId: partitionId });

  if (orders.length > 0) {
    allOrders.push(...orders);
  }

  // metricsManager.recordMetric(event, "ReadCapacityUnits", "Count", 1);
};

// // Helper function to convert order products to dictionary
// const getOrderProductsDict = (orderProducts) => {
//   return orderProducts.map((product) => ({
//     productId: product.productId,
//     price: product.price,
//     quantity: product.quantity,
//   }));
// };
