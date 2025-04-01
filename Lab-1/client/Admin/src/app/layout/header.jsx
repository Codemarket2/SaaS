import React, { useState } from "react";
import { signOut } from "@aws-amplify/auth";

import { FaBars, FaUser, FaWrench, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/reducers/authSlice";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const data = useSelector((state) => state?.authSlice?.user);
  const dispatch = useDispatch();

  return (
    <header className="bg-gray-100 shadow p-4 flex justify-between items-center">
      {/* Hamburger Menu Icon */}
      <div className="flex items-center">
        <button className="p-2">
          <span className="sr-only">Open menu</span>
          <div className="space-y-1">
            <div className="w-6 h-1 bg-gray-600"></div>
            <div className="w-6 h-1 bg-gray-600"></div>
            <div className="w-6 h-1 bg-gray-600"></div>
          </div>
        </button>
      </div>

      {/* User Icon and Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center p-2 focus:outline-none"
        >
          <FaUser className="w-6 h-6 text-gray-600" />
        </button>

        {isMenuOpen && (
          <div className="absolute z-10 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="px-4 py-2">
              <span className="text-sm font-semibold">{data?.username}</span>
            </div>
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => console.log("Profile clicked")}
            >
              <FaUser className="w-5 h-5 mr-2" />
              Profile
            </button>
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => console.log("Auth Debug clicked")}
            >
              <FaWrench className="w-5 h-5 mr-2" />
              Auth Debug
            </button>
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={async () => {
                const userConfirmed = window.confirm(
                  `Are you sure you want to logout ?`
                );
                setIsMenuOpen(false);
                if (userConfirmed) {
                  await signOut();
                  dispatch(logout());
                  // window.location.href =
                  //   "https://staging.d2lo9931usj7s5.amplifyapp.com";
                }
              }}
            >
              <FaSignOutAlt className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
