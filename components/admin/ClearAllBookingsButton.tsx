"use client";

import { useState } from "react";

export default function ClearAllBookingsButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleClear = async () => {
    if (!confirm("⚠️ Are you sure you want to delete ALL bookings and enquiries? This cannot be undone!")) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Clear bookings
      const bookingsRes = await fetch("/api/admin/bookings/clear", {
        method: "POST",
      });
      const bookingsData = await bookingsRes.json();

      if (!bookingsRes.ok || !bookingsData.success) {
        throw new Error(bookingsData.error || "Failed to clear bookings");
      }

      // Clear enquiries
      const enquiriesRes = await fetch("/api/admin/crm-leads/clear", {
        method: "POST",
      });
      const enquiriesData = await enquiriesRes.json();

      if (!enquiriesRes.ok || !enquiriesData.success) {
        throw new Error(enquiriesData.error || "Failed to clear enquiries");
      }

      setMessage("✅ All bookings and enquiries cleared successfully! Refreshing...");
      // Reload page after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage(err instanceof Error ? err.message : "Failed to clear data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 flex flex-col items-end gap-2">
      <button
        onClick={handleClear}
        disabled={loading}
        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Clearing..." : "🗑️ Clear All Test Data (Bookings & Enquiries)"}
      </button>
      {message && (
        <p className={`text-xs ${message.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

