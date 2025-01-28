import React, { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import "../multi-select/styles.css";

const MultiSectionDropdown = ({
  sections,
  onChange,
  preferedOptions,
  title,
  labelClass,
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSelectedOptions(preferedOptions);
  }, [preferedOptions]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectAll = (section) => {
    const sectionExists = selectedOptions.some(
      (selectedSection) => selectedSection.title === section.title
    );

    let newSelectedOptions;

    if (sectionExists) {
      // If the section is already selected, deselect it
      newSelectedOptions = selectedOptions.filter(
        (selectedSection) => selectedSection.title !== section.title
      );
    } else {
      // Select all options in the section
      const sectionOptions = section.options.map((option) => option);

      newSelectedOptions = [
        ...selectedOptions,
        { title: section.title, options: sectionOptions },
      ];
    }

    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
  };

  const handleOptionChange = (section, option) => {
    const sectionIndex = selectedOptions.findIndex(
      (selectedSection) => selectedSection.title === section.title
    );

    let newSelectedOptions = [...selectedOptions];

    if (sectionIndex !== -1) {
      const optionExists = newSelectedOptions[sectionIndex].options.some(
        (selectedOption) => selectedOption.value === option.value
      );

      if (optionExists) {
        // Deselect the option
        newSelectedOptions[sectionIndex].options = newSelectedOptions[
          sectionIndex
        ].options.filter(
          (selectedOption) => selectedOption.value !== option.value
        );

        // If no options left in the section, remove the section
        if (newSelectedOptions[sectionIndex].options.length === 0) {
          newSelectedOptions = newSelectedOptions.filter(
            (selectedSection) => selectedSection.title !== section.title
          );
        }
      } else {
        // Add the option
        newSelectedOptions[sectionIndex].options.push(option);
      }
    } else {
      // If the section is not yet selected, add the section and option
      newSelectedOptions.push({
        exclusionId: section?._id,
        title: section.title,
        options: [option],
      });
    }

    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
  };

  const handleRemoveTag = (section, option) => {
    const sectionIndex = selectedOptions.findIndex(
      (selectedSection) => selectedSection.title === section.title
    );

    if (sectionIndex !== -1) {
      let newSelectedOptions = [...selectedOptions];

      newSelectedOptions[sectionIndex].options = newSelectedOptions[
        sectionIndex
      ].options.filter(
        (selectedOption) => selectedOption.value !== option.value
      );

      if (newSelectedOptions[sectionIndex].options.length === 0) {
        newSelectedOptions = newSelectedOptions.filter(
          (selectedSection) => selectedSection.title !== section.title
        );
      }

      setSelectedOptions(newSelectedOptions);
      onChange(newSelectedOptions);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filterOptions = (options) => {
    return options?.filter((option) =>
      option.label.toLowerCase().includes(searchQuery)
    );
  };

  // Check if all options in the section are selected
  const isAllSelected = (sectionIndex) => {
    const section = sections[sectionIndex];
    const selectedSection = selectedOptions.find(
      (s) => s.title === section.title
    );
    return (
      selectedSection &&
      selectedSection.options.length === section.options.length
    );
  };

  const isOptionSelected = (sectionIndex, option) => {
    const section = sections[sectionIndex];
    const selectedSection = selectedOptions.find(
      (s) => s.title === section.title
    );
    return (
      selectedSection &&
      selectedSection.options.some(
        (selectedOption) => selectedOption.value === option.value
      )
    );
  };

  const renderSelectedTags = () => {
    return selectedOptions.map((section) => {
      return section.options.map((opt, index) => {
        return (
          <div
            key={`${index}`}
            className="flex bg-orange-500 text-white px-2 py-1 rounded-xl mr-2 items-center m-1"
          >
            <span className="mr-1 font-poppins">{opt?.label}</span>
            <AiFillCloseCircle
              onClick={(event) => {
                event.stopPropagation();
                handleRemoveTag(section, opt);
              }}
            />
          </div>
        );
      });
    });
  };

  return (
    <div className="relative inline-block text-left w-full text-base font-normal font-poppins">
      <div>
        {title && (
          <label
            className={`form-label text-[#000] line-clamp-1 font-normal font-poppins text-base mb-2 ${labelClass} `}
          >
            {title}
          </label>
        )}
        <button
          type="button"
          className="inline-flex justify-between w-full py-2 px-3 items-center border border-black border-opacity-5 rounded focus:outline-none hover:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-[#FBFBFB]"
          onClick={toggleDropdown}
        >
          <div className="flex flex-wrap max-w-full">
            {renderSelectedTags()}
            {selectedOptions?.length === 0 && (
              <span className="font-poppins">Select Options</span>
            )}
          </div>
          <svg
            className={`-mr-1 ml-2 h-5 w-5 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 011.414 0L10 11.293l3.293-3.586a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 overflow-y-scroll h-[340px]">
          <div className="py-1">
            <div className="px-4 pb-2">
              <input
                type="text"
                placeholder="Search options..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none font-openSans"
              />
            </div>
            {sections.map((section, index) => {
              const filteredOptions = filterOptions(section.options);
              return (
                <div key={index} className="mb-2">
                  <div className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={isAllSelected(index)}
                        onChange={() => handleSelectAll(section)}
                        className="mr-2 font-openSans"
                      />
                    </label>
                    <span className="font-bold mb-2 font-poppins">
                      {sections[index].title}
                    </span>
                  </div>
                  <div className="pl-6 mt-1">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center px-4 py-1 hover:bg-gray-50 cursor-pointer"
                        >
                          <label className="custom-checkbox">
                            <input
                              type="checkbox"
                              checked={isOptionSelected(index, option)}
                              onChange={() =>
                                handleOptionChange(section, option)
                              }
                              className="accent-orange-500 mr-2 font-openSans"
                            />
                          </label>
                          <span className="mb-2 font-poppins">
                            {option.label}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 font-poppins">
                        No options found
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSectionDropdown;
