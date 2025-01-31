/**
 *
 * Toast Message
 */
import { toast } from "react-toastify";

export const showError = (error: any) => {
  toast.error(
    error?.response?.data?.message || error?.message || "Something went wrong",
    {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    }
  );
};

export const showSuccess = (msg: string) => {
  toast.success(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};
