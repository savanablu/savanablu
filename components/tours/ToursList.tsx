"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

import { PriceDisplay } from "@/components/ui/PriceDisplay";

type Tour = {
  slug: string;
  title: string;
  shortDescription?: string;
  location?: string;
  durationHours?: number;
  basePrice?: number;
  category?: string;
  images?: string[];
};

type ToursListProps = {
  tours: Tour[];
};

// Get unique categories
const getCategories = (tours: Tour[]) => {
  return Array.from(
    new Set(tours.map((tour) => tour.category).filter(Boolean))
  ) as string[];
};

export default function ToursList({ tours }: ToursListProps) {
  const categories = getCategories(tours);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "duration">("default");

  // Filter and sort tours
  const filteredAndSortedTours = useMemo(() => {
    let filtered = tours;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((tour) => tour.category === selectedCategory);
    }

    // Sort tours
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "price-low") {
        const priceA = a.basePrice ?? Infinity;
        const priceB = b.basePrice ?? Infinity;
        return priceA - priceB;
      }
      if (sortBy === "price-high") {
        const priceA = a.basePrice ?? Infinity;
        const priceB = b.basePrice ?? Infinity;
        return priceB - priceA;
      }
      if (sortBy === "duration") {
        const durationA = a.durationHours ?? Infinity;
        const durationB = b.durationHours ?? Infinity;
        return durationA - durationB;
      }
      return 0; // default order
    });

    return sorted;
  }, [selectedCategory, sortBy, tours]);

  return (
    <>
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-sb-mist/40">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`rounded-full px-4 py-1.5 text-[0.8rem] font-semibold transition-all ${
              selectedCategory === "All"
                ? "bg-sb-night text-sb-shell"
                : "bg-sb-mist/40 text-sb-ink/80 hover:bg-sb-mist/60"
            }`}
          >
            All tours
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-1.5 text-[0.8rem] font-semibold transition-all ${
                selectedCategory === category
                  ? "bg-sb-night text-sb-shell"
                  : "bg-sb-mist/40 text-sb-ink/80 hover:bg-sb-mist/60"
              }`}
            >
              {category}
            </button>
          ))}
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
        {filteredAndSortedTours.length} {filteredAndSortedTours.length === 1 ? "tour" : "tours"} found
      </p>

      {/* Tours grid */}
      {filteredAndSortedTours.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedTours.map((tour) => {
            const tourImage = tour.images && tour.images.length > 0 ? tour.images[0] : null;

            return (
              <article
                key={tour.slug}
                className="group flex flex-col rounded-2xl bg-white overflow-hidden shadow-sm ring-1 ring-sb-ink/5 transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-sb-ocean/20"
              >
                {/* Tour Image */}
                {tourImage ? (
                  <div className="relative h-48 w-full overflow-hidden bg-sb-mist/20">
                    <Image
                      src={tourImage}
                      alt={tour.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {tour.category && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-sb-night shadow-sm">
                          {tour.category}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  tour.category && (
                    <div className="px-5 pt-5">
                      <span className="inline-flex items-center rounded-full bg-sb-shell/80 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-sb-ink/70">
                        {tour.category}
                      </span>
                    </div>
                  )
                )}

                {/* Card Content */}
                <div className="flex flex-col flex-1 p-5 space-y-3">
                  {/* Title and Description */}
                  <div className="space-y-2">
                    <h2 className="font-display text-lg text-sb-night leading-tight group-hover:text-sb-ocean transition-colors">
                      {tour.title}
                    </h2>

                    {tour.shortDescription && (
                      <p className="text-[0.9rem] leading-relaxed text-sb-ink/80 line-clamp-2">
                        {tour.shortDescription}
                      </p>
                    )}

                    {/* Location and Duration */}
                    <div className="flex items-center gap-2 text-[0.8rem] text-sb-ink/70">
                      {tour.location && (
                        <span className="flex items-center gap-1">
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
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="font-medium">{tour.location}</span>
                        </span>
                      )}
                      {tour.durationHours && (
                        <span className="flex items-center gap-1">
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{tour.durationHours} hours</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Footer: Price + CTA */}
                  <div className="pt-3 border-t border-sb-mist/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[0.85rem] text-sb-ink/80">
                        {typeof tour.basePrice === "number" ? (
                          <>
                            From{" "}
                            <PriceDisplay
                              amountUSD={tour.basePrice}
                              className="font-display text-lg text-sb-night"
                            />{" "}
                            <span className="text-[0.75rem]">per adult</span>
                          </>
                        ) : (
                          <span className="text-sb-ink/70">Pricing on request</span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/zanzibar-tours/${tour.slug}`}
                      className="block w-full text-center rounded-full bg-sb-night px-4 py-2.5 text-[0.85rem] font-semibold text-sb-shell hover:bg-sb-ocean transition-colors"
                    >
                      View details
                    </Link>

                    <p className="text-[0.75rem] text-sb-ink/65 text-center">
                      Boutique experiences · small groups · private options available
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-sb-ink/70 mb-4">No tours found in this category.</p>
          <button
            onClick={() => setSelectedCategory("All")}
            className="text-sb-ocean font-semibold hover:underline"
          >
            View all tours
          </button>
        </div>
      )}
    </>
  );
}





