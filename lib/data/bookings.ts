// lib/data/bookings.ts

import fs from "fs/promises";
import path from "path";

const BOOKINGS_PATH = path.join(process.cwd(), "data", "bookings.json");
const KV_BOOKINGS_KEY = "savanablu:bookings";

// Lazy load Vercel KV (only when needed)
async function getKV(): Promise<any> {
  try {
    const kvModule = await import("@vercel/kv");
    return kvModule.kv;
  } catch {
    // Vercel KV not available (e.g., in local dev without KV setup)
    return null;
  }
}

export type StoredBooking = Record<string, any> & {
  id?: string;
};

// Legacy type alias for backward compatibility
export type BookingRecord = StoredBooking;

/**
 * Read bookings from KV (if available) or fallback to file system
 */
async function readBookingsFromStorage(): Promise<StoredBooking[]> {
  // Try Vercel KV first (works on Vercel)
  const kv = await getKV();
  if (kv) {
    try {
      const data = await kv.get<StoredBooking[]>(KV_BOOKINGS_KEY);
      if (Array.isArray(data)) {
        console.log(`[Bookings] Read ${data.length} bookings from Vercel KV`);
        return data;
      }
    } catch (err: any) {
      console.warn("[Bookings] Error reading from Vercel KV:", err.message);
    }
  }

  // Fallback to file system (works locally)
  try {
    const raw = await fs.readFile(BOOKINGS_PATH, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      console.log(`[Bookings] Read ${data.length} bookings from file system`);
      return data;
    }
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      console.warn("[Bookings] Error reading from file system:", err.message);
    }
  }

  return [];
}

/**
 * Write bookings to KV (if available) and/or file system
 */
async function writeBookingsToStorage(bookings: StoredBooking[]): Promise<void> {
  let kvSuccess = false;
  let fileSuccess = false;

  // Try Vercel KV first (primary storage on Vercel)
  const kv = await getKV();
  if (kv) {
    try {
      await kv.set(KV_BOOKINGS_KEY, JSON.stringify(bookings));
      kvSuccess = true;
      console.log(`[Bookings] Saved ${bookings.length} bookings to Vercel KV`);
    } catch (err: any) {
      console.warn("[Bookings] Error writing to Vercel KV:", err.message);
    }
  }

  // Also try file system (works locally, fails on Vercel but that's OK)
  try {
    await fs.mkdir(path.dirname(BOOKINGS_PATH), { recursive: true });
    await fs.writeFile(
      BOOKINGS_PATH,
      JSON.stringify(bookings, null, 2),
      "utf-8"
    );
    fileSuccess = true;
    console.log(`[Bookings] Saved ${bookings.length} bookings to file system`);
  } catch (err: any) {
    // On Vercel, filesystem is read-only - this is expected
    if (err.code === "EACCES" || err.code === "EROFS" || err.code === "EPERM") {
      // This is OK - we're using KV on Vercel
      if (kvSuccess) {
        console.log("[Bookings] File write failed (read-only), but KV write succeeded");
      }
    } else {
      console.warn("[Bookings] Error writing to file system:", err.message);
    }
  }

  // If both failed, log a warning
  if (!kvSuccess && !fileSuccess) {
    console.error("[Bookings] WARNING: Could not save bookings to any storage!");
  }
}

export async function readBookings(): Promise<StoredBooking[]> {
  return readBookingsFromStorage();
}



export async function writeBookings(bookings: StoredBooking[]): Promise<void> {
  await writeBookingsToStorage(bookings);
}



export async function appendBooking(booking: StoredBooking): Promise<void> {
  try {
    const all = await readBookingsFromStorage();

    // Avoid duplicates by id
    if (booking.id) {
      const exists = all.some((b) => b.id === booking.id);
      if (exists) {
        console.log(`[Bookings] Booking ${booking.id} already exists, skipping`);
        return;
      }
    }

    all.push(booking);
    console.log(`[Bookings] Adding new booking: ${booking.id} for ${booking.customerName || booking.guestName}`);

    await writeBookingsToStorage(all);
    console.log(`[Bookings] Successfully saved booking ${booking.id}`);
  } catch (err: any) {
    console.error("[Bookings] Error appending booking:", err);
    // Don't throw - allow booking creation to continue (emails will still be sent)
    // But log the error so we know bookings aren't being saved
  }
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



  try {
    await writeBookingsToStorage(next);
  } catch (err: any) {
    console.error("[Bookings] Error updating booking notes:", err);
    // Still return the updated booking object even if write fails
    return updated;
  }

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

  try {
    await writeBookingsToStorage(next);
  } catch (err: any) {
    console.error("[Bookings] Error updating booking status:", err);
    // Still return the updated booking object even if write fails
    return updated;
  }

  return updated;
}
