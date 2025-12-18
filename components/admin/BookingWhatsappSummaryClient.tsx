"use client";

import { useState } from "react";
import type { BookingRecord } from "@/lib/data/bookings";

type Props = {
  booking: BookingRecord;
};

function formatMoney(value?: number): string {
  if (typeof value !== "number" || isNaN(value)) return "-";
  return `USD ${value.toFixed(2)}`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Date TBC";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatBookingDate(value?: string | null): string {
  if (!value) return "Not provided";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-TZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function parseNotes(notes?: string): {
  pickupLocation?: string;
  pickupTime?: string;
  airportPickup?: boolean;
  flightDetails?: string;
  guestNotes?: string;
} {
  if (!notes) return {};

  const result: {
    pickupLocation?: string;
    pickupTime?: string;
    airportPickup?: boolean;
    flightDetails?: string;
    guestNotes?: string;
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

  // Extract guest notes (everything after "Guest notes:")
  const guestNotesMatch = notes.match(/Guest notes:\s*(.+?)(?:\n\n|\n*$)/is);
  if (guestNotesMatch) {
    result.guestNotes = guestNotesMatch[1].trim();
  }

  return result;
}

function buildWhatsappText(booking: BookingRecord): string {
  const experience = booking.experienceTitle || "Experience";
  const guest = booking.customerName || "Guest";
  const phone = booking.customerPhone || "";
  const email = booking.customerEmail || "";
  const adults = booking.adults ?? 0;
  const children = booking.children ?? 0;
  const hasChildren = typeof booking.children === "number" && booking.children > 0;

  const total = booking.totalUSD ?? null;
  const deposit = booking.depositUSD ?? null;
  const balance = booking.balanceUSD ?? (total != null && deposit != null ? total - deposit : null);
  const promo = booking.promoCode || "";
  const currency = "USD";

  // Parse structured notes from booking.notes
  const parsedNotes = parseNotes(booking.notes);

  // Get booking date - use the date field directly since we're in a client component
  const rawDate = booking.date;
  const dateStr = rawDate ? formatBookingDate(rawDate) : "Not provided";

  // Get status information
  const bookingStatus = booking.paymentStatus === "confirmed" 
    ? "Confirmed (20% advance paid)" 
    : booking.paymentStatus === "pending" || booking.status === "pending"
    ? "On hold (awaiting 20% advance)" 
    : booking.status === "cancelled"
    ? "Cancelled"
    : "Pending";

  const lines: string[] = [];

  lines.push("Hi Yussuf, new booking from Savana Blu.");
  lines.push("");

  lines.push("Guest Information:");
  lines.push(`Name: ${guest}`);
  lines.push(`Phone: ${phone || "Not provided"}`);
  lines.push(`Email: ${email || "Not provided"}`);
  lines.push("");

  lines.push("Booking Details:");
  lines.push(`Tour/safari: ${experience}`);
  lines.push(`Preferred tour date: ${dateStr}`);
  lines.push(`Status: ${bookingStatus}`);
  lines.push("");

  lines.push("Party:");
  lines.push(
    `${adults} adult(s)` +
      (hasChildren ? `, ${children} child(ren) (<12)` : "")
  );
  lines.push("");

  lines.push("Pickup Information:");
  lines.push(`Pick-up location: ${parsedNotes.pickupLocation || "Not provided"}`);
  lines.push(`Pick-up time: ${parsedNotes.pickupTime || "Not provided"}`);
  lines.push(`Airport pick-up: ${parsedNotes.airportPickup ? "YES" : "No"}`);
  if (parsedNotes.airportPickup && parsedNotes.flightDetails) {
    lines.push(`Flight details: ${parsedNotes.flightDetails}`);
  }

  if (parsedNotes.guestNotes) {
    lines.push("");
    lines.push("Guest notes:");
    lines.push(parsedNotes.guestNotes);
  }

  // Payment summary
  if (total != null || deposit != null || balance != null || promo) {
    lines.push("");
    lines.push("Payment Summary:");
    if (total != null) {
      lines.push(`Total (estimate): ${currency} ${total.toFixed(2)}`);
    }
    if (deposit != null && deposit > 0) {
      lines.push(`Paid online: ${currency} ${deposit.toFixed(2)}`);
    }
    if (balance != null && balance > 0) {
      lines.push(
        `Estimated balance to collect in Zanzibar: ${currency} ${balance.toFixed(2)}`
      );
    }
    if (promo) {
      lines.push(`Promo code used: ${promo}`);
    }
  }

  // Booking ID for reference
  if (booking.id) {
    lines.push("");
    lines.push(`Booking ID: ${booking.id}`);
  }

  // Itinerary PDF link
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "https://savanablu.com";

  if (booking.id) {
    const itineraryUrl = `${origin}/api/admin/bookings/${booking.id}/pdf`;
    lines.push("");
    lines.push("Itinerary PDF:");
    lines.push(itineraryUrl);
  }

  return lines.join("\n");
}

export default function BookingWhatsappSummaryClient({ booking }: Props) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = async () => {
    setCopied(false);
    setError(null);
    try {
      const text = buildWhatsappText(booking);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Could not copy to clipboard. Please try again.");
    }
  };

  return (
    <div className="space-y-2 rounded-2xl bg-white/95 p-4 text-xs text-sb-ink/85 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="font-display text-sm text-sb-night">
            Quick summary for WhatsApp (Yussuf)
          </h2>
          <p className="text-[0.85rem] text-sb-ink/70">
            Copies a full summary of this booking (guest, party, amounts and
            notes) that you can paste into WhatsApp for Yussuf Selemani
            Amani.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="mt-1 inline-flex items-center justify-center rounded-full bg-sb-night px-4 py-2 text-[0.9rem] font-semibold text-sb-shell hover:bg-sb-ocean"
        >
          {copied ? "Copied ✓" : "Copy for WhatsApp"}
        </button>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-[0.85rem] text-red-700">
          {error}
        </p>
      )}

      {!error && copied && (
        <p className="text-[0.78rem] text-emerald-700">
          Summary copied. Open WhatsApp, choose Yussuf&apos;s chat and paste.
        </p>
      )}

      {!copied && !error && (
        <p className="text-[0.78rem] text-sb-ink/60">
          You can adjust any details manually after pasting (for example pick-up
          time or meeting point).
        </p>
      )}
    </div>
  );
}

