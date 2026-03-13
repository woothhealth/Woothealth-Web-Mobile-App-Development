"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import 'react-day-picker/dist/style.css'

export default function DatePicker() {
  const [selected, setSelected] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">
        Select Date
      </label>

      {/* Input Field */}
      <input
        readOnly
        onClick={() => setOpen(!open)}
        value={selected ? format(selected, "EEE, dd MMM yyyy") : ""}
        placeholder="Mon, 22 Dec"
        className="w-full border rounded-lg p-3 cursor-pointer"
      />

      {/* Calendar Popover */}
      {open && (
        <div className="absolute mt-2 bg-white shadow-xl rounded-xl p-4 z-50 w-full">
          <DayPicker
              mode="single"
              selected={selected}
              onSelect={(date) => {
                setSelected(date);
                setOpen(false);
              }}
              showOutsideDays
              disabled={[{ before: new Date() }, new Date(2026, 2, 15)]}
              classNames={{
                months: "flex justify-center w-full",
                month: "space-y-4 w-full",
                caption: "flex justify-between items-center font-semibold",
                nav_button: "p-2 hover:bg-gray-100 rounded",
                table: "w-full border-collapse",
                head_row: "flex w-full",
                head_cell: "w-8 text-center text-gray-500 text-sm",
                row: "flex w-full mt-2",
                cell: "w-8 h-8 text-center",
                day: "w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-100",
                day_selected: "bg-blue-500 text-white",
                day_today: "border border-blue-500",
              }}
          />
        </div>
      )}
    </div>
  );
}