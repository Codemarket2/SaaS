// OrderService Lambda Function
import mongoose from "mongoose";
import { DB } from "../../utils/DB";
import { Product } from "../ProductService/index";

const orderSchema = new mongoose.Schema({
  orderName: String,
  orderTotalPrice: Number,
  orderTotalQuantity: Number,
  orderProducts: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
      _id: false,
    },
  ],
});
const Order = mongoose.model("Order", orderSchema);

export async function handler(event) {
  await DB();
  const path = event.rawPath;
  const httpMethod = event.requestContext.http.method;
  let response;

  try {
    if (httpMethod === "GET" && path === "/orders") {
      let orders = await Order.find()
        .populate("orderProducts.productId", "name")
        .lean();
      orders = orders.map((o) => {
        return {
          ...o,
          orderProducts: o.orderProducts.map((p) => {
            return {
              ...p,
              productId: p.productId._id,
              name: p.productId.name,
            };
          }),
        };
      });
      response = {
        statusCode: 200,
        body: JSON.stringify(orders),
      };
    } else if (httpMethod === "POST" && path === "/orders") {
      const body = JSON.parse(event.body);
      const newOrder = new Order(body);
      await newOrder.save();
      response = {
        statusCode: 201,
        body: JSON.stringify(newOrder),
      };
    } else {
      response = { statusCode: 404, body: "Not Found" };
    }
  } catch (error) {
    console.log("error", error);
    response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error }),
    };
  }
  return response;
}
