"use client";

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa6";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import Toggle from "@/UI/Toggle";

interface DashboardHeaderProps {
  userId: string;
  firstName: string;
  lastName: string;
}

const Welcome = ({
  userId,
  firstName,
  lastName,
}: DashboardHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const formattedLastName =
  lastName && lastName.length > 5
    ? `${lastName.slice(0, 3)}.`
    : lastName;


  return (
    <section>
      <div className="flex justify-between items-center px-4 md:px-6 py-4 bg-white border-b border-[#D9D9D9]">
        <div className="flex items-center gap-2 text-[20px]">
          <div className="block lg:hidden">
            {!menuOpen ? (
              <HiOutlineMenuAlt2
                className="text-3xl cursor-pointer"
                onClick={() => setMenuOpen(true)}
              />
            ) : (
              <IoCloseOutline
                className="text-3xl cursor-pointer"
                onClick={() => setMenuOpen(false)}
              />
            )}
          </div>
          <h2 className="font-bold">PROFILE</h2>
        </div>

        <div className="flex gap-2 md:gap-5 items-center">
          <div className="relative border rounded-full p-1">
            <FaRegBell className="text-[18px]" />
            <div className="absolute right-0 top-0 p-1 bg-red-500 rounded-full" />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center text-white font-bold">
              {firstName[0]}
              {lastName[0]}
            </div>

            <div className="leading-4 hidden md:block">
              <h3 className="font-bold">
                  {firstName || "Not"} {formattedLastName || "Found"}
              </h3>
              <p className="text-[14px]">ID: <span className="font-semibold text-[15px]">{userId}</span></p>
            </div>

            <FaChevronDown />
          </div>
        </div>
      </div>

      <Toggle isOpen={menuOpen} />
    </section>
  );
};

export default Welcome;