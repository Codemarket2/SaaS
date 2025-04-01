/**
 * Modal component
 */
import React, { useState } from "react";

import AppLogo from "../../assets/icons/logo.png";
import Button from "../button";
import Label from "../label/index";
import { useLocation, useNavigate } from "react-router-dom";
import { store } from "../../redux/store";
import ContactPopup from "../contactUs";

const LogoHeader = ({
  showButton = false,
  headerContainerClass,
  goToSearch,
  openContactPopup,
  headerChildDiv,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isWelcomePage = location.pathname === "/welcome";
  const isCompanyDetails = location.pathname === "/companyDetails";
  const isAboutPage = location.pathname === "/about";
  const token = store.getState().authSlice.token;
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div
      className={`h-[90px] flex items-center justify-center sm:px-2 z-10 ${headerContainerClass}`}
      style={{ width: "100vw" }}
    >
      <div
        className={`max-w-site flex flex-row justify-between w-full items-center ${headerChildDiv}`}
      >
        <img
          onClick={() => navigate("/welcome")}
          src={AppLogo}
          className="h-16 w-36 object-contain cursor-pointer"
        />
        {/* {token && (
          <Button
            onClick={() => {
              navigate(`/`);
            }}
            type="button"
            buttonclassName={
              "hover:border-[#294890]  !h-[47px] !rounded-xl !shadow-sm !shadow-[#294890]"
            }
          >
            {"My Projects"}
          </Button>
        )} */}
        <div className="flex flex-1">
          {(isWelcomePage || isCompanyDetails || isAboutPage) && (
            <Button
              onClick={() =>
                !token
                  ? navigate(`/signin`, {
                      state: {
                        role: "customer",
                      },
                    })
                  : navigate("/create-project")
              }
              buttonclassName={`!bg-transparent  !hover:border-none !border-transparent sm:text-[12px] md:text-[16px] font-medium !font-poppins ${
                isWelcomePage || isAboutPage
                  ? "!text-[#fff]"
                  : "!text-[#333333]"
              }`}
            >{`Post a Project`}</Button>
          )}
          {(isWelcomePage || isAboutPage) && (
            <Button
              onClick={() => goToSearch()}
              buttonclassName={`bg-transparent !hover:border-none !border-transparent sm:text-[12px] md:text-[16px] font-medium !font-poppins ${
                isWelcomePage || isAboutPage
                  ? "!text-[#fff]"
                  : "!text-[#333333]"
              }`}
            >
              {`Search Contractors`}
            </Button>
          )}
          {(isWelcomePage || isCompanyDetails || isAboutPage) && (
            <>
              <Button
                onClick={() => {
                  navigate(`/about`);
                }}
                type="button"
                buttonclassName={`hover:border-transparent font-medium !bg-transparent  !rounded-none !shadow-none !shadow-transparent sm:text-[12px] md:text-[16px] ${
                  isWelcomePage || isAboutPage
                    ? "!text-[#fff]"
                    : "!text-[#333333]"
                }`}
              >
                {"About Us"}
              </Button>
              {/* <Button
                // onClick={() => {
                //   navigate(`/chooseLoginOption`, {
                //     state: {
                  //       action: "signup",
                  //     },
                //   });
                // }}
                onClick={() => goToWork()}
                type="button"
                buttonclassName={`hover:border-transparent font-medium !bg-transparent sm:text-[12px] !rounded-none !shadow-none !shadow-transparent md:text-[16px] ${
                  isWelcomePage ? "!text-[#333333]" : "!text-[#333333]"
                }`}
              >
                {"How it Works"}
              </Button> */}
            </>
          )}
          {(isWelcomePage || isCompanyDetails || isAboutPage) && (
            <Button
              onClick={() => setContactOpen(true)}
              buttonclassName={`bg-transparent !hover:border-none !border-transparent sm:text-[12px] md:text-[16px] !font-poppins font-medium ${
                isWelcomePage || isAboutPage
                  ? "!text-[#fff]"
                  : "!text-[#333333]"
              }`}
            >
              {`Contact Us`}
            </Button>
          )}
        </div>
        {showButton && !token && (
          <div className="flex gap-x-1">
            <Button
              onClick={() => {
                navigate(`/signUpOption`, {
                  state: {
                    role: "customer",
                  },
                });
              }}
              type="submit"
              buttonclassName={`hover:border-transparent font-medium w-[126px] !bg-transparent !h-[47px] !rounded-none !shadow-none !shadow-transparent sm:text-[12px] md:text-[16px] !font-poppins ${
                isWelcomePage || isAboutPage
                  ? "!text-[#fff]"
                  : "!text-[#333333]"
              }`}
            >
              {"Sign Up"}
            </Button>
            <Button
              onClick={() => {
                navigate(`/signin`, {
                  state: {
                    role: "customer",
                  },
                });
              }}
              type="submit"
              buttonclassName={
                "hover:border-[#294890] !font-poppins w-[126px] !h-[47px] !rounded-xl !shadow-sm !shadow-[#294890]"
              }
            >
              {"Login"}
            </Button>
          </div>
        )}
      </div>
      <ContactPopup isOpen={contactOpen} setOpen={setContactOpen} />
    </div>
  );
};

export default LogoHeader;
