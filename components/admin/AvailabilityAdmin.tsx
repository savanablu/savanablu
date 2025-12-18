"use client";

import { useEffect, useState } from "react";
import type { AvailabilityData } from "@/lib/data/availability";

type ItemSummary = {
  slug: string;
  title: string;
};

type Props = {
  tours: ItemSummary[];
  packages: ItemSummary[];
};

function addDateOnce(list: string[], date: string): string[] {
  if (!date) return list;
  if (list.includes(date)) return list;
  return [...list, date].sort();
}

function removeDate(list: string[], date: string): string[] {
  return list.filter((d) => d !== date);
}

export default function AvailabilityAdmin({ tours, packages }: Props) {
  const [data, setData] = useState<AvailabilityData>({
    globalBlocked: [],
    tours: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [newGlobalDate, setNewGlobalDate] = useState("");
  const [newTourDate, setNewTourDate] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/availability");
        if (!res.ok) throw new Error("Failed to load availability");

        const json = await res.json();
        if (!cancelled) {
          setData({
            globalBlocked: json.globalBlocked || [],
            tours: json.tours || {},
          });
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Could not load availability data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save");
      }
      setMessage("Availability updated.");
    } catch (err) {
      console.error(err);
      setError("Could not save availability. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddGlobal = () => {
    if (!newGlobalDate) return;

    setData((prev) => ({
      ...prev,
      globalBlocked: addDateOnce(prev.globalBlocked, newGlobalDate),
    }));
    setNewGlobalDate("");
  };

  const handleAddItemDate = (slug: string) => {
    const date = newTourDate[slug];
    if (!date) return;

    setData((prev) => {
      const current = prev.tours[slug] || [];
      return {
        ...prev,
        tours: {
          ...prev.tours,
          [slug]: addDateOnce(current, date),
        },
      };
    });

    setNewTourDate((prev) => ({ ...prev, [slug]: "" }));
  };

  const handleRemoveItemDate = (slug: string, date: string) => {
    setData((prev) => {
      const current = prev.tours[slug] || [];
      return {
        ...prev,
        tours: {
          ...prev.tours,
          [slug]: removeDate(current, date),
        },
      };
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/90 p-4 text-sm text-sb-ink">
        Loading availability…
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-2xl bg-white/90 p-4 text-sm text-sb-ink shadow-sm">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          {message}
        </p>
      )}

      {/* Global blocked dates */}
      <section className="space-y-3">
        <h2 className="font-display text-sm text-sb-night">
          Global blocked dates
        </h2>
        <p className="text-xs text-sb-ink/75">
          These dates are blocked for all day tours and multi-day packages
          (for example, full-closure days, public holidays or maintenance).
        </p>

        <div className="flex flex-wrap gap-2">
          {data.globalBlocked.length === 0 && (
            <span className="text-xs text-sb-ink/60">
              No global blocked dates.
            </span>
          )}
          {data.globalBlocked.map((date) => (
            <button
              key={date}
              type="button"
              onClick={() =>
                setData((prev) => ({
                  ...prev,
                  globalBlocked: removeDate(prev.globalBlocked, date),
                }))
              }
              className="inline-flex items-center gap-1 rounded-full bg-sb-shell/90 px-3 py-1 text-[0.85rem] text-sb-night hover:bg-sb-shell"
            >
              <span>{date}</span>
              <span className="text-sb-ink/60">×</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <input
            type="date"
            value={newGlobalDate}
            onChange={(e) => setNewGlobalDate(e.target.value)}
            className="rounded-md border border-sb-mist/80 bg-sb-shell/60 px-2 py-1 text-[0.78rem]"
          />
          <button
            type="button"
            onClick={handleAddGlobal}
            className="rounded-full bg-sb-night px-3 py-1 text-[0.85rem] font-semibold text-sb-shell hover:bg-sb-ocean"
          >
            Add global date
          </button>
        </div>
      </section>

      <hr className="border-sb-mist/60" />

      {/* Per-tour blocked dates */}
      <section className="space-y-4">
        <h2 className="font-display text-sm text-sb-night">Day tours</h2>
        <p className="text-xs text-sb-ink/75">
          Block dates for individual day tours (for example when a specific
          boat or guide is not available).
        </p>

        <div className="space-y-4">
          {tours.map((tour) => {
            const dates = data.tours[tour.slug] || [];

            return (
              <div
                key={tour.slug}
                className="rounded-2xl bg-sb-shell/80 p-3"
              >
                <p className="text-[0.9rem] font-semibold text-sb-night">
                  {tour.title}
                </p>
                <p className="text-[0.78rem] text-sb-ink/70">
                  Slug: <code>{tour.slug}</code>
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {dates.length === 0 && (
                    <span className="text-[0.78rem] text-sb-ink/60">
                      No blocked dates for this tour.
                    </span>
                  )}
                  {dates.map((date) => (
                    <button
                      key={date}
                      type="button"
                      onClick={() =>
                        handleRemoveItemDate(tour.slug, date)
                      }
                      className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[0.85rem] text-sb-night hover:bg-sb-shell/90"
                    >
                      <span>{date}</span>
                      <span className="text-sb-ink/60">×</span>
                    </button>
                  ))}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <input
                    type="date"
                    value={newTourDate[tour.slug] || ""}
                    onChange={(e) =>
                      setNewTourDate((prev) => ({
                        ...prev,
                        [tour.slug]: e.target.value,
                      }))
                    }
                    className="rounded-md border border-sb-mist/80 bg-sb-shell/60 px-2 py-1 text-[0.78rem]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddItemDate(tour.slug)}
                    className="rounded-full bg-sb-night px-3 py-1 text-[0.85rem] font-semibold text-sb-shell hover:bg-sb-ocean"
                  >
                    Add tour date
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <hr className="border-sb-mist/60" />

      {/* Per-package blocked dates */}
      <section className="space-y-4">
        <h2 className="font-display text-sm text-sb-night">
          Multi-day packages
        </h2>
        <p className="text-xs text-sb-ink/75">
          Block dates for specific itineraries (for example when a preferred
          lodge or guide is not available for that period).
        </p>

        <div className="space-y-4">
          {packages.map((pkg) => {
            const dates = data.tours[pkg.slug] || [];

            return (
              <div
                key={pkg.slug}
                className="rounded-2xl bg-sb-shell/80 p-3"
              >
                <p className="text-[0.9rem] font-semibold text-sb-night">
                  {pkg.title}
                </p>
                <p className="text-[0.78rem] text-sb-ink/70">
                  Slug: <code>{pkg.slug}</code>
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {dates.length === 0 && (
                    <span className="text-[0.78rem] text-sb-ink/60">
                      No blocked dates for this package.
                    </span>
                  )}
                  {dates.map((date) => (
                    <button
                      key={date}
                      type="button"
                      onClick={() =>
                        handleRemoveItemDate(pkg.slug, date)
                      }
                      className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[0.85rem] text-sb-night hover:bg-sb-shell/90"
                    >
                      <span>{date}</span>
                      <span className="text-sb-ink/60">×</span>
                    </button>
                  ))}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <input
                    type="date"
                    value={newTourDate[pkg.slug] || ""}
                    onChange={(e) =>
                      setNewTourDate((prev) => ({
                        ...prev,
                        [pkg.slug]: e.target.value,
                      }))
                    }
                    className="rounded-md border border-sb-mist/80 bg-sb-shell/60 px-2 py-1 text-[0.78rem]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddItemDate(pkg.slug)}
                    className="rounded-full bg-sb-night px-3 py-1 text-[0.85rem] font-semibold text-sb-shell hover:bg-sb-ocean"
                  >
                    Add package date
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-sb-night px-4 py-2 text-[0.9rem] font-semibold text-sb-shell hover:bg-sb-ocean disabled:opacity-70"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
