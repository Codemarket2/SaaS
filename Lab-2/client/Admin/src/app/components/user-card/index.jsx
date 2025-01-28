// UserCard.jsx
import React from "react";
import { FiEdit3 } from "react-icons/fi";

import Label from "../label";
import Button from "../button";
import deleteIcon from "../../assets/icons/delete.png";

const UserCard = ({
  user,
  onPressButton,
  onPresDelete,
  onPressEdit,
  onClickUser,
  changeStatus,
}) => {
  const { fullName, role, isActive } = user;

  return (
    <div
      onClick={onClickUser}
      className="bg-white p-4 rounded-lg shadow border flex flex-col items-center"
    >
      <div className="justify-end flex flex-row items-center w-full">
        <img
          onClick={(event) => {
            event.stopPropagation();
            onPresDelete && onPresDelete();
          }}
          src={deleteIcon} // Replace with user.image if available
          alt={`delete-icon`}
          className="w-[20px] h-[18px] mr-2"
        />
        <FiEdit3
          onClick={(event) => {
            event.stopPropagation();
            onPressEdit && onPressEdit();
          }}
          className="!text-[#6F6F6F] w-[20px] h-[20px]"
        />
      </div>
      <img
        src="https://via.placeholder.com/80" // Replace with user.image if available
        alt={`${fullName}'s profile`}
        className="rounded-full w-20 h-20 mb-2"
      />
      <Label
        label={`${fullName}`}
        variant="xl"
        weight="medium"
        className="text-[#0A1106] !font-openSans"
      />
      <Label
        label={`Role: ${role}`}
        variant="base"
        weight="normal"
        className="text-[#696969] !font-openSans mb-2"
      />
      <div onClick={(e) => e.stopPropagation()}>
        <Button
          onClick={() => changeStatus()}
          buttonclassName={`w-full !font-openSans !font-semibold ${
            isActive
              ? "!bg-[#080707] hover:border-[#080707]"
              : "!bg-[#5AA338] hover:border-[#5AA338]"
          }`}
        >
          {isActive ? "Deactivate User" : "Reactivate User"}
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
