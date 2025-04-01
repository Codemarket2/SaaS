import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { httpRequest } from "../helper/http-service";
import { endpoints } from "../helper/endpoints";
import { showError, showSuccess } from "../helper/toast";
import Loader from "../components/loader";

const TanentList = () => {
  //initial states
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTanents();
  }, []);

  const getTanents = async () => {
    try {
      setLoading(true);
      const res = await httpRequest.get(endpoints.getTenants);

      if (res?.length > 0) {
        setTenants(res);
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
        <h2 className="text-2xl font-bold  mb-4">Tenants List</h2>
        <div
          className="overflow-y-auto border-[1px] rounded-lg w-full"
          style={{
            height: "calc(100vh - 350px)",
            maxHeight: "calc(100vh - 350px)",
          }}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left border-b">
                <th className="p-4 text-gray-500">Id</th>
                <th className="p-4 text-gray-500">Tenent Name</th>
                <th className="p-4 text-gray-500">E-Mail</th>
                <th className="p-4 text-gray-500">Plan</th>
                <th className="p-4 text-gray-500">Status</th>
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
            ) : tenants?.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="5" className="text-center text-gray-400 py-2">
                    No Tenant Found.
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {tenants.map((tenant, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 ${
                      index < tenants.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <td className="p-4 text-[#3d3d3d]">{tenant.tenantId}</td>
                    <td className="p-4 text-[#3d3d3d]">{tenant.tenantName}</td>
                    <td className="p-4 text-[#3d3d3d]">{tenant.tenantEmail}</td>
                    <td className="p-4 text-[#3d3d3d]">{tenant.tenantTier}</td>
                    <td className="p-4 text-[#3d3d3d]">
                      {tenant.isActive ? "Active" : "Inactive"}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        <button
          onClick={() => navigation("/tanent-create")}
          className="mt-5 px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition duration-300 w-[180px]"
        >
          Add Tanent
        </button>
      </div>
    </div>
  );
};

export default TanentList;
