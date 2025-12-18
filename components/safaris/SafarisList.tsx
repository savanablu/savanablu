"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

import { SafariPriceDisplay } from "@/components/ui/SafariPriceDisplay";

type Safari = {
  slug: string;
  title: string;
  shortDescription?: string;
  priceFrom?: number | string;
  image?: string;
  gallery?: string[];
  days?: any[];
};

type SafarisListProps = {
  safaris: Safari[];
};

export default function SafarisList({ safaris }: SafarisListProps) {
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "duration">("default");
  const [filterBy, setFilterBy] = useState<"all" | "1-day" | "multi-day">("all");

  // Filter and sort safaris
  const filteredAndSortedSafaris = useMemo(() => {
    let filtered = safaris;

    // Filter by duration
    if (filterBy === "1-day") {
      filtered = filtered.filter((safari) => {
        const nights = Array.isArray(safari.days) && safari.days.length > 0 ? safari.days.length : 0;
        return nights === 1 || safari.title.toLowerCase().includes("1 day");
      });
    } else if (filterBy === "multi-day") {
      filtered = filtered.filter((safari) => {
        const nights = Array.isArray(safari.days) && safari.days.length > 0 ? safari.days.length : 0;
        return nights > 1 || safari.title.toLowerCase().includes("2 day") || safari.title.toLowerCase().includes("night");
      });
    }

    // Sort safaris
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "price-low") {
        const priceA = typeof a.priceFrom === "number" ? a.priceFrom : typeof a.priceFrom === "string" ? parseFloat(a.priceFrom) || Infinity : Infinity;
        const priceB = typeof b.priceFrom === "number" ? b.priceFrom : typeof b.priceFrom === "string" ? parseFloat(b.priceFrom) || Infinity : Infinity;
        return priceA - priceB;
      }
      if (sortBy === "price-high") {
        const priceA = typeof a.priceFrom === "number" ? a.priceFrom : typeof a.priceFrom === "string" ? parseFloat(a.priceFrom) || Infinity : Infinity;
        const priceB = typeof b.priceFrom === "number" ? b.priceFrom : typeof b.priceFrom === "string" ? parseFloat(b.priceFrom) || Infinity : Infinity;
        return priceB - priceA;
      }
      if (sortBy === "duration") {
        const durationA = Array.isArray(a.days) && a.days.length > 0 ? a.days.length : Infinity;
        const durationB = Array.isArray(b.days) && b.days.length > 0 ? b.days.length : Infinity;
        return durationA - durationB;
      }
      return 0; // default order
    });

    return sorted;
  }, [filterBy, sortBy, safaris]);

  return (
    <>
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-sb-mist/40">
        {/* Duration Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterBy("all")}
            className={`rounded-full px-4 py-1.5 text-[0.8rem] font-semibold transition-all ${
              filterBy === "all"
                ? "bg-sb-night text-sb-shell"
                : "bg-sb-mist/40 text-sb-ink/80 hover:bg-sb-mist/60"
            }`}
          >
            All safaris
          </button>
          <button
            onClick={() => setFilterBy("1-day")}
            className={`rounded-full px-4 py-1.5 text-[0.8rem] font-semibold transition-all ${
              filterBy === "1-day"
                ? "bg-sb-night text-sb-shell"
                : "bg-sb-mist/40 text-sb-ink/80 hover:bg-sb-mist/60"
            }`}
          >
            1 Day
          </button>
          <button
            onClick={() => setFilterBy("multi-day")}
            className={`rounded-full px-4 py-1.5 text-[0.8rem] font-semibold transition-all ${
              filterBy === "multi-day"
                ? "bg-sb-night text-sb-shell"
                : "bg-sb-mist/40 text-sb-ink/80 hover:bg-sb-mist/60"
            }`}
          >
            Multi-day
          </button>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <label className="text-[0.8rem] text-sb-ink/70 font-medium">
            Sort:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-lg border border-sb-mist/60 bg-white px-3 py-1.5 text-[0.8rem] text-sb-ink focus:outline-none focus:ring-2 focus:ring-sb-ocean/30 focus:border-sb-ocean"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="duration">Duration</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-[0.8rem] text-sb-ink/60">
        {filteredAndSortedSafaris.length} {filteredAndSortedSafaris.length === 1 ? "safari" : "safaris"} found
      </p>

      {/* Safaris grid */}
      {filteredAndSortedSafaris.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedSafaris.map((safari) => {
            const nights = Array.isArray(safari.days) && safari.days.length > 0 ? safari.days.length : undefined;
            const safariImage = safari.image || (safari.gallery && safari.gallery.length > 0 ? safari.gallery[0] : null);

            return (
              <article
                key={safari.slug}
                className="group flex flex-col rounded-2xl bg-white overflow-hidden shadow-sm ring-1 ring-sb-ink/5 transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-sb-ocean/20"
              >
                {/* Safari Image */}
                {safariImage ? (
                  <div className="relative h-56 w-full overflow-hidden bg-sb-mist/20">
                    <Image
                      src={safariImage}
                      alt={safari.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    {nights && (
                      <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-[0.75rem] font-semibold text-sb-night shadow-sm">
                          {nights} {nights === 1 ? "night" : "nights"}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-sb-shell/60 to-sb-lagoon/40">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#f4f0ea,_#d7e6e4)]" />
                    {nights && (
                      <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-[0.75rem] font-semibold text-sb-night shadow-sm">
                          {nights} {nights === 1 ? "night" : "nights"}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Card Content */}
                <div className="flex flex-col flex-1 p-5 space-y-3">
                  {/* Title and Description */}
                  <div className="space-y-2">
                    <h2 className="font-display text-lg text-sb-night leading-tight group-hover:text-sb-ocean transition-colors">
                      {safari.title}
                    </h2>

                    {safari.shortDescription && (
                      <p className="text-[0.9rem] leading-relaxed text-sb-ink/80 line-clamp-3">
                        {safari.shortDescription}
                      </p>
                    )}

                    {/* Duration info */}
                    {nights && (
                      <div className="flex items-center gap-1 text-[0.8rem] text-sb-ink/70">
                        <svg
                          className="h-3.5 w-3.5 text-sb-ocean"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Approx. {nights} {nights === 1 ? "night" : "nights"} in Zanzibar</span>
                      </div>
                    )}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Footer: Price + CTA */}
                  <div className="pt-3 border-t border-sb-mist/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[0.85rem] text-sb-ink/80">
                        <SafariPriceDisplay priceFrom={safari.priceFrom} />
                      </div>
                    </div>

                    <Link
                      href={`/safaris/${safari.slug}`}
                      className="block w-full text-center rounded-full bg-sb-night px-4 py-2.5 text-[0.85rem] font-semibold text-sb-shell hover:bg-sb-ocean transition-colors"
                    >
                      View itinerary
                    </Link>

                    <p className="text-[0.75rem] text-sb-ink/65 text-center">
                      Boutique outlines · easy to adjust for your flights and hotel choices
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-sb-ink/70 mb-4">No safaris found matching your filters.</p>
          <button
            onClick={() => setFilterBy("all")}
            className="text-sb-ocean font-semibold hover:underline"
          >
            View all safaris
          </button>
        </div>
      )}
    </>
  );
}

