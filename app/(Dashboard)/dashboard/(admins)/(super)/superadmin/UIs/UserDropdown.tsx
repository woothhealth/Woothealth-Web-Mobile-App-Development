"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { IoMdSettings as IoSettings } from "react-icons/io";
import Link from "next/link";
import LogoutButton from "@/UI/LogOut";

interface UserDropdownProps {
  firstName: string;
  lastName: string;
  email?: string;
}

export default function UserDropdown({
  firstName,
  lastName,
  email = "user@example.com",
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition"
      >
        <FaChevronDown className={`transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-8 w-50 bg-white border border-gray-200 rounded-lg shadow-lg z-40 overflow-hidden">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-[#333333]">
              {firstName} {lastName}
            </p>
            <p className="text-sm wrap-break-word text-[#333333]">{email}</p>
          </div>

          <div className="py-2">
            <Link href="/dashboard/superadmin/profile">
              <div className="px-4 py-2 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition">
                <FaUserAlt className="text-gray-600" />
                <span className="text-gray-700">Profile</span>
              </div>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-300">
            <div className="flex items-center gap-3 hover:bg-red-50 cursor-pointer transition rounded">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
