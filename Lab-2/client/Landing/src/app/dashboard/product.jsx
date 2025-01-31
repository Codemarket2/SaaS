import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import axios from "axios";

// import { products } from "../constants/sidebar-options";
import { showError } from "../helper/toast";

const Product = () => {
  const navigation = useNavigate();
  // const products = useSelector((state) => state.product.products);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/products`);
      if (res.status === 200) {
        setProducts(res.data);
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="bg-gray-200 overflow-hidden">
      <div className="h-[70px] flex items-center pl-3">
        <h1 className="text-slate-800 text-[20px] font-semibold">
          Product List
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
          <div className="bg-white shadow-md rounded-lg w-full ">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-4 border-b text-gray-500">Name</th>
                  <th className="p-4 border-b text-gray-500">Price</th>
                  <th className="p-4 border-b text-gray-500">SKU</th>
                </tr>
              </thead>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-2">
                    <ClipLoader color="#1447e6" loading={true} size={30} />
                  </td>
                </tr>
              ) : products?.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-2">
                    No Product Found
                  </td>
                </tr>
              ) : (
                <tbody>
                  {products?.map((product, index) => {
                    return (
                      <tr
                        key={index}
                        className={`hover:bg-gray-50 ${
                          index < products?.length - 1 && "border-b"
                        }`}
                      >
                        <td className="p-4  text-[#3d3d3d]">{product?.name}</td>
                        <td className="p-4  text-[#3d3d3d]">
                          {"$"}
                          {product?.price}
                        </td>
                        <td className="p-4  text-[#3d3d3d]">{product?.sku}</td>
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </table>
          </div>
          <button
            onClick={() => navigation("/product-create")}
            className="mt-5 px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition duration-300 w-[180px]"
          >
            Create Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
