// lib/data/bookings.ts

import fs from "fs/promises";

import path from "path";



const BOOKINGS_PATH = path.join(process.cwd(), "data", "bookings.json");



export type StoredBooking = Record<string, any> & {

  id?: string;

};

// Legacy type alias for backward compatibility
export type BookingRecord = StoredBooking;



export async function readBookings(): Promise<StoredBooking[]> {

  try {

    const raw = await fs.readFile(BOOKINGS_PATH, "utf-8");

    const data = JSON.parse(raw);

    if (Array.isArray(data)) return data;

    return [];

  } catch {

    // If file doesn't exist yet, start with empty array

    return [];

  }

}



export async function writeBookings(bookings: StoredBooking[]): Promise<void> {

  await fs.mkdir(path.dirname(BOOKINGS_PATH), { recursive: true });

  await fs.writeFile(

    BOOKINGS_PATH,

    JSON.stringify(bookings, null, 2),

    "utf-8"

  );

}



export async function appendBooking(booking: StoredBooking): Promise<void> {

  const all = await readBookings();



  // Avoid duplicates by id

  if (booking.id) {

    const exists = all.some((b) => b.id === booking.id);

    if (exists) return;

  }



  all.push(booking);

  await writeBookings(all);

}



export async function getBookingById(id: string): Promise<StoredBooking | null> {

  const bookings = await readBookings();

  const found = bookings.find((b) => b.id === id);

  return found ?? null;

}



export async function updateBookingNotes(

  id: string,

  internalNotes: string

): Promise<StoredBooking | null> {

  const bookings = await readBookings();

  let updated: StoredBooking | null = null;



  const next = bookings.map((b) => {

    if (b.id === id) {

      updated = {

        ...b,

        internalNotes,

      };

      return updated;

    }

    return b;

  });



  if (!updated) {

    return null;

  }



  await writeBookings(next);

  return updated;

}

export async function updateBookingStatus(
  id: string,
  updates: {
    status?: string;
    paymentStatus?: string;
    cancellationReason?: string;
    refundedAt?: string;
    refundedAmount?: number;
    refundedBy?: string;
    refundReason?: string;
  }
): Promise<StoredBooking | null> {
  const bookings = await readBookings();
  let updated: StoredBooking | null = null;

  const next = bookings.map((b) => {
    if (b.id === id) {
      updated = {
        ...b,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return updated;
    }
    return b;
  });

  if (!updated) {
    return null;
  }

  await writeBookings(next);

  return updated;
}
