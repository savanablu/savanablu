// app/page.tsx

import Link from "next/link";

import Section from "@/components/ui/Section";

import HomeHero from "@/components/home/HomeHero";
import { HomeSafariHighlight } from "@/components/home/HomeSafariHighlight";



export default function HomePage() {
  // Build LocalBusiness structured data for SEO
  const localBusinessStructuredData = {
    "@context": "https://schema.org",
    "@type": "TouristInformationCenter",
    "name": "Savana Blu Luxury Expeditions",
    "description": "Boutique, small-group and private tours in Zanzibar – from Safari Blue and Mnemba reef to Stone Town, spice farms and sunset dhow cruises.",
    "url": "https://savanablu.com",
    "logo": "https://savanablu.com/images/logo-footer.png",
    "image": "https://savanablu.com/images/og-image.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Sogea",
      "addressRegion": "Zanzibar",
      "addressCountry": "TZ",
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+255-678-439-529",
      "contactType": "Customer Service",
      "email": "hello@savanablu.com",
      "availableLanguage": "English",
    },
    "sameAs": [],
    "priceRange": "$$",
    "areaServed": {
      "@type": "Place",
      "name": "Zanzibar, Tanzania",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessStructuredData) }}
      />

      <HomeHero />



      {/* A typical Savana Blu day */}

      <Section className="bg-sb-shell/95 py-12 sm:py-14">

        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">

          <div className="grid gap-8 md:grid-cols-[1.4fr,1fr] md:items-center">

            <div className="space-y-3">

              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-sb-ocean">

                A glimpse of how we host you

              </p>

              <h2 className="font-display text-xl text-sb-night sm:text-2xl">

                A typical Savana Blu day

              </h2>

              <p className="text-[0.96rem] leading-relaxed text-sb-ink/90">

                We are a Zanzibar-based team shaping experiences around how you actually travel, not fixed itineraries.

                Island time and mainland safaris, handled quietly and well.

                Thoughtful pacing, local knowledge, and the space to move at your own rhythm.

              </p>

              <div className="space-y-2 text-[0.94rem] leading-relaxed text-sb-ink/90">

                <p>

                  • Morning: relaxed pick-up from your hotel or villa.

                </p>

                <p>

                  • Day: time on the water, in Stone Town or out on safari after a short flight.

                </p>

                <p>

                  • Afternoon: gentle return, with room for a sunset or slow evening.

                </p>

              </div>

              <p className="text-[0.9rem] leading-relaxed text-sb-ink/90">

                One point of contact throughout — from your first WhatsApp to meeting one of our local guides.

              </p>

            </div>



            <div className="space-y-3 rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-sb-mist/80">

              <h3 className="font-display text-sm text-sb-night">

                The kind of guests we look after

              </h3>

              <p className="text-[0.9rem] leading-relaxed text-sb-ink/90">

                Couples, families, honeymooners and friends who prefer calm,

                local hosting over loud entertainment – people who like good notes,

                honest timings and days that feel quietly special rather than

                over–staged.

              </p>

              <p className="text-[0.9rem] leading-relaxed text-sb-ink/90">

                Share your dates and who you&apos;re travelling with and we&apos;ll

                suggest a simple plan: a mix of ocean, town and forest, with

                optional safari days if you&apos;re also heading inland.

              </p>

              <Link

                href="/contact"

                className="inline-flex text-[0.9rem] font-semibold text-sb-ocean hover:text-sb-night"

              >

                Start a calm conversation about your trip ↗

              </Link>

              <div className="mt-5 space-y-2 border-t border-sb-mist/50 pt-4">

                <p className="text-center text-[0.75rem] leading-relaxed text-sb-ink/70">

                  Many guests discover us through personal recommendations and trusted travel platforms.

                </p>

              </div>

            </div>

          </div>

        </div>

      </Section>

      <HomeSafariHighlight />

      {/* Soft pointers to Tours / Packages */}

      <Section className="bg-sb-shell/95 py-12 sm:py-14">

        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">

          <div className="grid gap-8 md:grid-cols-[1.4fr,1fr] md:items-center">

            <div className="space-y-3">

              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-sb-ocean">

                Where to look next

              </p>

              <h2 className="font-display text-xl text-sb-night sm:text-2xl">

                Experiences, Shaped Around How You Travel

              </h2>

              <div className="space-y-4 text-[0.95rem] leading-relaxed text-sb-ink/90">

                <div>

                  <p className="font-semibold text-sb-night mb-1">Zanzibar Experiences</p>

                  <p>

                    Unrushed days on the island, blending coast, culture, and quiet moments at an easy pace.

                  </p>

                </div>

                <div>

                  <p className="font-semibold text-sb-night mb-1">Safari Experiences</p>

                  <p>

                    Carefully planned safaris that balance wildlife encounters with comfort, timing, and space.

                  </p>

                </div>

              </div>

              <div className="flex flex-wrap gap-3 pt-1 text-[0.9rem]">

                <Link

                  href="/zanzibar-tours"

                  className="inline-flex items-center rounded-full bg-sb-night px-4 py-2 font-semibold text-sb-shell hover:bg-sb-ocean"

                >

                  Explore Zanzibar Experiences

                </Link>

                <Link

                  href="/safaris"

                  className="inline-flex items-center rounded-full bg-sb-shell px-4 py-2 font-semibold text-sb-night ring-1 ring-sb-mist/80 hover:bg-white"

                >

                  Explore Safari Experiences

                </Link>

              </div>

              <p className="text-[0.9rem] leading-relaxed text-sb-ink/90">

                Many of our experiences can also be enjoyed independently, or combined into a longer journey.

              </p>

            </div>



            <div className="space-y-3 rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-sb-mist/80">

              <h3 className="font-display text-sm text-sb-night">

                If you&apos;d like a human reply

              </h3>

              <p className="text-[0.9rem] leading-relaxed text-sb-ink/90">

                A short message with your dates, rough budget and any preferences

                (quiet beaches, more wildlife, extra time in Stone Town) is

                enough. We&apos;ll respond from Zanzibar time with suggestions

                that fit, not a scripted funnel.

              </p>

              <div className="space-y-1 text-[0.9rem] leading-relaxed text-sb-ink/90">

                <p>

                  Use the{" "}

                  <Link

                    href="/contact"

                    className="font-semibold text-sb-ocean hover:text-sb-night"

                  >

                    contact page

                  </Link>{" "}

                  to send a note.

                </p>

                <p>

                  Or tap the WhatsApp button on your screen to reach us directly

                  (UTC+3 – Zanzibar time). We reply personally, not with automated messages.

                </p>

              </div>

            </div>

          </div>

        </div>

      </Section>

    </>

  );

}
