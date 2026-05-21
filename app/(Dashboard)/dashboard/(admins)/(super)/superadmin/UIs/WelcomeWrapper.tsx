"use client";

import React, { useState } from "react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoCloseOutline, IoSearchSharp } from "react-icons/io5";
import NotificationCenter from "./NotificationCenter";
import UserDropdown from "./UserDropdown";
import AdminToggle from "@/app/(Dashboard)/dashboard/(admins)/(super)/AdminToggle";

interface WelcomeWrapperProps {
  firstName: string;
  lastName: string;
  displayLastName: string;
  initials: string;
  role: string;
  id: string;
  email?: string;
}

export default function WelcomeWrapper({
  firstName,
  lastName,
  displayLastName,
  initials,
  role,
  email = "user@example.com",
}: WelcomeWrapperProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="relative">
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
            <form className="hidden lg:flex border border-[#D9D9D9] rounded-full px-1 py-1.5 space-x-2 items-center w-120 justify-between">
              <input type="text" placeholder="Search enrollees, providers, PA codes, clients..." className="w-90 placeholder:text-sm outline-0 border-0 px-2 text-[15px]" />
              <button className="bg-[#49A5EF] rounded-full p-1.5 text-[#ffffff] text-[16px]">
                <IoSearchSharp />
              </button>
            </form>
            <h3 className="block md:hidden font-semibold">
              ADMIN
            </h3>
          
        </div>

        {/* Right side: notifications and user info */}
        <div className="flex gap-2 md:gap-5 items-center">
          {/* Notifications */}
          <NotificationCenter />

          {/* User info */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center text-white font-bold">
              {initials}
            </div>

            <div className="leading-4 hidden md:block">
              <h3 className="font-bold">
                {firstName} {displayLastName}
              </h3>
              <p className="text-[14px]">
                {role}
              </p>
            </div>

            {/* User Dropdown */}
            <UserDropdown
              firstName={firstName}
              lastName={lastName}
              email={email}
            />
          </div>
        </div>
      </div>

      <AdminToggle isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </section>
  );
}
