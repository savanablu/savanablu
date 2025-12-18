"use client";

import { useState } from "react";
import type { BookingRecord } from "@/lib/data/bookings";
import { MoneyDisplay } from "./MoneyDisplay";

type Props = {
  booking: BookingRecord;
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

export default function BookingDetailClient({ booking }: Props) {
  const [notes, setNotes] = useState(booking.internalNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!booking.id) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalNotes: notes }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save notes");
      }

      setMessage("Notes saved.");
    } catch (err) {
      console.error(err);
      setError("Could not save notes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const partyLabel = `${booking.adults ?? 0} adult(s)${
    booking.children ? `, ${booking.children} child(ren)` : ""
  }`;

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
      {/* Left: booking summary */}
      <div className="space-y-4 rounded-2xl bg-white/95 p-5 shadow-sm">
        <h2 className="font-display text-sm text-sb-night">
          Booking summary
        </h2>

        <dl className="mt-2 grid gap-3 text-xs text-sb-ink/85 sm:grid-cols-2">
          <div>
            <dt className="text-[0.78rem] uppercase tracking-wide text-sb-ink/60">
              Experience
            </dt>
            <dd className="mt-0.5 font-semibold text-sb-night">
              {booking.experienceTitle || "–"}
            </dd>
            {booking.experienceSlug && (
              <dd className="mt-0.5 text-[0.68rem] text-sb-ink/60">
                slug: <code>{booking.experienceSlug}</code>
              </dd>
            )}
          </div>

          <div>
            <dt className="text-[0.78rem] uppercase tracking-wide text-sb-ink/60">
              Type
            </dt>
            <dd className="mt-0.5">
              {booking.type === "package"
                ? "Package"
                : booking.type === "tour"
                ? "Tour"
                : "–"}
            </dd>
          </div>

          <div>
            <dt className="text-[0.78rem] uppercase tracking-wide text-sb-ink/60">
              Tour date
            </dt>
            <dd className="mt-0.5">
              {booking.date ? formatDate(booking.date) : "–"}
            </dd>
          </div>

          <div>
            <dt className="text-[0.78rem] uppercase tracking-wide text-sb-ink/60">
              Created
            </dt>
            <dd className="mt-0.5">
              {booking.createdAt
                ? formatDate(booking.createdAt)
                : "–"}
            </dd>
          </div>

          <div>
            <dt className="text-[0.78rem] uppercase tracking-wide text-sb-ink/60">
              Guest
            </dt>
            <dd className="mt-0.5 font-semibold text-sb-night">
              {booking.customerName || "–"}
            </dd>
            {booking.customerEmail && (
              <dd className="mt-0.5 text-[0.68rem] text-sb-ink/70">
                {booking.customerEmail}
              </dd>
            )}
            {booking.customerPhone && (
              <dd className="mt-0.5 text-[0.68rem] text-sb-ink/70">
                {booking.customerPhone}
              </dd>
            )}
          </div>

          <div>
            <dt className="text-[0.78rem] uppercase tracking-wide text-sb-ink/60">
              Party
            </dt>
            <dd className="mt-0.5">{partyLabel}</dd>
          </div>

          <div>
            <dt className="text-[0.78rem] uppercase tracking-wide text-sb-ink/60">
              Total
            </dt>
            <dd className="mt-0.5 font-semibold text-sb-night">
              {booking.totalUSD ? (
                <MoneyDisplay amountUSD={booking.totalUSD} />
              ) : (
                "-"
              )}
            </dd>
          </div>

          <div>
            <dt className="text-[0.78rem] uppercase tracking-wide text-sb-ink/60">
              Deposit
            </dt>
            <dd className="mt-0.5 text-emerald-700">
              {booking.depositUSD ? (
                <MoneyDisplay amountUSD={booking.depositUSD} />
              ) : (
                "-"
              )}
            </dd>
          </div>

          <div>
            <dt className="text-[0.78rem] uppercase tracking-wide text-sb-ink/60">
              Balance
            </dt>
            <dd className="mt-0.5 text-sb-ink/80">
              {booking.balanceUSD ? (
                <MoneyDisplay amountUSD={booking.balanceUSD} />
              ) : (
                "-"
              )}
            </dd>
          </div>

          <div>
            <dt className="text-[0.78rem] uppercase tracking-wide text-sb-ink/60">
              Status
            </dt>
            <dd className="mt-0.5">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[0.68rem] font-semibold text-emerald-700">
                {booking.status || "confirmed"}
              </span>
            </dd>
          </div>

          <div>
            <dt className="text-[0.78rem] uppercase tracking-wide text-sb-ink/60">
              Source
            </dt>
            <dd className="mt-0.5 text-[0.85rem] text-sb-ink/75">
              {booking.source || "website-booking"}
            </dd>
          </div>

          {booking.promoCode && (
            <div>
              <dt className="text-[0.78rem] uppercase tracking-wide text-sb-ink/60">
                Promo code
              </dt>
              <dd className="mt-0.5 text-[0.85rem] text-sb-ink/80">
                <code>{booking.promoCode}</code>
              </dd>
            </div>
          )}
        </dl>

        {booking.notes && (
          <div className="mt-4 rounded-xl bg-sb-shell/80 p-3 text-xs text-sb-ink/85">
            <h3 className="font-display text-[0.9rem] text-sb-night">
              Guest notes from checkout
            </h3>
            <p className="mt-1 whitespace-pre-wrap text-[0.85rem]">
              {booking.notes}
            </p>
          </div>
        )}
      </div>

      {/* Right: internal notes */}
      <div className="space-y-3 rounded-2xl bg-white/95 p-5 shadow-sm">
        <h2 className="font-display text-sm text-sb-night">
          Internal notes
        </h2>
        <p className="text-[0.85rem] text-sb-ink/75">
          For your eyes only – use this area to record things like hotel,
          pickup point, guide assigned, special occasions, balance actually
          collected, etc.
        </p>

        {message && (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-[0.78rem] text-emerald-700">
            {message}
          </p>
        )}
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-[0.78rem] text-red-700">
            {error}
          </p>
        )}

        <textarea
          rows={10}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-2 w-full rounded-md border border-sb-mist/80 bg-sb-shell/70 px-3 py-2 text-[0.78rem] text-sb-ink outline-none focus:border-sb-lagoon focus:ring-1 focus:ring-sb-lagoon/70"
          placeholder="e.g. Pickup: Park Hyatt lobby 08:00, guide: Ahmed, special: honeymoon / gluten-free lunch…"
        />

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !booking.id}
            className="rounded-full bg-sb-night px-4 py-2 text-[0.9rem] font-semibold text-sb-shell hover:bg-sb-ocean disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save notes"}
          </button>
        </div>

        <p className="text-[0.68rem] text-sb-ink/60">
          Notes are stored in <code>data/bookings.json</code> alongside the
          booking and are not sent to the guest.
        </p>
      </div>

      {/* Admin Actions */}
      <AdminBookingActions booking={booking} />
    </div>
  );
}

function AdminBookingActions({ booking }: { booking: BookingRecord }) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isConfirmed = booking.paymentStatus === "confirmed" || booking.status === "confirmed";
  const hasAdvance = booking.depositUsd && booking.depositUsd > 0;
  const isCancelled = booking.status === "cancelled" || booking.paymentStatus === "cancelled";

  const handleCancel = async () => {
    if (!booking.id) return;
    if (!cancelReason.trim()) {
      setError("Please provide a reason for cancellation");
      return;
    }

    setProcessing(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancel",
          reason: cancelReason.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to cancel booking");
      }

      setMessage("Booking cancelled successfully");
      setShowCancelModal(false);
      setCancelReason("");
      // Reload page to show updated status
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Could not cancel booking");
    } finally {
      setProcessing(false);
    }
  };

  const handleReversePayment = async () => {
    if (!booking.id) return;
    if (!refundReason.trim()) {
      setError("Please provide a reason for the refund");
      return;
    }

    setProcessing(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reverse-payment",
          reason: refundReason.trim(),
          amount: booking.depositUsd || 0,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to reverse payment");
      }

      setMessage("Payment reversed successfully");
      setShowRefundModal(false);
      setRefundReason("");
      // Reload page to show updated status
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Could not reverse payment");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="mt-6 space-y-3 rounded-2xl border-2 border-red-200 bg-red-50/50 p-5">
        <h2 className="font-display text-sm text-red-900">Admin Actions</h2>
        <p className="text-[0.85rem] text-red-800/80">
          Use these controls to cancel bookings or reverse payments when needed (e.g., no guide available, bad weather, customer request).
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          {!isCancelled && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="rounded-full border-2 border-red-400 bg-white px-4 py-2 text-[0.9rem] font-semibold text-red-700 hover:bg-red-50"
            >
              Cancel Booking
            </button>
          )}

          {isConfirmed && hasAdvance && booking.paymentStatus !== "refunded" && (
            <button
              type="button"
              onClick={() => setShowRefundModal(true)}
              className="rounded-full border-2 border-orange-400 bg-white px-4 py-2 text-[0.9rem] font-semibold text-orange-700 hover:bg-orange-50"
            >
              Reverse Payment
            </button>
          )}
        </div>

        {isCancelled && booking.cancellationReason && (
          <div className="mt-3 rounded-lg bg-red-100 p-3 text-xs text-red-900">
            <strong>Cancelled:</strong> {booking.cancellationReason}
          </div>
        )}

        {booking.paymentStatus === "refunded" && booking.refundReason && (
          <div className="mt-3 rounded-lg bg-orange-100 p-3 text-xs text-orange-900">
            <strong>Payment Refunded:</strong> {booking.refundReason}
            {booking.refundedAt && (
              <span className="ml-2 text-[0.7rem] opacity-75">
                ({new Date(booking.refundedAt).toLocaleDateString()})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="font-display text-lg text-sb-night">Cancel Booking</h3>
            <p className="mt-2 text-sm text-sb-ink/70">
              This will mark the booking as cancelled. Provide a reason (e.g., "No guide available", "Bad weather", "Customer request").
            </p>

            <textarea
              rows={4}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              className="mt-4 w-full rounded-lg border border-sb-mist bg-sb-shell/50 p-3 text-sm outline-none focus:border-sb-lagoon"
            />

            {error && (
              <p className="mt-2 text-xs text-red-600">{error}</p>
            )}
            {message && (
              <p className="mt-2 text-xs text-emerald-600">{message}</p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setError(null);
                }}
                className="flex-1 rounded-full border border-sb-mist bg-white px-4 py-2 text-sm font-semibold text-sb-ink hover:bg-sb-shell"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={processing || !cancelReason.trim()}
                className="flex-1 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {processing ? "Processing..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="font-display text-lg text-sb-night">Reverse Payment</h3>
            <p className="mt-2 text-sm text-sb-ink/70">
              This will mark the advance payment as refunded. Amount: <strong>USD {booking.depositUsd?.toFixed(2) || "0.00"}</strong>
            </p>
            <p className="mt-1 text-xs text-sb-ink/60">
              Note: This only updates the booking status. You'll need to process the actual refund through Ziina separately.
            </p>

            <textarea
              rows={4}
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Reason for refund (e.g., 'No guide available', 'Bad weather', 'Customer request')..."
              className="mt-4 w-full rounded-lg border border-sb-mist bg-sb-shell/50 p-3 text-sm outline-none focus:border-sb-lagoon"
            />

            {error && (
              <p className="mt-2 text-xs text-red-600">{error}</p>
            )}
            {message && (
              <p className="mt-2 text-xs text-emerald-600">{message}</p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundReason("");
                  setError(null);
                }}
                className="flex-1 rounded-full border border-sb-mist bg-white px-4 py-2 text-sm font-semibold text-sb-ink hover:bg-sb-shell"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReversePayment}
                disabled={processing || !refundReason.trim()}
                className="flex-1 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
              >
                {processing ? "Processing..." : "Confirm Refund"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

