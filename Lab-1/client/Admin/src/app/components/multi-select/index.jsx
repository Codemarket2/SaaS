/**
 * MultiSelect Component
 */
import React, { useEffect, useRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";

import "./styles.css";

const MultiSelect = ({
  options,
  selectedOptions,
  setSelectedOptions,
  labelClass,
  title,
  containerClass,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef(null);

  const handleSelect = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(
        selectedOptions.filter((item) => item?.value !== option?.value)
      );
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
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
    <div
      ref={dropDownRef}
      className={`relative inline-block text-left ${containerClass}`}
    >
      <div>
        {title && (
          <label
            className={`form-label text-[#000] flex-wrap text-base font-normal font-poppins mb-2 ${labelClass}`}
          >
            {title}
          </label>
        )}
        <button
          type="button"
          className="inline-flex justify-between w-full py-2 px-3 items-center 
          } border  border-black border-opacity-5 rounded focus:outline-none hover:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-[#FBFBFB]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className={`line-clamp-1 flex flex-row flex-wrap font-poppins ${
              selectedOptions?.length === 0 ? "text-[#B7B7B7]" : "text-black"
            }`}
          >
            {selectedOptions.length > 0
              ? selectedOptions.map((opt, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-row bg-orange-500 text-white px-2  rounded-xl mr-2 items-center m-1 "
                    >
                      <span className="mr-1 font-poppins">{opt?.label}</span>
                      <AiFillCloseCircle
                        onClick={(event) => {
                          event.stopPropagation();
                          handleSelect(opt);
                        }}
                      />
                    </div>
                  );
                })
              : "Select options"}
          </span>
          <div className="w-8 h-8 flex items-center justify-end ">
            <FiChevronDown />
          </div>
        </button>
      </div>
      {error && !isOpen && (
        <div className="text-red-500 font-poppins font-normal text-base ">
          {error}
        </div>
      )}
      {isOpen && (
        <div className=" w-full  origin-top-right absolute right-0 mt-2  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            {options.map((option, index) => (
              <div
                key={index}
                className="flex items-center px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 "
                onClick={() => handleSelect(option)}
              >
                <label className="custom-checkbox font-openSans ">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleSelect(option)}
                    className="accent-orange-500 mr-2 font-openSans"
                  />
                </label>
                <span className="font-poppins">{option?.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
