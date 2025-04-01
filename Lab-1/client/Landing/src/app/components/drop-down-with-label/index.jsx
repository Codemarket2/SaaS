import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const DropdownWithLabel = ({
  value,
  rightLabel,
  options,
  setValue,
  containerClass,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (value) => {
    setValue(value);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-52 ${containerClass}`}>
      <div
        className="flex items-center justify-between  border border-black border-opacity-5 rounded-lg cursor-pointer bg-white"
        onClick={toggleDropdown}
      >
        <span
          className={`flex-1 text-left pl-2 !font-poppins font-normal text-lg text-[#0A1106]${
            !rightLabel ? "py-1" : ""
          }`}
        >
          {value
            ? value
            : `Select  ${rightLabel ? rightLabel?.toLowerCase() : ""}`}
        </span>
        <FiChevronDown className="pr-2 text-2xl" />
        {rightLabel && (
          <span className="px-4 py-1 bg-gray-200  border-black border-opacity-5 rounded-r-lg font-poppins font-normal text-lg text-[#0A1106]">
            {rightLabel}
          </span>
        )}
      </div>
      {error && !isOpen && (
        <div className="text-red-500 !font-poppins font-normal text-base ">
          {error}
        </div>
      )}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 border border-black border-opacity-5 rounded-lg bg-white z-10">
          {options.map((opt, index) => {
            return (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOptionClick(opt)}
              >
                {opt}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownWithLabel;
