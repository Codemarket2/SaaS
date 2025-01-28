import { useNavigate } from "react-router-dom";
import { MdNotificationsActive } from "react-icons/md";
import { BiMessageDetail, BiDotsVerticalRounded } from "react-icons/bi";

// import arrowImg from "../../assets/icons/arrow-down.png";
import { useAppSelector } from "../../redux/hooks";
import DotsIcon from "../../assets/icons/dots.png";
// import { baseUrl } from "../../constants";
import Label from "../label";

const ProjectCard = ({ job }) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => {
    return state.authSlice.admin;
  });
  const handleOpenJob = (jobId) => {
    navigate("/jobDetails", {
      state: { jobId },
    });
  };

  const handleNotification = () => {
    navigate("/alerts");
  };
  return (
    <div
      key={job?.id}
      className="!font-openSans bg-[#fff] shadow-md md:p-[30px] sm:p-[20px]  items-center rounded-[18px] cursor-pointer overflow-hidden"
    >
      {/* <img
        src={`${baseUrl}/${user?.profilePhoto}`}
        alt=""
        className="h-[90px] w-[90px] object-cover rounded-[18px] shadow self-start"
      /> */}
      {/* <div className="flex items-center justify-between">
        <div className="flex gap-2.5">
          <Label
            label={"Category"}
            weight={"bold"}
            variant="[14px]"
            className="text-[#E94732] leading-[24px] py-[3px] px-[4px] md:px-[10px] bg-[#FEF6F2] rounded-[10px]"
          />

          <Label
            label={"Category"}
            weight={"bold"}
            variant="[14px]"
            className="text-[#32E944] leading-[24px] py-[3px] px-[4px] md:px-[10px] bg-[#F1FFF3] rounded-[10px]"
          />

          <Label
            label={"Category"}
            weight={"bold"}
            variant="[14px]"
            className="text-[#C432E9] leading-[24px] py-[3px] px-[4px] md:px-[10px] bg-[#FCF1FF] rounded-[10px]"
          />
        </div>
        <div className="flex sm:gap-1 md:gap-3">
          {<BiMessageDetail className="text-[22px]" />}
          <div className="relative">
            <MdNotificationsActive
              onClick={() => handleNotification()}
              className="text-[22px]"
            />
            <div className="bg-[#E94732] h-[21px] w-[21px] rounded-full grid place-items-center absolute bottom-[50%] left-[50%]">
              <Label
                label={"4"}
                variant="[14px]"
                weight="bold"
                className=" leading-[0px] text-[#FFFFFF]"
              />
            </div>
          </div>
          <BiDotsVerticalRounded className="text-[22px]" />
        </div>
      </div> */}
      <div
        onClick={() => {
          handleOpenJob(job?.id);
        }}
        className="flex flex-col w-full h-full"
      >
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-[20px] !font-poppins font-semibold text-[#333333] line-clamp-1">
            {job?.title}
          </h2>
          <div className="flex md:h-8 md:w-8 sm:h-6 sm:w-6 items-center justify-center rounded-full border border-[#E0E0E0]">
            <img
              src={DotsIcon}
              className="object-contain md:h-[15px] sm:h-[12px]"
            />
          </div>
        </div>
        <p className="text-[18px] h-[62px] font-normal leading-[31px] opacity-70 text-[#101012] line-clamp-2 whitespace-normal break-words break-all mt-[12px]">
          {job?.description}
        </p>

        <div className="border-b my-[26px] border-dashed border-[#00000038]"></div>

        <div className="flex justify-between">
          <div className="flex items-center gap-x-2">
            <Label
              variant="[18px]"
              weight="normal"
              label={"Total Project Cost:"}
              className="leading-[31px] !opacity-70 !text-[#101012]"
            />

            {/* <Label
              label="234"
              variant="[18px]"
              weight="bold"
              className="leading-[31px] text-[#101012]"
            /> */}
          </div>
          <Label
            weight="bold"
            variant="[22px]"
            label={`$${job?.amount ?? "0"}`}
            className="text-[#294890]"
          />
        </div>
      </div>
      {/* <img src={arrowImg} alt="arrow" className={`w-[10px] -rotate-90 `} /> */}
    </div>
  );
};

export default ProjectCard;
