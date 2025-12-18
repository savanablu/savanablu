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
  try {
    await fs.mkdir(path.dirname(BOOKINGS_PATH), { recursive: true });
    await fs.writeFile(BOOKINGS_PATH, JSON.stringify(bookings, null, 2), "utf8");
  } catch (err: any) {
    // On Vercel, filesystem is read-only - log but don't throw
    if (err.code === "EACCES" || err.code === "EROFS" || err.code === "EPERM") {
      console.warn("Could not write bookings file (filesystem may be read-only):", err.message);
      // Don't throw - allow the function to continue
      return;
    }
    // For other errors, re-throw
    throw err;
  }
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
    
    // Try to save booking, but don't fail if filesystem is read-only
    try {
      await writeBookings(bookings);
    } catch (writeError: any) {
      console.warn("Could not update booking status (filesystem may be read-only):", writeError?.message);
      // Continue with email sending even if file write fails
    }

    const emailPayload = buildEmailPayloadFromBooking(
      booking,
      depositUsd,
      depositAed
    );

    console.log("[Ziina] Sending confirmation emails for booking:", bookingId);
    console.log("[Ziina] Email payload:", {
      guestEmail: emailPayload.guestEmail,
      guestName: emailPayload.guestName,
      bookingId: emailPayload.id,
      hasEmail: !!emailPayload.guestEmail,
    });

    // Only send if not already sent
    if (!emailsAlreadySent) {
      // Send emails with better error handling and logging
      try {
        console.log("[Ziina] Sending confirmation email to guest:", emailPayload.guestEmail);
        await sendBookingConfirmedToGuest(emailPayload);
        console.log("[Ziina] Guest confirmation email sent successfully");
      } catch (err) {
        console.error("[Ziina] Guest confirm email error:", err);
        console.error("[Ziina] Error details:", {
          guestEmail: emailPayload.guestEmail,
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });
      }

      try {
        console.log("[Ziina] Sending confirmation email to admin");
        await sendBookingConfirmedToAdmin(emailPayload);
        console.log("[Ziina] Admin confirmation email sent successfully");
      } catch (err) {
        console.error("[Ziina] Admin confirm email error:", err);
        console.error("[Ziina] Error details:", {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });
      }
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

