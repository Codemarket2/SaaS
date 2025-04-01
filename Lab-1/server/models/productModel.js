// Import Mongoose
import mongoose from "mongoose";

// Define the Category schema
const categorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

// Define the Product schema
const productSchema = new mongoose.Schema({
  shardId: {
    type: String,
    required: true,
  },
  // productId: {
  //   type: String,
  //   required: true,
  // },
  // key: { // to do
  //   type: String,
  //   unique: true,
  // },
  sku: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: categorySchema,
});

// Create models
// const Category = mongoose.model("Category", categorySchema); //to do
const Product = mongoose.model("Product", productSchema);

// Export models
export { Product };
