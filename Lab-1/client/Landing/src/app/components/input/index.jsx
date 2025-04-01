/**
 *
 * Input Component
 */
import React from "react";
import Label from "../label";

function Input({
  label,
  type,
  value,
  onChange,
  className,
  id,
  placeholder,
  disabled,
  error,
  required = false,
  leftIcon,
  rightIcon,
  containerClass,
  leftIconContainerClass,
  labelClass,
  ...rest
}) {
  return (
    <div className={`${containerClass}`}>
      {label && (
        <label
          className={`form-label text-[#000]  line-clamp-1 font-lato font-normal text-base mb-2 ${labelClass}`}
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span
            className={`absolute left-0  items-center pl-3 ${leftIconContainerClass}`}
          >
            {leftIcon}
          </span>
        )}
        <input
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          {...rest}
          className={`w-full py-2 px-3 ${leftIcon ? "pl-10" : ""} ${
            rightIcon ? "pr-10" : ""
          } ${
            disabled ? "opacity-50" : ""
          } border border-[#858C94] placeholder-[#757575] focus:border-none rounded-sm focus:outline-none focus:ring-2 focus:ring-[#367B92] bg-[#FBFBFB] font-lato   text-md font-normal text-[#0A1106]  ${className}`}
        />
        {rightIcon && (
          <span className="absolute right-0 h-11 w-[40px] rounded-br rounded-tr flex justify-center items-center ">
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <div className="text-red-500 font-lato font-normal text-base text-left ">
          {error}
        </div>
      )}
    </div>
  );
}

export default Input;
