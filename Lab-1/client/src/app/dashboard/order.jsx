import React from "react";

import { orders } from "../constants/sidebar-options";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const navigation = useNavigate();
  return (
    <div className="bg-gray-200 overflow-hidden">
      <div className="h-[70px] flex items-center pl-3">
        <h1 className="text-slate-800 text-[20px] font-semibold">Order List</h1>
      </div>
      <div
        className="w-full overflow-y-auto"
        style={{
          height: "calc(100vh - 150px)",
          maxHeight: "calc(100vh - 150px)",
        }}
      >
        <div className="m-4 mt-0">
          <div className="bg-white shadow-md rounded-lg w-2/3">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-4 border-b text-gray-500">Name</th>
                  <th className="p-4 border-b text-gray-500">Line item</th>
                  <th className="p-4 border-b text-gray-500">total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4 border-b text-[#3d3d3d]">
                      {product.name}
                    </td>
                    <td className="p-4 border-b text-[#3d3d3d]">
                      {product.lineItem}
                    </td>
                    <td className="p-4 border-b text-[#3d3d3d]">
                      {product.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={() => navigation("/order-create")}
            className="mt-5 px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition duration-300 w-[180px]"
          >
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
