"use client";

import React, { useState } from "react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import Toggle from "@/app/(Dashboard)/dashboard/(business)/BusinessToggle";
import NotificationCenter from "../../../UIs/NotificationCenter";
import UserDropdown from "../../../UIs/UserDropdown";

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
  id,
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
          <h2 className="font-bold">WALLET</h2>
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
                ID: <span className="font-semibold text-[15px]">{id}</span>
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

      <Toggle isOpen={menuOpen} />
    </section>
  );
}
