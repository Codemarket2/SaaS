/**
 * Orders screen
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { httpRequest } from "../helper/http-service";
import { endpoints } from "../helper/endpoints";
import { showError } from "../helper/toast";

const Order = () => {
  const navigation = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await httpRequest.get(endpoints.orders);
      if (res.length > 0) {
        setOrders(res);
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
    <div
      className="p-4 bg-gray-200 w-full  "
      style={{
        height: "calc(100vh - 80px)",
        maxHeight: "calc(100vh - 80px)",
      }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full ">
        <h2 className="text-2xl font-bold  mb-4">Order List</h2>
        <div
          className="overflow-y-auto border-[1px] rounded-lg w-full"
          style={{
            height: "calc(100vh - 350px)",
            maxHeight: "calc(100vh - 350px)",
          }}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left border-b grid grid-cols-3">
                <th className="p-4  text-gray-500">Name</th>
                <th className="p-4  text-gray-500 col-span-1 flex justify-center">
                  Line item
                </th>
                <th className="p-4  text-gray-500 col-span-1 flex justify-end">
                  total
                </th>
              </tr>
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan="3" className="text-center py-2">
                    <ClipLoader color="#1447e6" loading={true} size={30} />
                  </td>
                </tr>
              </tbody>
            ) : orders?.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="3" className="text-center py-2">
                    No Order Found.
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {orders?.map((order, index) => {
                  const { totalPrice, totalQuantity } =
                    order?.orderProducts?.reduce(
                      (totals, prod) => {
                        return {
                          totalPrice:
                            totals.totalPrice + prod?.price * prod.quantity,
                          totalQuantity: totals?.totalQuantity + prod?.quantity,
                        };
                      },
                      { totalPrice: 0, totalQuantity: 0 } // Initial values
                    );

                  return (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 grid grid-cols-3 ${
                        index < orders?.length - 1 && "border-b"
                      }`}
                    >
                      <td className="p-4 text-[#3d3d3d]">{order?.orderName}</td>
                      <td className="p-4 text-[#3d3d3d] col-span-1 flex justify-center">
                        {totalQuantity}
                      </td>
                      <td className="p-4 text-[#3d3d3d] col-span-1 flex justify-end">
                        {"$"}
                        {totalPrice}
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
  );
};

export default Order;
