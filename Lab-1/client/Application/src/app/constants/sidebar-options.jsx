import ShoppingCart from "../assets/icons/shopping-cart.png";
import Tag from "../assets/icons/tag.png";

export const SidebarList = [
  {
    id: 2,
    title: "Products",
    pathname: "/product",
    icon: Tag,
  },
  {
    id: 3,
    title: "Orders",
    pathname: "/order",
    icon: ShoppingCart,
  },
];

export const products = [
  { name: "Laptop", price: "$999", sku: "56" },
  { name: "Smartphone", price: "$699", sku: "564" },
  { name: "Headphones", price: "$199", sku: "234" },
  { name: "Camera", price: "$499", sku: "355" },
  { name: "Monitor", price: "$249", sku: "754" },
  { name: "Keyboard", price: "$89", sku: "334" },
];
export const orders = [
  { name: "Smartphone", total: "$699", lineItem: "1" },
  { name: "Headphones", total: "$398", lineItem: "2" },
  { name: "Laptop", total: "$999", lineItem: "1" },
  { name: "Camera", total: "$1497", lineItem: "3" },
  { name: "Keyboard", total: "$890", lineItem: "10" },
  { name: "Monitor", total: "$249", lineItem: "1" },
];
