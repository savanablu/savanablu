import Link from "next/link";
import Section from "@/components/ui/Section";
import { getBookingById, type BookingRecord } from "@/lib/data/bookings";
import { readCrmLeads, type CrmLead } from "@/lib/data/crm-leads";
import { getBookingDate } from "@/lib/admin/bookings";
import BookingDetailClient from "@/components/admin/BookingDetailClient";
import BookingWhatsappSummaryClient from "@/components/admin/BookingWhatsappSummaryClient";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { id: string };
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  return d.toLocaleDateString("en-GB", {
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

function statusLabel(status: CrmLead["status"]) {
  switch (status) {
    case "new":
      return "New";
    case "in-progress":
      return "In progress";
    case "closed-won":
      return "Booked";
    case "closed-lost":
      return "Lost";
    default:
      return status;
  }
}

function buildGuideHandoverMessage(booking: BookingRecord, productTitle: string) {
  const {
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
    adults,
    children,
    notes,
    totalUSD: totalAmount,
    depositUSD: depositAmount,
    balanceUSD: balanceAmount,
    promoCode,
    status,
    paymentStatus,
  } = booking;

  const parsedNotes = parseNotes(notes);
  const currency = "USD";

  // Get amounts with fallbacks
  const total = totalAmount ?? null;
  
  // Get advance paid amount - check advancePayment.usd first (for confirmed bookings), then fallback to depositAmount
  const advancePaid = (booking as any).advancePayment?.usd ?? depositAmount ?? null;
  
  // Calculate balance: total - advancePaid (if both exist)
  const balance = total != null && advancePaid != null 
    ? Math.max(0, total - advancePaid) 
    : balanceAmount ?? null;

  // Get booking date using helper
  const bookingDate = getBookingDate(booking);
  const dateStr = bookingDate ? bookingDate.toISOString().split("T")[0] : null;

  // Get status information
  const bookingStatus = paymentStatus === "confirmed" 
    ? "Confirmed (20% advance paid)" 
    : paymentStatus === "pending" || status === "pending"
    ? "On hold (awaiting 20% advance)" 
    : status === "cancelled"
    ? "Cancelled"
    : "Pending";

  const lines: string[] = [];

  lines.push("Hi Yussuf, new booking from Savana Blu.");
  lines.push("");

  lines.push("Guest Information:");
  lines.push(`Name: ${name || "Not provided"}`);
  lines.push(`Phone: ${phone || "Not provided"}`);
  lines.push(`Email: ${email || "Not provided"}`);
  lines.push("");

  lines.push("Booking Details:");
  lines.push(`Tour/safari: ${productTitle || "Not provided"}`);
  lines.push(`Preferred tour date: ${formatBookingDate(dateStr)}`);
  lines.push(`Status: ${bookingStatus}`);
  lines.push("");

  lines.push("Party:");
  lines.push(
    `${adults ?? 0} adult(s)` +
      (children ? `, ${children} child(ren) (<12)` : "")
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
  if (total != null || advancePaid != null || balance != null || promoCode) {
    lines.push("");
    lines.push("Payment Summary:");
    if (total != null) {
      lines.push(`Total: ${currency} ${total.toFixed(2)}`);
    }
    if (advancePaid != null && advancePaid > 0) {
      lines.push(`20% advance paid: ${currency} ${advancePaid.toFixed(2)}`);
    }
    if (balance != null && balance >= 0) {
      lines.push(
        `Balance to collect in Zanzibar: ${currency} ${balance.toFixed(2)}`
      );
    }
    if (promoCode) {
      lines.push(`Promo code used: ${promoCode}`);
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

export default async function BookingDetailPage({ params }: PageProps) {
  const booking = await getBookingById(params.id);

  if (!booking) {
    return (
      <Section className="pb-16 pt-10">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="text-sm">
            <Link
              href="/admin/bookings"
              className="text-[0.9rem] font-semibold text-sb-ocean hover:underline"
            >
              ← Back to bookings
            </Link>
          </div>
          <div className="rounded-2xl bg-white/95 p-6 text-sm text-sb-ink">
            <h1 className="font-display text-xl text-sb-night">
              Booking not found
            </h1>
            <p className="mt-2 text-xs text-sb-ink/75">
              We couldn&apos;t find a booking with ID{" "}
              <code className="rounded bg-sb-shell/80 px-1 py-0.5">
                {params.id}
              </code>
              . It may have been removed or was never saved to{" "}
              <code className="rounded bg-sb-shell/80 px-1 py-0.5">
                data/bookings.json
              </code>
              .
            </p>
          </div>
        </div>
      </Section>
    );
  }

  // Find CRM leads with the same email (case-insensitive)
  const allLeads: CrmLead[] = await readCrmLeads();
  const bookingEmail = (booking.customerEmail || "").trim().toLowerCase();
  const relatedLeads = bookingEmail
    ? allLeads.filter(
        (l) => (l.email || "").trim().toLowerCase() === bookingEmail
      )
    : [];

  return (
    <Section className="pb-16 pt-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="text-sm">
          <Link
            href="/admin/bookings"
            className="text-[0.9rem] font-semibold text-sb-ocean hover:underline"
          >
            ← Back to bookings
          </Link>
        </div>

        <header className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end sm:gap-4">
          <div className="space-y-1">
            <h1 className="font-display text-2xl text-sb-night">
              {booking.experienceTitle || "Booking details"}
            </h1>
            <p className="text-xs text-sb-ink/75">
              Booking ID:{" "}
              <code className="rounded bg-sb-shell/80 px-1 py-0.5">
                {booking.id}
              </code>{" "}
              · Type:{" "}
              {booking.type === "package"
                ? "Package"
                : booking.type === "tour"
                ? "Tour"
                : "–"}
            </p>
          </div>

          {/* Export buttons */}
          <div className="flex flex-wrap gap-2 text-xs">
            <a
              href={`/api/admin/bookings/${booking.id}/export`}
              className="rounded-full border border-sb-mist/80 bg-white px-4 py-2 font-semibold text-sb-night shadow-sm hover:bg-sb-shell/80"
            >
              Export CSV
            </a>
            <a
              href={`/api/admin/bookings/${booking.id}/pdf`}
              className="rounded-full bg-sb-night px-4 py-2 font-semibold text-sb-shell shadow-sm hover:bg-sb-ocean"
            >
              Export PDF
            </a>
          </div>
        </header>

        {/* Quick WhatsApp summary for Yussuf */}
        <BookingWhatsappSummaryClient booking={booking} />

        {/* Direct WhatsApp briefing button for Yussuf */}
        <div className="rounded-2xl bg-white/95 p-4 text-xs text-sb-ink/85 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="font-display text-sm text-sb-night">
                WhatsApp briefing for Yussuf
              </h2>
              <p className="text-[0.85rem] text-sb-ink/70">
                Opens WhatsApp directly with a structured briefing message including pickup details, guest info, and payment status.
              </p>
            </div>
            {(() => {
              const productTitle = booking.experienceTitle || "Tour / Safari";
              const whatsappMessage = buildGuideHandoverMessage(booking, productTitle);
              const encoded = encodeURIComponent(whatsappMessage);
              const guideWhatsAppUrl = `https://wa.me/255712304094?text=${encoded}`;
              
              return (
                <a
                  href={guideWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-sb-deep px-4 py-2 text-sm font-medium text-sb-foam hover:bg-sb-ink"
                >
                  WhatsApp briefing for Yussuf
                </a>
              );
            })()}
          </div>
        </div>

        {/* Related leads */}
        {relatedLeads.length > 0 && (
          <div className="rounded-2xl border border-sb-mist/80 bg-white/95 p-4 text-xs text-sb-ink/85 shadow-sm">
            <h2 className="font-display text-sm text-sb-night">
              Related enquiries
            </h2>
            <p className="mt-1 text-[0.85rem] text-sb-ink/70">
              CRM leads with the same email address as this booking.
            </p>
            <ul className="mt-3 space-y-2">
              {relatedLeads.map((lead) => (
                <li
                  key={lead.id}
                  className="flex flex-col gap-0.5 rounded-xl bg-sb-shell/60 px-3 py-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/admin/crm/${lead.id}`}
                      className="text-[0.9rem] font-semibold text-sb-night hover:text-sb-ocean hover:underline"
                    >
                      {lead.name}
                    </Link>
                    <span className="text-[0.78rem] text-sb-ink/70">
                      {formatDate(lead.createdAt)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[0.78rem] text-sb-ink/70">
                    <span>{lead.preferredTour || "Preferred tour: –"}</span>
                    <span>
                      Status:{" "}
                      <span className="font-semibold">
                        {statusLabel(lead.status)}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <BookingDetailClient booking={booking} />
      </div>
    </Section>
  );
}
