/**
 * Modal component
 */
import React from "react";
import { useEffect } from "react";

const Modal = ({
  isOpen,
  onBackPress,
  children,
  bgClasssName,
  containerClass,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null; // Ensure modal is not rendered when isOpen is false

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${containerClass}`}
    >
      <div
        className={`fixed inset-0 bg-black  opacity-50 `}
        onClick={() => onBackPress && onBackPress()}
      ></div>
      <div
        className={`bg-white rounded-3xl shadow-lg p-8 max-w-3xl relative ${bgClasssName} mx-2`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
