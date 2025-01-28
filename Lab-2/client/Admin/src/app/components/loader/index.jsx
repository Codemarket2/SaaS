/**
 * Loader component
 */

import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <ClipLoader color="#157759" loading={true} size={30} />
    </div>
  );
};

export default Loader;
