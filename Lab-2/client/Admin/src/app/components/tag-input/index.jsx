/**
 * TagInput component
 */

import React, { useState } from "react";

const TagInput = ({
  title,
  titleClass,
  containerClass,
  tags,
  onChange,
  error,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      onChange([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleTagRemove = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  const handleBlur = () => {
    if (inputValue.trim() !== "") {
      onChange([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  return (
    <div className={containerClass}>
      {title && (
        <label
          className={`form-label text-[#000]  line-clamp-1 text-base font-normal font-poppins mb-2 ${titleClass}`}
        >
          {title}
        </label>
      )}
      <div className="flex items-center flex-wrap border border-gray-300 rounded-lg  overflow-scroll">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-orange-500 text-white rounded-full px-2 py-1 m-1"
          >
            {tag}
            <span
              className="ml-2 text-white cursor-pointer"
              onClick={() => handleTagRemove(index)}
            >
              &times;
            </span>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onBlur={handleBlur}
          placeholder="Type and Press enter to add a tag"
          className="flex-grow border-none outline-none p-1 m-1 font-openSans"
        />
      </div>
      {error && (
        <div className="text-red-500 font-poppins font-normal text-base ">
          {error}
        </div>
      )}
    </div>
  );
};

export default TagInput;
