// app/safaris/page.tsx

import Link from "next/link";

import packagesData from "@/data/packages.json";
import SafarisList from "@/components/safaris/SafarisList";

type Package = {
  slug: string;
  title: string;
  shortDescription?: string;
  priceFrom?: number | string;
  image?: string;
  gallery?: string[];
  days?: any[];
};

const packages = packagesData as Package[];

export const metadata = {
  title: "Flying Safaris from Zanzibar | Savana Blu Luxury Expeditions",
  description:
    "Flying safaris from Zanzibar to Tanzania's national parks – Selous, Mikumi, Tarangire, Ngorongoro, Serengeti and Lake Manyara. 1-3 day safari packages with flights included. Small-group and private options.",
  keywords: [
    "Zanzibar safari",
    "flying safari Tanzania",
    "Selous safari from Zanzibar",
    "Mikumi safari",
    "Tarangire safari",
    "Ngorongoro crater safari",
    "Serengeti safari from Zanzibar",
    "Lake Manyara safari",
    "Tanzania safari packages",
    "short safari from Zanzibar",
    "1 day safari",
    "2 day safari",
    "3 day safari",
    "boutique safari Tanzania",
  ].join(", "),
  openGraph: {
    title: "Flying Safaris from Zanzibar | Savana Blu",
    description:
      "Flying safaris from Zanzibar to Tanzania's national parks. 1-3 day safari packages with flights included. Small-group and private options.",
    type: "website",
    url: "https://savanablu.com/safaris",
    siteName: "Savana Blu Luxury Expeditions",
  },
  alternates: {
    canonical: "/safaris",
  },
};

export default function PackagesPage() {
  return (
    <main className="pb-20">
      {/* FULL-WIDTH IMAGE HERO – starts immediately after header */}
      <div className="relative -mx-4 sm:-mx-8 lg:-mx-24">
        <div className="relative h-[260px] sm:h-[320px] overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 bg-[url('/images/packages-hero.jpg')] bg-cover bg-center" />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-sb-night/85 via-sb-night/40 to-transparent" />
          {/* Content */}
          <div className="relative mx-auto flex h-full max-w-6xl items-end px-6 pb-8 pt-16 sm:px-8 sm:pb-10 sm:pt-0">
            <div className="max-w-xl space-y-3 text-sb-shell">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-sb-shell/80">
                Flying safaris from Zanzibar
              </p>
              <h1 className="font-display text-2xl text-sb-shell sm:text-3xl">
                Short safaris from Zanzibar to Tanzania&apos;s national parks
              </h1>
              <p className="text-[0.95rem] leading-relaxed text-sb-shell/90">
                Flying safaris from Zanzibar to Tanzania&apos;s national parks — Selous, Mikumi, Tarangire, Ngorongoro, Serengeti and Lake Manyara — arranged as 1–3 day outlines that we can adjust to fit your flights and pace.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-8 space-y-6">
        {/* Calm reassurance line */}
        <p className="text-[0.8rem] text-sb-ink/70">
          Each safari outline can be adjusted for your dates, flight preferences and pace. Payment is normally made in Zanzibar, with an optional secure online advance link sent after booking if you&apos;d like to lock in your dates.
        </p>

        {/* Safaris List with Filters */}
        <SafarisList safaris={packages} />

        {/* Gentle nudge to contact */}
        <div className="mt-8 p-6 rounded-2xl bg-sb-cream/30 border border-sb-mist/40">
          <p className="text-[0.9rem] text-sb-ink/80">
            <span>Want something more tailored? </span>
            <Link
              href="/contact"
              className="font-semibold text-sb-ocean underline underline-offset-2 hover:text-sb-night transition-colors"
            >
              Tell us your dates, flight preferences and who you&apos;re travelling
              with, and our team will sketch a simple outline.
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
