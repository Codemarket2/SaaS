/**
 * MultilineInput Component
 */

import React from "react";

const MultilineInput = ({
  title,
  placeholder = "Enter here...",
  rows = "6",
  value,
  handleChange,
  labelClass,
  textareaClass,
  error,
  containerClass,
}) => {
  return (
    <div className={`w-full ${containerClass}`}>
      {title && (
        <label
          className={`form-label text-[#000]  line-clamp-1  font-normal font-openSans text-base mb-2 ${labelClass} `}
        >
          {title}
        </label>
      )}
      <textarea
        id={title}
        rows={rows}
        className={`border w-full border-[#00000021] text-[#0A1106] placeholder-[#545458b3] rounded-md h-[186px] focus:border-none focus:ring-2 focus:ring-[#294890] bg-white py-2 px-3 resize-none font-normal font-openSans text-base ${textareaClass}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          handleChange && handleChange(e);
        }}
      ></textarea>
      {error && (
        <div className="text-red-500 font-openSans font-normal text-base ">
          {error}
        </div>
      )}
    </div>
  );
};

export default MultilineInput;
