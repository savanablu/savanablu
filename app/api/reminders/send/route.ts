import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { sendEmail } from "@/lib/email";
import {
  tourReminderCustomerEmail,
  reviewRequestCustomerEmail,
  type ReminderPayload,
} from "@/lib/email";
import { readBookings, type BookingRecord } from "@/lib/data/bookings";
import { getBookingDate } from "@/lib/admin/bookings";

function parseDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function parseNotes(notes?: string): {
  pickupLocation?: string;
  pickupTime?: string;
  airportPickup?: boolean;
  flightDetails?: string;
} {
  if (!notes) return {};

  const result: {
    pickupLocation?: string;
    pickupTime?: string;
    airportPickup?: boolean;
    flightDetails?: string;
  } = {};

  // Extract pickup location
  const pickupLocationMatch = notes.match(/Pick-up location:\s*(.+?)(?:\n|$)/i);
  if (pickupLocationMatch) {
    result.pickupLocation = pickupLocationMatch[1].trim();
  }

  // Extract pickup time
  const pickupTimeMatch = notes.match(/Pick-up time:\s*(.+?)(?:\n|$)/i);
  if (pickupTimeMatch) {
    result.pickupTime = pickupTimeMatch[1].trim();
  }

  // Extract airport pickup flag
  const airportPickupMatch = notes.match(/Airport pick-up required:\s*(Yes|No)/i);
  if (airportPickupMatch) {
    result.airportPickup = airportPickupMatch[1].toLowerCase() === "yes";
  }

  // Extract flight details
  const flightDetailsMatch = notes.match(/Flight details:\s*(.+?)(?:\n|$)/i);
  if (flightDetailsMatch && flightDetailsMatch[1] !== "Not required (hotel/villa pick-up)") {
    result.flightDetails = flightDetailsMatch[1].trim();
  }

  return result;
}

export async function POST() {
  let bookings: BookingRecord[] = [];
  try {
    bookings = await readBookings();
  } catch (err: any) {
    console.error("Reminder read error:", err);
    return NextResponse.json(
      { error: "Unable to read bookings." },
      { status: 500 }
    );
  }

  const now = new Date();
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const oneDayMs = 24 * 60 * 60 * 1000;

  let reminderCount = 0;
  let reviewCount = 0;

  // Track which bookings need updates
  const updatedBookings: BookingRecord[] = [];

  for (const booking of bookings) {
    // Use the same date extraction logic as admin tools
    const bookingDate = getBookingDate(booking);
    if (!bookingDate || !booking.customerEmail || !booking.customerName) continue;

    const bookingMidnight = new Date(
      bookingDate.getFullYear(),
      bookingDate.getMonth(),
      bookingDate.getDate()
    );

    const diffMs =
      bookingMidnight.getTime() - todayMidnight.getTime();
    const diffDays = diffMs / oneDayMs;

    // Extract pickup details from notes
    const parsedNotes = parseNotes(booking.notes);
    const pickupLocation = booking.pickupLocation || parsedNotes.pickupLocation || "To be confirmed";
    const pickupTime = booking.pickupTime || parsedNotes.pickupTime || "To be confirmed";

    // Format the date for display
    const dateStr = bookingDate.toLocaleDateString("en-TZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const payload: ReminderPayload = {
      kind: booking.type === "package" || booking.type === "Safari" ? "package" : "tour",
      title: booking.tourTitle || booking.packageTitle || booking.productName || booking.experienceTitle || "Your experience",
      date: dateStr,
      customerName: booking.customerName,
      pickupLocation,
      pickupTime,
      airportPickup: booking.airportPickup || parsedNotes.airportPickup || false,
      flightDetails: booking.flightDetails || parsedNotes.flightDetails,
    };

    let updated = false;

    // Reminder for tomorrow (1 day before)
    if (diffDays === 1 && !(booking as any).reminderSent) {
      try {
        await sendEmail({
          to: booking.customerEmail,
          subject: "Reminder for your Savana Blu experience tomorrow",
          html: tourReminderCustomerEmail(payload),
        });

        (booking as any).reminderSent = true;
        reminderCount++;
        updated = true;
      } catch (err) {
        console.error("Reminder email error:", err);
      }
    }

    // Review request 2+ days after
    if (diffDays <= -2 && !(booking as any).reviewRequestSent) {
      try {
        await sendEmail({
          to: booking.customerEmail,
          subject: "How was your time with Savana Blu?",
          html: reviewRequestCustomerEmail(payload),
        });

        (booking as any).reviewRequestSent = true;
        reviewCount++;
        updated = true;
      } catch (err) {
        console.error("Review email error:", err);
      }
    }

    if (updated) {
      updatedBookings.push(booking);
    }
  }

  // Write back updated bookings (with reminder/review flags)
  if (updatedBookings.length > 0) {
    try {
      const allBookings = await readBookings();
      const updatedMap = new Map(
        updatedBookings.map((b) => [b.id || b.sessionId, b])
      );
      const merged = allBookings.map((b) => updatedMap.get(b.id || b.sessionId) || b);

      await fs.writeFile(
        path.join(process.cwd(), "data", "bookings.json"),
        JSON.stringify(merged, null, 2),
        "utf8"
      );
    } catch (err) {
      console.error("Reminder write error:", err);
      // Don't fail the API if write fails
    }
  }

  return NextResponse.json({
    success: true,
    remindersSent: reminderCount,
    reviewRequestsSent: reviewCount,
  });
}

