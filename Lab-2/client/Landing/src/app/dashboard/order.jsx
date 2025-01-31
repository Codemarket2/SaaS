import React, { useEffect, useState } from "react";

import { orders } from "../constants/sidebar-options";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const Order = () => {
  const navigation = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/orders`);
      if (res.status === 200) {
        setOrders(res.data);
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
          <div className="bg-white shadow-md rounded-lg w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left border-b">
                  <th className="p-4  text-gray-500">Name</th>
                  <th className="p-4  text-gray-500">Line item</th>
                  <th className="p-4  text-gray-500">total</th>
                </tr>
              </thead>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-2">
                    <ClipLoader color="#1447e6" loading={true} size={30} />
                  </td>
                </tr>
              ) : orders?.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-2">
                    No Order Found.
                  </td>
                </tr>
              ) : (
                <tbody>
                  {orders?.map((order, index) => {
                    return (
                      <tr
                        key={index}
                        className={`hover:bg-gray-50 ${
                          index < orders?.length - 1 && "border-b"
                        }`}
                      >
                        <td className="p-4 text-[#3d3d3d]">
                          {order?.orderName}
                        </td>
                        <td className="p-4 text-[#3d3d3d]">
                          {order?.orderTotalQuantity}
                        </td>
                        <td className="p-4 text-[#3d3d3d]">
                          {"$"}
                          {order?.orderTotalPrice}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              )}
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
