"use client";

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa6";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import Toggle from "@/UI/Toggle";

// interface WelcomeProps {
//   userId?: string;       // optional to allow fallback
//   firstName?: string;
//   lastName?: string;
//   role?: string;
// }

const Welcome = (
//   {
//   userId = "Unknown",          // default ID
//   firstName = "User",          // default first name
//   lastName = "",               // default last name
//   role = "Guest",              // default role
// }: WelcomeProps
) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Generate initials safely
  // const initials =
    // (firstName?.[0] || "U") + (lastName?.[0] || "S");

  return (
    <section>
      {/* Header */}
      <div className="flex justify-between items-center px-4 md:px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2 text-[20px]">
          {/* Mobile menu toggle */}
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

        {/* Right side: notifications and user info */}
        <div className="flex gap-2 md:gap-5 items-center">
          {/* Notifications */}
          <div className="relative border rounded-full p-1">
            <FaRegBell className="text-[18px]" />
            <div className="absolute right-0 top-0 p-1 bg-red-500 rounded-full" />
          </div>

          {/* User info */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center text-white font-bold">
              {/* {initials} */}
              FA
            </div>

            <div className="leading-4 hidden md:block">
              <h3 className="font-bold">
                {/* {firstName} {lastName} */}
                Akpom David
              </h3>
              <p className="text-[14px]">
                ID: <span className="font-semibold text-[15px]">
                  {/* {userId} */}
                  12345678
                </span>
              </p>
              <p className="text-[12px] text-gray-500">
                {/* {role} */}
                Retail
              </p>
            </div>

            <FaChevronDown />
          </div>
        </div>
      </div>

      {/* Toggle menu */}
      <Toggle isOpen={menuOpen} />
    </section>
  );
};

export default Welcome;