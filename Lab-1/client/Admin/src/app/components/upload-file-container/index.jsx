/**
 * UploadFileContainer
 */
import React, { useEffect, useRef, useState } from "react";
import UploadIcon from "../../assets/icons/upload.png";
import PdfIcon from "../../assets/icons/pdf.png";
import { fileToBase64 } from "../../helper/utils";
import ModalImage from "react-modal-image";

const UploadFileContainer = ({
  title,
  description,
  containerClass,
  acceptType,
  onChange,
  limit,
  selectedFiles,
  error,
}) => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFiles(selectedFiles);
  }, [selectedFiles]);

  const handleClick = () => {
    if (files?.length >= limit) {
      alert(`Max ${limit} ${limit > 1 ? "files are" : "file is"} allowed.`);
    } else {
      fileInputRef.current.click();
    }
    // Trigger the file input click to open the file picker
  };

  const getBase64 = async (file) => {
    const fileData = await fileToBase64(file);
    return fileData;
  };

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    const newFiles = await Promise.all(
      selectedFiles?.map(async (file) => {
        const base64 = await getBase64(file); // Wait for the base64 data to be ready
        return {
          name: file.name,
          url: URL.createObjectURL(file), // Create object URL for rendering
          type: file.type, // File type (MIME type)
          base64: base64, // Use the resolved base64 data
        };
      })
    );

    onChange([...files, ...newFiles].slice(0, limit));
    setFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, limit));
  };

  const handleRemoveFile = (index) => {
    const newSelectedImages = [...files];
    newSelectedImages.splice(index, 1);
    onChange(newSelectedImages);
    setFiles(newSelectedImages);
  };

  return (
    <div className={`flex flex-col text-base ${containerClass}`}>
      {title && (
        <label className="block text-[#101012] font-openSans text-base font-normal mb-2">
          {title}
        </label>
      )}
      <div className="flex flex-col items-center justify-center border border-[#00000021] rounded-lg min-h-24  text-center text-gray-500 px-2 ">
        {/* Render selected PDF files */}
        <div
          className={`flex gap-2 ${
            files?.length > 0 ? "my-4" : ""
          } overflow-x-auto w-full`}
        >
          {files?.map((file, index) => {
            return (
              <div
                key={index}
                className="flex relative bg-white shadow  m-1  h-[100px] w-[100px] rounded-xl  flex-col items-center justify-center gap-2"
              >
                {file?.type?.includes("video") ? (
                  <video controls className="h-12 w-12 object-cover">
                    <source
                      src={file.url}
                      type="video/mp4"
                      className="h-12 w-12 object-cover"
                    />
                  </video>
                ) : file?.type?.includes("image") ? (
                  <div
                    style={{
                      flex: 1 / 3,
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <ModalImage
                      small={file.base64 ?? file.base64}
                      large={file.base64 ?? file.base64}
                      alt=""
                      className="image-modal h-12 w-12 object-contain"
                    />
                  </div>
                ) : (
                  <a
                    href={file.base64}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontWeight: 400,
                      lineHeight: "15px",
                      fontSize: "12px",
                      fontFamily: "Poppins",
                    }}
                  >
                    <img
                      src={PdfIcon}
                      className="h-12 w-12   object-contain"
                      // style={{ width: "56px", height: "40px" }}
                    />
                  </a>
                )}
                <p className="text-[12px] w-[80%] font-normal text-[#000] overflow-hidden text-ellipsis whitespace-nowrap">
                  {file?.name}
                </p>
                <div
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-0 flex right-0 bg-red-500 text-white rounded-full h-[18px] w-[18px] justify-center items-center text-[10px]"
                >
                  <span className="font-poppins">X</span>
                </div>
              </div>
            );
          })}
        </div>
        <div onClick={handleClick}>
          <div className="flex flex-row">
            <img src={UploadIcon} className="h-6 pr-2" />
            <span className="font-medium text-[#888888] text-[12px] font-openSans">
              {description}
            </span>
          </div>
          <p className="text-[8px] text-[#263238] mt-2 font-normal font-poppins">
            File types supported: PDF. Max size: 12 MB
          </p>
        </div>
      </div>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: "none" }}
        accept={acceptType} // Limit file type
        onChange={handleFileChange}
        className="font-openSans"
      />
      {error && (
        <div className="text-red-500 font-openSans font-normal text-base text-left ">
          {error}
        </div>
      )}
    </div>
  );
};

export default UploadFileContainer;
