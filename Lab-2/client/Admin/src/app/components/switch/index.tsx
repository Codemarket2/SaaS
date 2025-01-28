/**
 *
 * @param param0
 * @returns
 */
import React from "react";

const Switch = ({ checked, onChange, permissionName }) => {
  return (
    <div className="w-full">
      <label className="relative inline-flex items-center mr-5 mb-2 cursor-pointer">
        <input
          type="checkbox"
          value=""
          checked={checked}
          onChange={(e) => onChange(e)}
          className="sr-only peer font-openSans"
        />
        <div className="w-11 h-6  bg-[#ffffff50] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-0 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[#e0f3f6]  border-[#515050] border after:border-[#515050] after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-[#2084fe] outline-none" />
        <span className="ml-3 text-sm font-medium font-poppins">
          {permissionName}
        </span>
      </label>
    </div>
  );
};

export default Switch;
