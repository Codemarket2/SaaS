import React from "react";

const NotFound = () => {
  return (
    <div className="h-screen w-full grid place-items-center">
      <h1 className="text-6xl text-gray-700">
        Page Not Found{" "}
        <span className="bg-red-200 rounded-s-md py-1 px-3 mx-2 text-red-500">
          404
        </span>
      </h1>
    </div>
  );
};

export default NotFound;
