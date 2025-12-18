import fs from "fs/promises";
import path from "path";

const BOOKINGS_PATH = path.join(process.cwd(), "data", "bookings.json");

// Date fields in priority order - standard field first, then type-specific, then alternatives
// Based on actual bookings.json structure: uses "date" as the standard field
// Adjust this list to match real keys in bookings.json
const DATE_KEYS = [
  "date", // Standard field used by both tours and packages
  "tourDate",
  "packageDate",
  "preferredDate",
  "bookingDate",
] as const;

export type AdminBooking = Record<string, any> & {
  id?: string;
};

export async function readAllBookings(): Promise<AdminBooking[]> {
  try {
    const raw = await fs.readFile(BOOKINGS_PATH, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch {
    return [];
  }
}

export function getBookingDate(b: AdminBooking): Date | null {
  let raw: string | undefined | null = null;

  for (const key of DATE_KEYS) {
    const value = (b as any)[key];
    if (value && typeof value === "string" && value.trim()) {
      raw = value.trim();
      break;
    }
  }

  if (!raw) return null;

  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;

  d.setHours(0, 0, 0, 0);
  return d;
}

export function splitBookingsByDate(bookings: AdminBooking[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming: AdminBooking[] = [];
  const completed: AdminBooking[] = [];

  for (const b of bookings) {
    const d = getBookingDate(b);
    if (!d) continue;

    if (d >= today) {
      upcoming.push(b);
    } else {
      completed.push(b);
    }
  }

  return { upcoming, completed };
}

export function sortBookingsByDate(bookings: AdminBooking[]) {
  return [...bookings].sort((a, b) => {
    const da = getBookingDate(a)?.getTime() ?? 0;
    const db = getBookingDate(b)?.getTime() ?? 0;
    return da - db;
  });
}

