"use client";

import { useMemo, useState } from "react";
import type { Tour } from "@/lib/data/tours";
import { Button } from "@/components/ui/Button";
import TourCard from "./TourCard";

type Props = {
  tours: Tour[];
};

const CATEGORY_LABELS: Record<string, string> = {
  Sea: "Sea",
  Culture: "Culture",
  Nature: "Nature",
  "Signature Combo": "Signature Combos"
};

export default function ToursGrid({ tours }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    tours.forEach((tour) => set.add(tour.category));
    return Array.from(set);
  }, [tours]);

  const filteredTours =
    activeCategory === "All"
      ? tours
      : tours.filter((tour) => tour.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={activeCategory === "All" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setActiveCategory("All")}
        >
          All experiences
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "primary" : "secondary"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </Button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredTours.map((tour) => (
          <TourCard key={tour.slug} tour={tour} />
        ))}
      </div>

      {filteredTours.length === 0 && (
        <p className="text-sm text-sb-ink/70">
          No tours found in this category at the moment. Try a different filter
          or contact us for a bespoke arrangement.
        </p>
      )}
    </div>
  );
}
