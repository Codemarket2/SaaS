/***
 *
 *
 */

import React from "react";
import { RotatingLines } from "react-loader-spinner";

function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  isLoading = false,
  buttonclassName,
  loaderStrokeColor = "green",
}) {
  return (
    <button
      type={type}
      onClick={() => onClick && onClick()}
      disabled={disabled || isLoading}
      className={`p-2 px-4 rounded-sm flex text-white bg-[#367B92] focus:outline-none hover:outline-none items-center justify-center active:outline-none font-lato font-bold text-lg ${buttonclassName} `}
    >
      {isLoading ? (
        <RotatingLines
          visible={true}
          width="30"
          strokeColor={loaderStrokeColor}
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      ) : (
        children
      )}
    </button>
  );
}

export const CloseButton = ({ children, onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={(e) => onClick && onClick()}
      className=" p-2 px-4 rounded-lg text-white hover:bg-[#ab4b4b] bg-[#d65e5e]"
    >
      {children}
    </button>
  );
};

export default Button;
