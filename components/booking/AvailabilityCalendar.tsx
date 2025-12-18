"use client";

import { addYears, format, parseISO } from "date-fns";

type AvailabilityCalendarProps = {
  selectedDate: string | null;
  onChange: (isoDate: string) => void;
  blockedDates?: string[];
};

function todayISO() {
  const now = new Date();
  return format(now, "yyyy-MM-dd");
}

function maxDateISO() {
  const now = new Date();
  const max = addYears(now, 2); // up to 2 years from today
  return format(max, "yyyy-MM-dd");
}

export function AvailabilityCalendar({
  selectedDate,
  onChange,
}: AvailabilityCalendarProps) {
  const minDate = todayISO();
  const maxDate = maxDateISO();

  let displayDate = "Choose a date";
  if (selectedDate && selectedDate.length === 10) {
    try {
      displayDate = format(parseISO(selectedDate), "d MMM yyyy");
    } catch {
      displayDate = "Choose a date";
    }
  }

  return (
    <div className="space-y-1">
      <label className="block text-[0.78rem] font-medium text-sb-ink/80">
        Preferred tour date*
      </label>
      <input
        type="date"
        required
        value={selectedDate ?? ""}
        min={minDate}
        max={maxDate}
        onChange={(e) => {
          const value = e.target.value;
          if (!value) {
            onChange("");
            return;
          }
          // Clamp so we never accept old dates
          if (value < minDate) {
            onChange(minDate);
          } else if (value > maxDate) {
            onChange(maxDate);
          } else {
            onChange(value);
          }
        }}
        className="w-full rounded-md border border-sb-mist/80 bg-sb-shell/60 px-2 py-1.5 text-[0.78rem] focus:border-sb-lagoon focus:outline-none focus:ring-1 focus:ring-sb-lagoon/70"
      />
    </div>
  );
}
