// app/zanzibar-tours/page.tsx

import Link from "next/link";

import toursData from "@/data/tours.json";
import ToursList from "@/components/tours/ToursList";

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

const tours = toursData as Tour[];

export const metadata = {
  title: "Zanzibar Tours | Savana Blu Luxury Expeditions",
  description:
    "Small-group and private tours in Zanzibar – Safari Blue, Stone Town, Prison Island, spice farms, Jozani Forest and coastal escapes.",
};

export default function ToursPage() {
  return (
    <main className="pb-20">
      {/* FULL-WIDTH IMAGE HERO – starts immediately after header */}
      <div className="relative -mx-4 sm:-mx-8 lg:-mx-24">
        <div className="relative h-[260px] sm:h-[320px] overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 bg-[url('/images/tours-hero.jpg')] bg-cover bg-center" />
          {/* Dark gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-sb-night/85 via-sb-night/40 to-transparent" />
          {/* Content */}
          <div className="relative mx-auto flex h-full max-w-6xl items-end px-6 pb-8 pt-16 sm:px-8 sm:pb-10 sm:pt-0">
            <div className="max-w-xl space-y-3 text-sb-shell">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-sb-shell/80">
                Zanzibar day tours
              </p>
              <h1 className="font-display text-2xl text-sb-shell sm:text-3xl">
                Zanzibar day tours & ocean experiences
              </h1>
              <p className="text-[0.95rem] leading-relaxed text-sb-shell/90">
                Dhow days, Stone Town heritage walks, spice farms, Jozani
                Forest and quiet reef time – curated gently for small groups and
                private stays.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-8 space-y-6">
        {/* Single global reassurance line */}
        <p className="text-[0.8rem] text-sb-ink/70">
          Payment normally made in Zanzibar on the day · Optional secure online advance link sent after booking · Children under 12 usually 50% of the adult rate.
        </p>

        {/* Tours List with Filters */}
        <ToursList tours={tours} />

        {/* Gentle nudge to contact */}
        <div className="mt-8 p-6 rounded-2xl bg-sb-cream/30 border border-sb-mist/40">
          <p className="text-[0.9rem] text-sb-ink/80">
            <span>Not sure which tour fits your stay? </span>
            <Link
              href="/contact"
              className="font-semibold text-sb-ocean underline underline-offset-2 hover:text-sb-night transition-colors"
            >
              Tell us your dates and hotel and we&apos;ll suggest a gentle combination.
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
