import mongoose from "mongoose";

const orderProductSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    shardId: { type: String, required: true },
    // orderId: { type: String, required: true },
    orderName: { type: String, required: true },
    orderProducts: [orderProductSchema],
    key: { type: String, required: true },
  },
  {
    // Create a compound unique index similar to DynamoDB's composite key
    indexes: [{ unique: true, fields: { shardId: 1, orderId: 1 } }],
  }
);

// Create model
const Order = mongoose.model("Order", orderSchema);

export { Order };
