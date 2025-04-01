// ProductService Lambda Function
const mongoose = require("mongoose");
import { DB } from "../../utils/DB";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  stock: Number,
  category: String,
  sku: String,
});
export const Product = mongoose.model("Product", productSchema);

export async function handler(event) {
  await DB();
  const path = event.rawPath;
  const httpMethod = event.requestContext.http.method;
  let response;

  try {
    if (httpMethod === "GET" && path === "/products") {
      const products = await Product.find();
      response = {
        statusCode: 200,
        body: JSON.stringify(products),
      };
    } else if (httpMethod === "POST" && path === "/products") {
      const body = JSON.parse(event.body);
      const newProduct = new Product(body);
      await newProduct.save();
      response = {
        statusCode: 201,
        body: JSON.stringify(newProduct),
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
