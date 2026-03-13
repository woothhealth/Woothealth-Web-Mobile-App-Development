"use client";

import { useState, useRef, useEffect } from "react";

export default function CustomSelect({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: any) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-sm font-medium mb-2">{label}</label>

      <div
        onClick={() => setOpen(!open)}
        className="border rounded-lg p-3 cursor-pointer flex justify-between"
      >
        {selected}
        <span>⌄</span>
      </div>

      {open && (
        <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg z-50">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
              className="p-3 hover:bg-blue-100 cursor-pointer"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}