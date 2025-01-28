import ModalImage from "react-modal-image";

import PdfIcon from "../../assets/icons/pdf.png";
import { validateUrl } from "../../helper/utils";

const RenderMedia = ({ data }) => {
  const getImageNameFromURL = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };
  return (
    <div className="border-1 border-black flex gap-x-[40px] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 ">
      {data?.map((file, i) => {
        const fileName = getImageNameFromURL(file?.filename);
        return (
          <div
            key={i}
            className="bg-white mt-1  h-[148px] w-[148px] rounded-xl flex flex-col items-center justify-center gap-2 "
          >
            {file?.type?.includes("video") ? (
              <video
                controls
                className="h-[109px] w-[109px] object-cover rounded-[9px]"
              >
                <source
                  src={validateUrl(file?.filename)}
                  type="video/mp4"
                  // className="h-12 w-12 object-contain"
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
                  small={validateUrl(file?.filename)}
                  large={validateUrl(file?.filename)}
                  alt="image"
                  className="image-modal h-[109px] w-[109px] rounded-[9px]"
                />
              </div>
            ) : (
              <a
                href={validateUrl(file?.filename)}
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
                  className="object-contain h-[109px] w-[109px]"
                />
              </a>
            )}
            <p className="text-[18px] w-[100%] leading-[30px] font-normal text-[#101012] opacity-70 overflow-hidden text-ellipsis whitespace-nowrap">
              {fileName}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default RenderMedia;
