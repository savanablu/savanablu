"use client";

import { useState } from "react";
import type { BookingRecord } from "@/lib/data/bookings";

type Props = {
  bookings: (BookingRecord & { dateLabel: string })[];
};

function formatMoney(value?: number): string {
  if (typeof value !== "number" || isNaN(value)) return "-";
  return `USD ${value.toFixed(2)}`;
}

function buildSummaryText(bookings: (BookingRecord & { dateLabel: string })[]) {
  if (!bookings.length) {
    return "No upcoming Savana Blu bookings for the selected period.";
  }

  const lines: string[] = [];
  lines.push("Upcoming Savana Blu bookings:");
  lines.push("");

  let lastDate = "";

  for (const b of bookings) {
    if (b.dateLabel !== lastDate) {
      lines.push(`${b.dateLabel}`);
      lastDate = b.dateLabel;
    }

    const party = `${b.adults ?? 0} adult(s)${
      b.children ? `, ${b.children} child(ren)` : ""
    }`;

    const title = b.experienceTitle || "Experience";
    const guest = b.customerName || "Guest";
    const phone = b.customerPhone || "";
    const internalNotes = b.internalNotes || "";
    const notesSnippet =
      internalNotes.length > 140
        ? internalNotes.slice(0, 137) + "..."
        : internalNotes;

    // First line: experience + guest + notes
    let line = `- ${title} – ${party} – Guest: ${guest}`;
    if (phone) line += ` (${phone})`;
    if (notesSnippet) line += ` – Notes: ${notesSnippet}`;
    lines.push(line);

    // Second line: amounts (trip value, deposit, balance, promo)
    const amountParts: string[] = [];
    if (typeof b.totalUSD === "number") {
      amountParts.push(`Trip: ${formatMoney(b.totalUSD)}`);
    }
    if (typeof b.depositUSD === "number") {
      amountParts.push(`Deposit received: ${formatMoney(b.depositUSD)}`);
    }
    if (typeof b.balanceUSD === "number") {
      amountParts.push(`Balance to collect: ${formatMoney(b.balanceUSD)}`);
    }
    if (b.promoCode) {
      amountParts.push(`Promo: ${b.promoCode} (already applied)`);
    }

    if (amountParts.length > 0) {
      lines.push(`  • ${amountParts.join(" · ")}`);
    }
  }

  return lines.join("\n");
}

export default function StaffScheduleClient({ bookings }: Props) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = async () => {
    setCopied(false);
    setError(null);
    try {
      const text = buildSummaryText(bookings);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Could not copy to clipboard. Please try again.");
    }
  };

  return (
    <div className="space-y-3 rounded-2xl bg-white/95 p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="font-display text-sm text-sb-night">
            Staff handover summary
          </h2>
          <p className="text-[0.9rem] text-sb-ink/75">
            Copy a compact text summary you can paste into WhatsApp or email
            for your guides, including what&apos;s been paid and what to
            collect on the day.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="mt-1 inline-flex items-center justify-center rounded-full bg-sb-night px-4 py-2 text-[0.9rem] font-semibold text-sb-shell hover:bg-sb-ocean"
        >
          {copied ? "Copied ✓" : "Copy summary"}
        </button>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-[0.85rem] text-red-700">
          {error}
        </p>
      )}

      {!bookings.length && (
        <p className="text-[0.85rem] text-sb-ink/70">
          There are no upcoming bookings in the selected window. Once you have
          bookings with future dates, they will appear above and in the copied
          summary.
        </p>
      )}

      {bookings.length > 0 && (
        <p className="text-[0.78rem] text-sb-ink/60">
          The summary now includes trip value, deposit received, balance to
          collect and any promo code used.
        </p>
      )}
    </div>
  );
}
