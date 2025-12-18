import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { Metadata } from "next";
import { Suspense } from "react";
import StatusBadge, { getBookingStatus } from "@/components/admin/StatusBadge";
import BookingStatusFilter from "@/components/admin/BookingStatusFilter";
import { MoneyDisplay } from "@/components/admin/MoneyDisplay";

export const metadata: Metadata = {
  title: "Admin · Bookings | Savana Blu",
};

// 👉 Change this to the number you want to hand over to (e.g. your ops WhatsApp)
const WHATSAPP_NUMBER = "+255712304094";

type Booking = {
  id?: string;
  experienceTitle?: string;
  type?: string; // "zanzibar-tour" | "safari" | etc.
  slug?: string;
  dateLabel?: string;
  preferredDate?: string;
  date?: string;
  createdAt?: string;
  guestName?: string;
  customerName?: string;
  guestEmail?: string;
  customerEmail?: string;
  guestPhone?: string;
  customerPhone?: string;
  adults?: number;
  children?: number;
  totalUsd?: number;
  totalUSD?: number;
  total?: number;
  depositUsd?: number;
  depositUSD?: number;
  balanceUsd?: number;
  balanceUSD?: number;
  promoCode?: string | null;
  source?: string;
  status?: string;
  paymentStatus?: string;
  pickupLocation?: string | null;
  pickupTime?: string | null;
  airportPickup?: boolean;
  airportFlight?: string | null;
  notes?: string | null;
};

const BOOKINGS_PATH = path.join(process.cwd(), "data", "bookings.json");

async function readBookings(): Promise<Booking[]> {
  try {
    const raw = await fs.readFile(BOOKINGS_PATH, "utf8");
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err: any) {
    if (err.code === "ENOENT") return [];
    console.error("Error reading bookings.json", err);
    return [];
  }
}

function parseDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function getDisplayDate(booking: Booking): string {
  return (
    booking.dateLabel ||
    booking.preferredDate ||
    booking.createdAt ||
    "—"
  );
}

function getTotalUsd(booking: Booking): number | null {
  if (typeof booking.totalUsd === "number") return booking.totalUsd;
  if (typeof booking.total === "number") return booking.total;
  return null;
}

function getTypeLabel(b: Booking): string {
  if (b.type === "safari") return "Safari";
  if (b.type === "zanzibar-tour") return "Zanzibar tour";
  return b.type ? b.type : "Experience";
}

// Status functions now use the StatusBadge component

