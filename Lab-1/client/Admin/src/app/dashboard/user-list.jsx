import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { showError, showSuccess } from "../helper/toast";
import { httpRequest } from "../helper/http-service";
import { endpoints } from "../helper/endpoints";
import Loader from "../components/loader";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await httpRequest.get(endpoints.getUsers);
      if (res.length > 0) {
        setUsers(res);
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const navigation = useNavigate();
  return (
    <div
      className="p-4 bg-gray-200 w-full  "
      style={{
        height: "calc(100vh - 80px)",
        maxHeight: "calc(100vh - 80px)",
      }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full ">
        <h2 className="text-2xl font-bold  mb-4">User List</h2>
        <div
          className="overflow-y-auto border-[1px] rounded-lg w-full"
          style={{
            height: "calc(100vh - 350px)",
            maxHeight: "calc(100vh - 350px)",
          }}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left border-b grid grid-cols-5">
                <th className="p-4 text-gray-500">Email</th>
                <th className="p-4 text-gray-500">Created Date</th>
                <th className="p-4 text-gray-500">Tenant Id</th>
                <th className="p-4 text-gray-500">Status</th>
                <th className="p-4 text-gray-500">Enabled</th>
              </tr>
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan="5" className="text-center py-2">
                    <Loader />
                  </td>
                </tr>
              </tbody>
            ) : users?.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="5" className="text-center text-gray-400 py-2">
                    No user Found.
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 grid grid-cols-5 ${
                      index < users.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <td className="p-4 text-[#3d3d3d] col-span-1">
                      {user.email}
                    </td>
                    <td className="p-4 text-[#3d3d3d] col-span-1">
                      {user.created}
                    </td>
                    <td className="p-4 text-[#3d3d3d] col-span-1">
                      {user.tenantId}
                    </td>
                    <td
                      className={`p-4  col-span-1${
                        user?.status === "Active"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {user.status}
                    </td>
                    <td className="p-4 text-[#3d3d3d] col-span-1">
                      {user.enabled ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        <button
          onClick={() => navigation("/user-create")}
          className="mt-5 px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition duration-300 w-[180px]"
        >
          Add User
        </button>
      </div>
    </div>
  );
};

export default UserList;
