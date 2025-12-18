import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import {
  sendBookingConfirmedToAdmin,
  sendBookingConfirmedToGuest,
} from "@/lib/email";

// Where bookings.json lives
const BOOKINGS_PATH = path.join(process.cwd(), "data", "bookings.json");

// Small helper to read bookings.json
async function readBookings(): Promise<any[]> {
  try {
    const raw = await fs.readFile(BOOKINGS_PATH, "utf8");
    return JSON.parse(raw || "[]");
  } catch (err: any) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

// Small helper to write bookings.json
async function writeBookings(bookings: any[]) {
  await fs.mkdir(path.dirname(BOOKINGS_PATH), { recursive: true });
  await fs.writeFile(BOOKINGS_PATH, JSON.stringify(bookings, null, 2), "utf8");
}

// Try to get a total in USD from whatever field exists
function getTotalUsdFromBooking(booking: any): number | undefined {
  if (typeof booking.totalUsd === "number") return booking.totalUsd;
  if (typeof booking.totalUSD === "number") return booking.totalUSD;
  if (typeof booking.total === "number") return booking.total;
  return undefined;
}

// Build the payload that lib/email.ts expects
function buildEmailPayloadFromBooking(
  booking: any,
  depositUsd?: number,
  depositAed?: number
): any {
  const totalUsd = getTotalUsdFromBooking(booking);

  return {
    id:
      booking.id ||
      booking.bookingId ||
      booking.reference ||
      booking.stripeSessionId ||
      "",
    experienceTitle:
      booking.experienceTitle ||
      booking.title ||
      booking.tourTitle ||
      booking.packageTitle ||
      "",
    type: booking.type || (booking.isSafari ? "safari" : "zanzibar-tour"),
    dateLabel: booking.dateLabel || booking.preferredDate || booking.date || "",
    guestName: booking.guestName || booking.customerName || booking.name || "",
    guestEmail: booking.guestEmail || booking.customerEmail || booking.email || "",
    guestPhone: booking.guestPhone || booking.customerPhone || booking.phone || "",
    adults: booking.adults,
    children: booking.children,
    totalUsd,
    depositUsd,
    depositAed,
    promoCode: booking.promoCode || booking.promo || null,
    pickupLocation: booking.pickupLocation || null,
    pickupTime: booking.pickupTime || null,
    airportPickup: booking.airportPickup || false,
    airportFlight: booking.airportFlight || null,
    notes: booking.notes || null,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const bookingId = body.bookingId as string | undefined;

    if (!bookingId) {
      return NextResponse.json(
        { error: "bookingId is required" },
        { status: 400 }
      );
    }

    const bookings = await readBookings();
    const index = bookings.findIndex(
      (b) =>
        b.id === bookingId ||
        b.bookingId === bookingId ||
        b.stripeSessionId === bookingId
    );

    if (index === -1) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const booking = bookings[index];

    // Check if booking is already confirmed AND emails were sent - prevent duplicate processing
    const isAlreadyConfirmed = 
      booking.paymentStatus === "confirmed" || 
      booking.status === "confirmed" ||
      booking.confirmedAt;
    
    const emailsAlreadySent = booking.confirmationEmailsSent === true;

    if (isAlreadyConfirmed && emailsAlreadySent) {
      console.log("[Ziina] Booking already confirmed and emails sent, skipping duplicate processing:", bookingId);
      return NextResponse.json({ 
        ok: true, 
        message: "Booking already confirmed",
        alreadyProcessed: true 
      });
    }

    const totalUsd = getTotalUsdFromBooking(booking);
    const rateFromEnv = Number(
      process.env.NEXT_PUBLIC_ZIINA_USD_TO_AED_RATE ?? "3.7"
    );
    const fxRate =
      Number.isFinite(rateFromEnv) && rateFromEnv > 0 ? rateFromEnv : 3.7;

    let depositUsd: number | undefined;
    let depositAed: number | undefined;

    if (typeof totalUsd === "number") {
      const rawUsd = totalUsd * 0.2;
      depositUsd = Math.round(rawUsd * 100) / 100;
      const rawAed = depositUsd * fxRate;
      depositAed = Math.round(rawAed * 100) / 100;
    }

    // Update booking status minimally (without breaking existing admin)
    booking.paymentStatus = "confirmed";
    booking.confirmedAt = new Date().toISOString();
    booking.advancePayment = {
      method: "ziina",
      percent: 20,
      usd: depositUsd,
      aed: depositAed,
      paidAt: new Date().toISOString(),
    };
    
    // Mark that emails will be sent (set before sending to prevent race conditions)
    booking.confirmationEmailsSent = true;

    bookings[index] = booking;
    await writeBookings(bookings);

    const emailPayload = buildEmailPayloadFromBooking(
      booking,
      depositUsd,
      depositAed
    );

    console.log("[Ziina] Sending confirmation emails for booking:", bookingId);

    // Fire & forget – we don't block the response if email fails
    // Only send if not already sent
    if (!emailsAlreadySent) {
      sendBookingConfirmedToGuest(emailPayload).catch((err) =>
        console.error("[Ziina] guest confirm email error", err)
      );
      sendBookingConfirmedToAdmin(emailPayload).catch((err) =>
        console.error("[Ziina] admin confirm email error", err)
      );
    } else {
      console.log("[Ziina] Confirmation emails already sent, skipping:", bookingId);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error in /api/ziina/mark-paid:", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}

