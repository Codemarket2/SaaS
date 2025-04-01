/**
 * DropDown component
 */

import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import ArrowDown from "../../assets/icons/arrow-down.png";
const DropDown = ({
  options,
  label,
  value,
  handleChange,
  title,
  containerClass,
  rightIcon,
  dropDownContainerClass,
  labelClass,
  error,
  disabled = false,
  leftIcon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (val) => {
    handleChange && handleChange(val);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropDownRef} className={`relative ${containerClass}`}>
      {title && (
        <label
          className={`text-[#000]  line-clamp-1 !font-poppins font-normal text-base mb-2 ${labelClass}`}
        >
          {title}
        </label>
      )}
      <button
        className={`flex items-center h-[64px] bg-white w-full  focus:border-none justify-between p-2 border border-[#00000021] rounded-md font-openSans focus:ring-2 font-normal text-base ${
          value ? "text-[#0A1106]" : "text-[#B7B7B7]"
        }  ${
          value ? "text-transform: capitalize" : ""
        } ${dropDownContainerClass} ${
          disabled
            ? "opacity-45  hover:border-opacity-5  focus:border-opacity-5 "
            : "focus:ring-[#294890]"
        }`}
        onClick={() => toggleDropdown()}
        disabled={disabled}
      >
        <div className="flex flex-row items-center">
          {leftIcon && leftIcon()}
          <span
            className={`line-clamp-1 font-openSans text-base font-normal ${
              value ? "text-[#0A1106]" : "text-[#545458b3]"
            }`}
          >
            {value ? value : label}
          </span>
        </div>

        {rightIcon ? (
          rightIcon()
        ) : (
          <img src={ArrowDown} className="h-2 mr-2 " />
        )}
      </button>
      {error && !isOpen && (
        <div className="text-red-500 font-openSans font-normal text-base ">
          {error}
        </div>
      )}
      {isOpen && (
        <div className="absolute flex top-full left-0 w-full mt-1 border border-black border-opacity-5 rounded-lg bg-[#FBFBFB] flex-col z-20 ">
          {options.map((opt, index) => {
            return (
              <div
                key={index}
                className="p-3 hover:bg-gray-100 cursor-pointer font-openSans font-normal  text-base text-[#0A1106]"
                onClick={() => handleOptionClick(opt)}
              >
                {opt?.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default DropDown;
