/**
 * NotificationCard
 */

import moment from "moment";
import React from "react";
import { AiOutlineRight } from "react-icons/ai";

import Label from "../label";

const NotificationCard = ({
  notification,
  onClick,
  showSearch,
  isLoading,
  selectednotification,
}) => {
  // Function to get the initials from a name
  const getInitials = (name) => {
    const initials = name
      ?.split(" ")
      ?.map((n) => n[0]?.toUpperCase())
      ?.join("");
    return initials;
  };

  // Custom Avatar Component
  const InitialsAvatar = (name, color = "bg-orange-500", size = "40") => {
    return (
      <div
        className={`flex items-center justify-center rounded-full text-white font-normal font-poppins text-base ${color}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {getInitials(name)}
      </div>
    );
  };

  return (
    <div
      onClick={() => onClick && onClick()}
      className={`flex flex-row items-center justify-between font-openSans font-medium  p-4 border-b border-b-[#DDDDDD]`}
    >
      <div className="flex flex-row items-center">
        {notification?.sender?.profilePic ? (
          <img
            src={notification?.sender?.profilePic}
            alt="Description of image"
            className="rounded-full mr-3"
            style={{ width: `${40}px`, height: `${40}px` }}
          />
        ) : (
          InitialsAvatar(notification?.sender?.senderName, "bg-orange-500 mr-3")
        )}
        <div>
          {showSearch && (
            <Label
              label={notification?.sender?.senderName}
              className={`!mb-0 "text-[13px] text[#222529]`}
            />
          )}
          <Label
            label={notification?.message}
            className={`!mb-0 text-base  text-[#717171] font-normal`}
          />
          <Label
            label={`${
              showSearch
                ? moment(notification?.createdAt).format("dddd MM,YYYY")
                : moment(notification?.createdAt).fromNow()
            }`}
            className={`!mb-0  text-base text-[#717171] font-normal`}
          />
        </div>
      </div>

      <div className="flex flex-row items-center">
        {showSearch && !notification?.isRead && (
          <div className="w-[8px] h-[8px] bg-[#FC3903] rounded-full mr-5"></div>
        )}
        {isLoading && selectednotification?._id === notification?._id && (
          <div className="  rounded-2xl mr-5 border-black border px-2 items-center justify-center">
            <Label
              className="text-[10px] text-[#717171] font-normal"
              label={"loading..."}
              variant="[12px]"
            ></Label>
          </div>
        )}
        {showSearch && <AiOutlineRight />}
      </div>
    </div>
  );
};

export default NotificationCard;
