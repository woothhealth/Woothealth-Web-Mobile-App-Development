"use client";

import React, { useState } from "react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";

export default function MenuToggle() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
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
  );
}
