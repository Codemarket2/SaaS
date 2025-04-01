import userImg from "../assets/icons/user.png";
import groupImg from "../assets/icons/group.png";
import graphImg from "../assets/icons/graph.png";
import logoutImg from "../assets/icons/out.png";

export const SidebarList = [
  {
    id: 1,
    title: "Dashboard",
    pathname: "/",
    icon: graphImg,
  },
  {
    id: 2,
    title: "Tanents",
    pathname: "/tanent",
    icon: groupImg,
  },
  {
    id: 3,
    title: "Users",
    pathname: "/user",
    icon: userImg,
  },
  // {
  //   id: 4,
  //   title: "Logout",
  //   icon: logoutImg,
  // },
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

export const tenants = [
  {
    Id: 1,
    tanentName: "Alpha Corp",
    email: "contact@alphacorp.com",
    plan: "Premium",
    status: "Active",
  },
  {
    Id: 2,
    tanentName: "Beta Solutions",
    email: "info@betasolutions.com",
    plan: "Standard",
    status: "Inactive",
  },
  {
    Id: 3,
    tanentName: "Gamma Group",
    email: "support@gammagroup.com",
    plan: "Basic",
    status: "Active",
  },
  {
    Id: 4,
    tanentName: "Delta Innovations",
    email: "hello@deltainnovations.com",
    plan: "Premium",
    status: "Pending",
  },
  {
    Id: 5,
    tanentName: "Epsilon Tech",
    email: "sales@epsilontech.com",
    plan: "Standard",
    status: "Active",
  },
];

export const users = [
  {
    email: "john.doe@example.com",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-10",
    status: "Active",
    isActive: true,
  },
  {
    email: "jane.smith@example.com",
    createdAt: "2025-01-05",
    updatedAt: "2025-01-15",
    status: "Inactive",
    isActive: false,
  },
  {
    email: "alice.williams@example.com",
    createdAt: "2025-01-08",
    updatedAt: "2025-01-18",
    status: "Active",
    isActive: true,
  },
  {
    email: "bob.johnson@example.com",
    createdAt: "2025-01-12",
    updatedAt: "2025-01-22",
    status: "Pending",
    isActive: false,
  },
  {
    email: "carol.brown@example.com",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25",
    status: "Active",
    isActive: true,
  },
];
