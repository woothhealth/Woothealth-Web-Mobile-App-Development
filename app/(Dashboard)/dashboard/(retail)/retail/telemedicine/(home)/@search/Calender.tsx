"use client";

export default function Calendar({
  onSelect,
}: {
  onSelect: (date: Date) => void;
}) {
  const today = new Date();
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {days.map((day) => (
          <button
            key={day}
            onClick={() =>
              onSelect(new Date(today.getFullYear(), today.getMonth(), day))
            }
            className="hover:bg-blue-500 hover:text-white rounded-full w-8 h-8 flex items-center justify-center"
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}
