const SocialInput = ({
  icon,
  onChange,
  input,
  placeholder,
  disabled = false,
  error,
}) => {
  const handleInputClick = () => {
    if (!onChange && input.trim()) {
      window.open(input, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div>
      <div
        className={`flex relative items-center w-full h-14 border border-[#00000021] focus-within:outline-none rounded-lg overflow-hidden  ${
          !disabled ? "focus-within:border-[#4c74d3]" : "opacity-50"
        }`}
      >
        <div className="flex items-center justify-center w-14 h-full">
          <img
            src={icon}
            alt="social icon"
            className=" h-[54px] w-[56px] top-0 absolute left-0"
          />
        </div>
        <input
          type="text"
          value={input}
          onClick={handleInputClick}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={onChange ? false : true}
          className="w-full h-[50px] px-4 py-2 font-openSans placeholder:text-base font-normal text-[#0A1106] placeholder:font-openSans text-base placeholder:font-normal placeholder-[#545458b3] bg-white m-2 outline-none"
        />
      </div>
      {error && (
        <div className="text-red-500 font-openSans font-normal text-base text-left ">
          {error}
        </div>
      )}
    </div>
  );
};

export default SocialInput;
