/**
 *
 *Card Component
 */

import React from "react";

function Card({ children, className }) {
  return (
    <div
      className={`w-full mt-3 justify-between font-openSans flex flex-col shadow-lg  bg-[#FFFFFf] rounded-3xl p-3 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
