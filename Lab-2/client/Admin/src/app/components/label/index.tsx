/**
 *
 * Label Component
 */
import React from "react";

function Label({
  label,
  variant = "base",
  className = "mb-4",
  weight = "normal",
}) {
  return (
    <div
      className={`text-${variant} font-${weight} font-openSans  text-[#101012]  ${className}`}
    >
      {label}
    </div>
  );
}

export default Label;