function parseNotes(notes?: string | null): {
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

function buildWhatsAppUrl(b: Booking): string {
  const dateText = getDisplayDate(b);
  // Support both camelCase and PascalCase field names
  const total = getTotalUsd(b);
  
  // Get advance paid amount - check advancePayment.usd first (for confirmed bookings), then fallback to depositUsd/depositUSD
  const advancePaid = (b as any).advancePayment?.usd ?? b.depositUsd ?? b.depositUSD ?? null;
  
  // Calculate balance: total - advancePaid (if both exist)
  const balance = total != null && advancePaid != null 
    ? Math.max(0, total - advancePaid) 
    : b.balanceUsd ?? b.balanceUSD ?? null;
  
  // Support both guestName/customerName and guestPhone/customerPhone
  const guestName = b.guestName || b.customerName || "Not provided";
  const guestPhone = b.guestPhone || b.customerPhone || "Not provided";
  const guestEmail = b.guestEmail || b.customerEmail || "Not provided";
  
  const partyParts: string[] = [];
  if (b.adults) partyParts.push(`${b.adults} adult(s)`);
  if (b.children) partyParts.push(`${b.children} child(ren)`);
  const partyText = partyParts.join(", ") || "Not specified";

  // Parse notes for structured pickup details
  const parsedNotes = parseNotes(b.notes || null);
  const pickupLocation = parsedNotes.pickupLocation || b.pickupLocation || "Not provided";
  const pickupTime = parsedNotes.pickupTime || b.pickupTime || "Not provided";
  const airportPickup = parsedNotes.airportPickup ?? b.airportPickup ?? false;
  const flightDetails = parsedNotes.flightDetails || b.airportFlight || null;

  // Get status information
  const status = getBookingStatus(b);
  const statusLabel = status === "confirmed" 
    ? "Confirmed (20% advance paid)" 
    : status === "on-hold" 
    ? "On hold (awaiting 20% advance)" 
    : status === "cancelled"
    ? "Cancelled"
    : "Pending";

  const lines: string[] = [
    "Hi Yussuf, new booking from Savana Blu.",
    "",
    "Guest Information:",
    `Name: ${guestName}`,
    `Phone: ${guestPhone}`,
    `Email: ${guestEmail}`,
    "",
    "Booking Details:",
    `Experience: ${b.experienceTitle || "Not provided"}`,
    `Type: ${getTypeLabel(b)}`,
    `Preferred date: ${dateText}`,
    `Status: ${statusLabel}`,
    "",
    "Party:",
    partyText,
    "",
    "Pickup Information:",
    `Pick-up location: ${pickupLocation}`,
    `Pick-up time: ${pickupTime}`,
    `Airport pick-up: ${airportPickup ? "YES" : "No"}`,
  ];

  if (airportPickup && flightDetails) {
    lines.push(`Flight details: ${flightDetails}`);
  }

  // Payment summary
  if (total != null || advancePaid != null || balance != null) {
    lines.push("");
    lines.push("Payment Summary:");
    if (total != null) {
      lines.push(`Total: USD ${total.toFixed(2)}`);
    }
    if (advancePaid != null && advancePaid > 0) {
      lines.push(`20% advance paid: USD ${advancePaid.toFixed(2)}`);
    }
    if (balance != null && balance >= 0) {
      lines.push(`Balance to collect in Zanzibar: USD ${balance.toFixed(2)}`);
    }
  }

  if (b.promoCode) {
    lines.push("");
    lines.push(`Promo code used: ${b.promoCode}`);
  }

  // Guest notes if available
  if (parsedNotes.guestNotes) {
    lines.push("");
    lines.push("Guest notes:");
    lines.push(parsedNotes.guestNotes);
  }

  // Booking ID for reference
  if (b.id) {
    lines.push("");
    lines.push(`Booking ID: ${b.id}`);
  }

  const message = lines.join("\n");
  const phoneClean = WHATSAPP_NUMBER.replace(/[^+\d]/g, "");
  return `https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`;
}

type PageProps = {
  searchParams: { status?: string };
};

export default async function AdminBookingsPage({
  searchParams,
}: PageProps) {
  const bookings = await readBookings();
  const statusFilter = searchParams?.status as
    | "all"
    | "confirmed"
    | "on-hold"
    | "cancelled"
    | undefined;

  // Split upcoming vs past based on preferred date / dateLabel
  const now = new Date();
  const upcoming: Booking[] = [];
  const past: Booking[] = [];

  for (const b of bookings) {
    const d =
      parseDate(b.preferredDate) ||
      parseDate(b.dateLabel) ||
      parseDate(b.createdAt);
    if (!d || d < new Date("2000-01-01")) {
      // No meaningful date, treat as upcoming but at the bottom
      upcoming.push(b);
      continue;
    }
    if (d >= now) {
      upcoming.push(b);
    } else {
      past.push(b);
    }
  }

  const sortByDate = (arr: Booking[]) =>
    arr.sort((a, b) => {
      const da =
        parseDate(a.preferredDate) ||
        parseDate(a.dateLabel) ||
        parseDate(a.createdAt) ||
        new Date(0);
      const db =
        parseDate(b.preferredDate) ||
        parseDate(b.dateLabel) ||
        parseDate(b.createdAt) ||
        new Date(0);
      return da.getTime() - db.getTime();
    });

  sortByDate(upcoming);
  sortByDate(past);

  // Filter bookings by status if filter is applied
  const filterBookings = (items: Booking[]) => {
    if (!statusFilter || statusFilter === "all") return items;
    return items.filter((b) => getBookingStatus(b) === statusFilter);
  };

  const filteredUpcoming = filterBookings(upcoming);
  const filteredPast = filterBookings(past);

  const renderTable = (items: Booking[]) => {
    if (items.length === 0) {
      return (
        <p className="mt-4 text-sm text-sb-cream/80">
          No bookings in this section yet.
        </p>
      );
    }

    return (
      <div className="overflow-x-auto rounded-2xl border border-sb-cream/20 bg-sb-deep/40 shadow-lg">
        <table className="min-w-full text-left text-xs sm:text-sm">
          <thead className="bg-sb-deep/60 text-sb-cream">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Experience</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Guest</th>
              <th className="px-4 py-3 font-medium">Party</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Ops</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b, idx) => {
              const total = getTotalUsd(b);
              const partyParts: string[] = [];
              if (b.adults) partyParts.push(`${b.adults} adult(s)`);
              if (b.children) partyParts.push(`${b.children} child(ren)`);
              const partyText = partyParts.join(", ") || "—";

              return (
                <tr
                  key={`${b.id || idx}`}
                  className="border-t border-sb-cream/15 bg-sb-deep/40 hover:bg-sb-deep/50"
                >
                  <td className="px-4 py-3 align-top text-sb-cream/90">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium">
                        {getDisplayDate(b)}
                      </span>
                      {b.createdAt && (
                        <span className="text-[10px] text-sb-cream/60">
                          created{" "}
                          {new Date(b.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-sb-cream/90">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium sm:text-sm">
                        {b.experienceTitle || "—"}
                      </span>
                      {b.slug && (
                        <span className="text-[11px] text-sb-cream/60">
                          slug: {b.slug}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-sb-cream/80">
                    <span className="inline-flex rounded-full bg-sb-cream/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide">
                      {getTypeLabel(b)}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top text-sb-cream/90">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-medium">
                        {b.guestName || "—"}
                      </span>
                      {b.guestEmail && (
                        <span className="text-[11px] text-sb-cream/70">
                          {b.guestEmail}
                        </span>
                      )}
                      {b.guestPhone && (
                        <span className="text-[11px] text-sb-cream/70">
                          {b.guestPhone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-sb-cream/90">
                    <span className="text-xs">{partyText}</span>
                  </td>
                  <td className="px-4 py-3 align-top text-sb-cream/90">
                    {typeof total === "number" ? (
                      <span className="text-xs font-medium">
                        <MoneyDisplay amountUSD={total} />
                      </span>
                    ) : (
                      <span className="text-xs">—</span>
                    )}
                    {b.promoCode && (
                      <div className="mt-1 text-[11px] text-sb-cream/60">
                        Promo: {b.promoCode}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <StatusBadge
                      status={b.status || ""}
                      paymentStatus={b.paymentStatus}
                    />
                  </td>
                  <td className="px-4 py-3 align-top text-sb-cream/90">
                    <span className="text-xs">
                      {b.source || "website booking"}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top text-sb-cream/90">
                    <div className="flex flex-col gap-1">
                      <Link
                        href={buildWhatsAppUrl(b)}
                        target="_blank"
                        className="inline-flex items-center rounded-full bg-sb-cream px-3 py-1.5 text-[11px] font-semibold tracking-wide text-sb-deep transition-all hover:bg-sb-cream/90 hover:shadow-md"
                      >
                        <svg
                          className="mr-1.5 h-3.5 w-3.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        WhatsApp
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Calculate status counts using consistent logic
  const statusCounts = {
    confirmed: bookings.filter(
      (b) => getBookingStatus(b) === "confirmed"
    ).length,
    onHold: bookings.filter(
      (b) => getBookingStatus(b) === "on-hold"
    ).length,
    cancelled: bookings.filter(
      (b) => getBookingStatus(b) === "cancelled"
    ).length,
  };

  return (
    <main className="min-h-screen bg-sb-deep text-sb-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Link
                href="/admin"
                className="inline-flex items-center text-xs uppercase tracking-[0.25em] text-sb-cream/60 hover:text-sb-cream/80"
              >
                <svg
                  className="mr-2 h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Admin Dashboard
              </Link>
              <h1 className="mt-3 text-3xl font-semibold tracking-wide sm:text-4xl">
                Bookings
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sb-cream/80">
                Manage all bookings, view statuses, download CSV exports and send
                WhatsApp handovers with complete guest details.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/api/admin/bookings/export"
                className="inline-flex items-center rounded-full border border-sb-cream/40 bg-sb-cream/5 px-5 py-2.5 text-xs font-semibold tracking-wide text-sb-cream transition-all hover:border-sb-cream/60 hover:bg-sb-cream/10"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download CSV
              </Link>
            </div>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-sb-sand/20 bg-sb-cream/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-sb-cream/60">
              Total bookings
            </p>
            <p className="mt-2 text-2xl font-semibold text-sb-cream">
              {bookings.length}
            </p>
          </div>
          <div className="rounded-xl border border-sb-sand/20 bg-sb-cream/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-sb-cream/60">
              Confirmed
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">
              {statusCounts.confirmed}
            </p>
            <p className="mt-1 text-[11px] text-sb-cream/60">
              20% advance paid
            </p>
          </div>
          <div className="rounded-xl border border-sb-sand/20 bg-sb-cream/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-sb-cream/60">
              On hold
            </p>
            <p className="mt-2 text-2xl font-semibold text-sb-coral">
              {statusCounts.onHold}
            </p>
            <p className="mt-1 text-[11px] text-sb-cream/60">
              Awaiting advance
            </p>
          </div>
          {statusCounts.cancelled > 0 && (
            <div className="rounded-xl border border-sb-sand/20 bg-sb-cream/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-sb-cream/60">
                Cancelled
              </p>
              <p className="mt-2 text-2xl font-semibold text-red-400">
                {statusCounts.cancelled}
              </p>
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-sb-cream/60">
              Filter by status
            </p>
          </div>
          <Suspense fallback={<div className="h-10" />}>
            <BookingStatusFilter bookings={bookings} />
          </Suspense>
        </div>

        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-sb-cream/70">
              Upcoming bookings
            </h2>
            <span className="rounded-full bg-sb-cream/10 px-3 py-1 text-xs font-medium text-sb-cream/80">
              {filteredUpcoming.length}
              {statusFilter && statusFilter !== "all" && (
                <span className="ml-1 text-sb-cream/60">
                  / {upcoming.length}
                </span>
              )}
            </span>
          </div>
          {renderTable(filteredUpcoming)}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-sb-cream/70">
              Past & completed bookings
            </h2>
            <span className="rounded-full bg-sb-cream/10 px-3 py-1 text-xs font-medium text-sb-cream/80">
              {filteredPast.length}
              {statusFilter && statusFilter !== "all" && (
                <span className="ml-1 text-sb-cream/60">/ {past.length}</span>
              )}
            </span>
          </div>
          {renderTable(filteredPast)}
        </section>
      </div>
    </main>
  );
}
