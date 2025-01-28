import React from "react";
import { useNavigate } from "react-router-dom";

import { users } from "../constants/sidebar-options";

const UserList = () => {
  const navigation = useNavigate();
  return (
    <div className="bg-gray-200 overflow-hidden">
      <div className="">
        <div className="h-[70px] flex items-center pl-3">
          <h1 className="text-slate-800 text-[20px] font-semibold">
            User List
          </h1>
        </div>
        <div
          className="w-full overflow-y-auto"
          style={{
            height: "calc(100vh - 150px)",
            maxHeight: "calc(100vh - 150px)",
          }}
        >
          <div className="flex flex-col m-4 mt-0">
            <div className="bg-white shadow-md rounded-lg w-full">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left border-b">
                    <th className="p-4 text-gray-500">Email</th>
                    <th className="p-4 text-gray-500">Created Date</th>
                    <th className="p-4 text-gray-500">Modified Date</th>
                    <th className="p-4 text-gray-500">Status</th>
                    <th className="p-4 text-gray-500">Enabled</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 ${
                        index < users.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <td className="p-4 text-[#3d3d3d]">{user.email}</td>
                      <td className="p-4 text-[#3d3d3d]">{user.createdAt}</td>
                      <td className="p-4 text-[#3d3d3d]">{user.updatedAt}</td>
                      <td
                        className={`p-4 ${
                          user?.status === "Active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {user.status}
                      </td>
                      <td className="p-4 text-[#3d3d3d]">
                        {user.isActive ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
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
      </div>
    </div>
  );
};

export default UserList;
