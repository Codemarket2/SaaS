import Modal from "../modal";
import Label from "../label";
import CrossImg from "../../assets/icons/cross-black.png";
import LocationImg from "../../assets/icons/location.png";
import MailFilledImg from "../../assets/icons/mail-filled.png";
import PhoneImg from "../../assets/icons/phone.png";
import InstagramImg from "../../assets/icons/instagram.png";
import FacebookImg from "../../assets/icons/facebook.png";
import TiktokImg from "../../assets/icons/tiktok.png";

const ContactPopup = ({ setOpen, isOpen }) => {
  return (
    <Modal
      isOpen={isOpen}
      bgClasssName={`!p-0`}
      containerClass={`!backdrop-blur-[12px]`}
    >
      <div className="sm:w-full md:w-[424px] bg-white rounded-3xl">
        <div className="border-b border-b-[#ECECEC] pb-[30px] w-full  flex justify-between items-center pt-[30px] pr-[21px]  pl-[17px]">
          <Label
            weight="bold"
            variant="[20px]"
            className="leading-[26px] !font-poppins text-[#101012]"
            label={`Contact info`}
          />
          <img
            onClick={() => setOpen(false)}
            src={CrossImg}
            alt="cross"
            className="h-[15px] max-h-[15px] cursor-pointer"
          />
        </div>
        <div className="pt-[24px] pr-[21px] pb-[26px] pl-[19px]">
          <div className="flex gap-x-3 border-b border-b-[#ECECEC] pb-[16px]">
            <div className="h-[33px] w-[33px] bg-[#DFE9FF] flex items-center justify-center rounded-full">
              <img
                src={LocationImg}
                alt="cross"
                className="h-[20px] max-h-[20px] "
              />
            </div>
            <div className="">
              <Label
                weight="normal"
                variant="[16px]"
                className="leading-[22px] text-[#101012]"
                label={`Centropod@Changi 80,`}
              />
              <Label
                weight="normal"
                variant="[16px]"
                className="leading-[22px] text-[#101012]"
                label={`Changi Rd, #02-05`}
              />
              <Label
                weight="normal"
                variant="[16px]"
                className="leading-[22px] text-[#101012]"
                label={`Singapore 419715`}
              />
              {/* <Label
                weight="normal"
                variant="[16px]"
                className="leading-[22px] text-[#101012]"
                label={`SGP`}
              /> */}
            </div>
          </div>
          <div className="flex border-b border-b-[#ECECEC] py-[17px] items-center gap-x-3">
            <div className="h-[33px] w-[33px] bg-[#DFE9FF] flex items-center justify-center rounded-full">
              <img src={PhoneImg} alt="cross" className="h-[20px]" />
            </div>
            <Label
              label={`+6588577520`}
              variant="[16px]"
              weight="normal"
              className="text-[#101012] leading-[22px]"
            />
          </div>
          <div className="flex pt-[17px] items-center gap-x-3">
            <div className="h-[33px] w-[33px] bg-[#DFE9FF] flex items-center justify-center rounded-full">
              <img src={MailFilledImg} alt="cross" className="h-[20px]" />
            </div>
            <Label
              label={`bid.renopalsg@gmail.com`}
              variant="[16px]"
              weight="normal"
              className="text-[#101012] leading-[22px]"
            />
          </div>
          <div className="flex mt-[30px] items-center  justify-center gap-x-3">
            <div className="h-[33px] w-[33px] bg-[#DFE9FF] flex items-center justify-center rounded-full">
              <a href="https://www.instagram.com/renopal_sg" target="_blank">
                <img
                  src={InstagramImg}
                  alt="instagram"
                  className="h-full w-full rounded-full"
                />
              </a>
            </div>
            <div className="h-[33px] w-[33px] bg-[#DFE9FF] flex items-center justify-center rounded-full">
              <a href="https://www.tiktok.com/@renopalsgg" target="_blank">
                <img
                  src={TiktokImg}
                  alt="tittok"
                  className="h-full w-full  rounded-full"
                />
              </a>
            </div>
            <div className="h-[33px] w-[33px] bg-[#DFE9FF] flex items-center justify-center rounded-full">
              <a
                href="https://www.facebook.com/share/1Xu9ZehygS/?mibextid=wwXIfr"
                target="_blank"
              >
                <img
                  src={FacebookImg}
                  alt="fb"
                  className="h-full w-full rounded-full"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ContactPopup;
