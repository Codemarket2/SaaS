import { useState } from "react";
import moment from "moment";
import { FaPlus } from "react-icons/fa6";

import RenderMedia from "../render-media";
import ExtraMediaUpload from "../extra-media";
import Label from "../label";
import Modal from "../../components/modal";
import ProjectImg from "../../assets/icons/projectjd.png";
import { validateUrl } from "../../helper/utils";

const MileStone = ({ projectDetails, milestone, i, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <div>
        <div className="flex items-center justify-between gap-x-1">
          <div className="w-[70%]">
            <div className="">
              <Label
                variant="[12px]"
                className="leading-[14px] text-[#AFAFAF]"
                weight="medium"
                label={`Job ${i + 1}`}
              />
            </div>
            {milestone?.title && (
              <Label
                className="text-[#333333] leading-[19px] mt-1 line-clamp-1 break-words break-all whitespace-normal"
                weight="semibold"
                variant="[16px]"
                label={milestone?.title}
              />
            )}
            <div className="flex  items-center gap-1 mt-2">
              <Label
                className="text-[#AFAFAF] leading-[14px] mt-1"
                weight="normal"
                variant="[12px]"
                label={`${moment(milestone?.startDate)?.format(
                  "DD-MM-YYYY"
                )} - `}
              />

              <Label
                className="text-[#AFAFAF] leading-[14px] mt-1"
                weight="normal"
                variant="[12px]"
                label={moment(milestone?.endDate)?.format("DD-MM-YYYY")}
              />
            </div>
          </div>

          <a
            onClick={() => setIsModalOpen(true)}
            className="font-semibold text-[16px] leading-[19px] text-[#294890] cursor-pointer  place-self-end"
          >{`View Details`}</a>
        </div>
        <div className="w-[100%] mt-[14px]">
          <Label
            className={`leading-[14px] ${
              milestone?.status === 1
                ? `text-[#fb5a5a]`
                : milestone?.status === 2
                ? "text-[#D4A317]"
                : "text-[#8ACD55]"
            }`}
            label={
              milestone?.status === 1
                ? `Pending`
                : milestone?.status === 2
                ? "Ongoing"
                : "Completed"
            }
            variant="[12px]"
            weight="semibold"
          />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        bgClasssName={`!bg-[#F5F5F5] !min-w-[80vw] !max-h-[80vh] overflow-y-scroll`}
      >
        <div>
          <div className="">
            <div className="flex justify-between">
              <Label
                className="text-[#333333] leading-[29px] "
                weight="semibold"
                variant="[24px]"
                label={`Job ${i + 1} Details`}
              />
              <FaPlus
                onClick={() => setIsModalOpen(false)}
                className="text-[24px] rotate-45 cursor-pointer"
              />
            </div>
            <div className="flex flex-col md:flex-row w-full gap-x-3 mt-[43px]">
              <div className="flex flex-col w-full md:w-[60%]  py-[36px] sm:py-[72px] gap-y-3">
                <div className=" bg-[#fff] pl-[23px] pr-[26px] pb-[17px] relative rounded-[26px]">
                  <div className="sm:h-[144px] sm:w-[144px] w-[72px] h-[72px] bg-[#002B5B] border border-[#EFEFEF] rounded-full flex justify-center items-center absolute top-[-36px] sm:top-[-72px]">
                    <img
                      src={
                        projectDetails?.Client?.profilePhoto
                          ? validateUrl(projectDetails?.Client?.profilePhoto)
                          : ProjectImg
                      }
                      alt="Reno"
                      className={`${
                        projectDetails?.Client?.profilePhoto
                          ? "h-full w-full rounded-full flex"
                          : "sm:h-[66px] h-[33px]"
                      }`}
                    />
                  </div>
                  <div className="">
                    {milestone?.title && (
                      <Label
                        className="text-[#333333] leading-[29px] mt-[109px] whitespace-normal break-all break-words"
                        weight="semibold"
                        variant="[24px]"
                        label={milestone?.title}
                      />
                    )}
                    {milestone?.description && (
                      <Label
                        className="text-[#101012] leading-[30px] mt-[18px] opacity-70 whitespace-normal break-all break-words"
                        weight="normal"
                        variant="[18px]"
                        label={milestone?.description}
                      />
                    )}
                    {milestone?.amount && (
                      <div className="flex justify-between  mt-[48px] border-t border-t-[#00000021]">
                        <Label
                          className="!text-[#101012] leading-[31px] mt-[18px]  line-clamp-2 !opacity-70"
                          variant="[18px]"
                          weight="normal"
                          label={"Total Project Cost:"}
                        />
                        <Label
                          className=" leading-[29px] mt-[18px] text-[#294890]"
                          weight="semibold"
                          variant="[24px]"
                          label={`$${milestone?.amount}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-[#fff] pl-[23px] pr-[26px] pb-[17px] relative rounded-[26px]">
                  {milestone?.MilestoneExtraMedia?.length > 0 && (
                    <div className="mt-3">
                      <Label
                        className="text-[#333333] leading-[29px] mb-[39px]"
                        weight="semibold"
                        variant="[24px]"
                        label={"Attachments Uploaded"}
                      />
                      <div className="mt-5">
                        {milestone?.MilestoneExtraMedia?.map((item, i) => {
                          return (
                            <div key={i} className="mt-2">
                              <h2 className="text-[16px] !font-poppins font-normal text-[#000] whitespace-normal break-words break-all mb-0">
                                {item?.title}
                              </h2>
                              <RenderMedia data={item?.extraMedia} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="py-[31px] w-full md:w-[38%] h-full rounded-[26px] flex flex-col gap-y-3">
                <div className="bg-[#fff] w-full rounded-[26px] py-[27px] px-[20px]">
                  <Label
                    className="text-[#333333] leading-[29px] "
                    weight="semibold"
                    variant="[22px]"
                    label={"Timeline"}
                  />
                  <div className="flex mt-[20px]">
                    <div className="flex flex-col items-center">
                      <div className="min-h-[19px] min-w-[19px] bg-[#8ACD55] rounded-full"></div>
                      <div className="border-l-2 border-dashed border-l-[#8ACD55] h-full"></div>
                      <div className="min-h-[19px] min-w-[19px] bg-[#F2F2F2] rounded-full"></div>
                    </div>
                    <div className="ml-[20px]">
                      <div className="">
                        <Label
                          className="text-[#AFAFAF] leading-[14px] "
                          weight="medium"
                          variant="[12px]"
                          label={`Start Date`}
                        />
                        <Label
                          className="text-[#333333] leading-[19px] mt-1"
                          weight="semibold"
                          variant="[16px]"
                          label={moment(milestone?.endDate)?.format(
                            "DD-MM-YYYY"
                          )}
                        />
                      </div>
                      <div className="mt-[30px]">
                        <Label
                          className="text-[#AFAFAF] leading-[14px] "
                          weight="medium"
                          variant="[12px]"
                          label={"End Date"}
                        />
                        <Label
                          className="text-[#333333] leading-[19px] mt-1"
                          weight="semibold"
                          variant="[16px]"
                          label={moment(milestone?.endDate)?.format(
                            "DD-MM-YYYY"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#fff] w-full rounded-[26px] py-[27px] px-[20px]">
                  <Label
                    className="text-[#333333] leading-[29px] mb-[39px]"
                    weight="semibold"
                    variant="[22px]"
                    label={"New Attachment"}
                  />
                  <ExtraMediaUpload
                    data={milestone}
                    onRefresh={() => onRefresh()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MileStone;
