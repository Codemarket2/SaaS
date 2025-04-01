/**
 * Product screen
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { AiFillEdit } from "react-icons/ai";

// import { products } from "../constants/sidebar-options";
import { showError } from "../helper/toast";
import { httpRequest } from "../helper/http-service";
import { endpoints } from "../helper/endpoints";

const Product = () => {
  const navigation = useNavigate();
  // const products = useSelector((state) => state.product.products);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await httpRequest.get(endpoints.products);
      if (res?.length > 0) {
        setProducts(res);
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
    <div
      className="p-4 bg-gray-200 w-full  "
      style={{
        height: "calc(100vh - 80px)",
        maxHeight: "calc(100vh - 80px)",
      }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full ">
        <h2 className="text-2xl font-bold  mb-4">Product List</h2>
        <div
          className=" overflow-y-auto border-[1px] rounded-lg w-full"
          style={{
            height: "calc(100vh - 350px)",
            maxHeight: "calc(100vh - 350px)",
          }}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left grid grid-cols-3 w-full">
                <th className="p-4 border-b text-gray-500 col-span-1">Name</th>
                <th className="p-4 border-b text-gray-500 col-span-1 ">
                  Price
                </th>
                <th className="p-4 border-b text-gray-500 col-span-1">SKU</th>
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
            ) : products?.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="3" className="text-center py-2">
                    No Product Found
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {products?.map((product, index) => {
                  return (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 grid grid-cols-3 ${
                        index < products?.length - 1 && "border-b"
                      }`}
                    >
                      <td className="p-4  text-[#3d3d3d] col-span-1">
                        {product?.name}
                      </td>
                      <td className="p-4  text-[#3d3d3d] col-span-1">
                        {"$"}
                        {product?.price}
                      </td>
                      <td className="p-4  text-[#3d3d3d] col-span-1 flex justify-between items-center">
                        {product?.sku}
                        <div className="flex items-center justify-center p-1 ml-5 ">
                          <AiFillEdit
                            className="text-xl"
                            onClick={() =>
                              navigation("/product-create", {
                                state: { product },
                              })
                            }
                          />
                        </div>
                      </td>
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
  );
};

export default Product;
