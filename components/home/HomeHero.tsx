"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";

const SLIDES = [
  {
    src: "/images/home-hero-1.jpg",
    alt: "Traditional dhow sailing over clear turquoise waters off Zanzibar",
  },
  {
    src: "/images/home-hero-2.jpg",
    alt: "Soft sunset light over a Zanzibar sandbank with guests relaxing",
  },
  {
    src: "/images/home-hero-3.jpg",
    alt: "Stone Town rooftop and alleys in the late afternoon golden light",
  },
  {
    src: "/images/home-hero-4.jpg",
    alt: "Guests wading in shallow warm water near a reef edge",
  },
];

export default function HomeHero() {
  const [index, setIndex] = useState(0);

  // Lightweight auto-rotation, no controls
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 7000); // 7 seconds per slide

    return () => clearInterval(interval);
  }, []);

  const currentAlt = SLIDES[index]?.alt ?? "Zanzibar ocean and coastal scenes";

  return (
    <section
      className="relative w-full min-h-[80vh] overflow-hidden"
      aria-label={currentAlt}
    >
      {/* Background slides */}
      <div className="absolute inset-0">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1600ms] ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${slide.src})` }}
            aria-hidden={i !== index}
          />
        ))}
        {/* Soft gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-sb-night/80 via-sb-night/45 to-black/30" />
      </div>

      {/* Hero content */}
      <div className="relative flex min-h-[80vh] items-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl space-y-5 text-sb-shell">
          <div className="h-1 w-20 rounded-full bg-gradient-to-r from-sb-shell/90 to-sb-ocean/90" />

          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-sb-shell/90">
            Savana Blu Luxury Expeditions
          </p>

          <h1 className="font-display text-3xl leading-tight sm:text-4xl">
            Zanzibar experiences & safaris, shaped around how you actually travel.
          </h1>

          <p className="max-w-2xl text-[0.98rem] leading-relaxed text-sb-shell/95">
            A Zanzibar-based team connecting island days with mainland safaris — from sandbanks and dhow trips to Selous, Mikumi, Tarangire, Ngorongoro and the Serengeti — through one calm, human conversation.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <ButtonLink href="/zanzibar-tours">Explore Zanzibar experiences</ButtonLink>
            <ButtonLink
              href="/safaris"
              variant="ghost"
              className="border border-sb-shell/40 bg-sb-shell/10 text-sb-shell hover:bg-sb-shell/20 hover:border-sb-shell/60"
            >
              Safaris & stays
            </ButtonLink>
          </div>

          <p className="max-w-2xl text-[0.9rem] leading-relaxed text-sb-shell/90">
            Start with a simple message – tell us your dates, where you are staying and who is travelling. We will suggest a mix of sea days, town time and safari that actually fits.
          </p>

          <div className="mt-4 grid gap-3 text-[0.82rem] text-sb-shell/90 sm:grid-cols-2">
            <div className="rounded-full bg-sb-shell/15 px-3 py-1.5">
              Boutique · team-led · locally connected
            </div>
            <div className="rounded-full bg-sb-shell/15 px-3 py-1.5">
              Small groups & private departures
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

