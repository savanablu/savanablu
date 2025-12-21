// app/safaris/[slug]/page.tsx

import packagesData from "@/data/packages.json";

import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import Section from "@/components/ui/Section";

import BookingWidget from "@/components/booking/BookingWidget";
import { SafariPriceDisplay } from "@/components/ui/SafariPriceDisplay";
import { PriceInfoBlock } from "@/components/ui/PriceInfoBlock";
import PageVisitTracker from "@/components/analytics/PageVisitTracker";



type Package = {

  slug: string;

  title: string;

  shortDescription?: string;

  priceFrom?: number | string;

  days?: any[];

  includes?: string[];

  excludes?: string[];

  image?: string;

  gallery?: string[];

};



const allPackages = packagesData as Package[];



export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const pkg = allPackages.find((p) => p.slug === params.slug);

  if (!pkg) {
    return {
      title: "Safari Package Not Found",
      description: "The requested safari package could not be found.",
    };
  }

  const days = Array.isArray(pkg.days) ? pkg.days : [];
  const nights = days.length > 0 ? days.length : undefined;
  const priceFrom = typeof pkg.priceFrom === "number" ? pkg.priceFrom : 0;
  
  // Build SEO-friendly description
  const description = pkg.shortDescription 
    ? `${pkg.shortDescription} Book your ${nights ? `${nights}-night ` : ""}flying safari from Zanzibar to Tanzania's national parks with Savana Blu. From $${priceFrom} per person.`
    : `Book ${pkg.title} with Savana Blu. Flying safari from Zanzibar to Tanzania's national parks. Small-group and private options available.`;

  // Extract location keywords from title
  const locationKeywords = pkg.title
    .toLowerCase()
    .match(/(selous|mikumi|tarangire|ngorongoro|serengeti|manyara)/g)
    ?.join(", ") || "Tanzania";

  const imageUrl = pkg.image 
    ? `https://savanablu.com${pkg.image}`
    : "https://savanablu.com/images/og-image.jpg";

  return {
    title: `${pkg.title} | Savana Blu Luxury Expeditions`,
    description,
    keywords: [
      "Zanzibar safari",
      "flying safari",
      "Tanzania safari",
      locationKeywords,
      "Selous safari",
      "Mikumi safari",
      "Tarangire safari",
      "Ngorongoro safari",
      "Serengeti safari",
      "Zanzibar to mainland safari",
      "small group safari",
      "boutique safari Tanzania",
    ].join(", "),
    openGraph: {
      title: `${pkg.title} | Savana Blu`,
      description,
      type: "website",
      url: `https://savanablu.com/safaris/${pkg.slug}`,
      siteName: "Savana Blu Luxury Expeditions",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: pkg.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pkg.title} | Savana Blu`,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/safaris/${pkg.slug}`,
    },
  };
}



export default function PackageDetailPage({

  params,

}: {

  params: { slug: string };

}) {

  const pkg = allPackages.find((p) => p.slug === params.slug);



  if (!pkg) {

    return (

      <main className="mx-auto max-w-4xl px-4 py-16">

        <h1 className="mb-2 font-display text-2xl text-sb-night">

          Package not found

        </h1>

        <p className="text-[0.95rem] text-sb-ink/80">

          We couldn&apos;t find that itinerary. Please return to the{" "}

          <Link

            href="/safaris"

            className="font-semibold text-sb-ocean underline"

          >

            packages page

          </Link>{" "}

          and try again.

        </p>

      </main>

    );

  }



  const days = Array.isArray(pkg.days) ? pkg.days : [];

  const nights = days.length > 0 ? days.length : undefined;



  const includes = Array.isArray(pkg.includes) ? pkg.includes : [];

  const excludes = Array.isArray(pkg.excludes) ? pkg.excludes : [];






  const basePrice =

    typeof pkg.priceFrom === "number" ? pkg.priceFrom : 0;



  const galleryFromData = Array.isArray(pkg.gallery) ? pkg.gallery : [];

  const galleryImages =

    galleryFromData.length > 0

      ? galleryFromData.slice(0, 3)

      : pkg.image

      ? [pkg.image]

      : [];



  // Build structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": pkg.title,
    "description": pkg.shortDescription || pkg.title,
    "url": `https://savanablu.com/safaris/${pkg.slug}`,
    "image": pkg.image ? `https://savanablu.com${pkg.image}` : "https://savanablu.com/images/og-image.jpg",
    "provider": {
      "@type": "TouristInformationCenter",
      "name": "Savana Blu Luxury Expeditions",
      "url": "https://savanablu.com",
    },
    "tourBookingPage": `https://savanablu.com/safaris/${pkg.slug}`,
    "itinerary": {
      "@type": "ItemList",
      "numberOfItems": days.length,
      "itemListElement": days.map((day, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": typeof day === "object" && day.title ? day.title : `Day ${index + 1}`,
        "description": typeof day === "object" && day.description ? day.description : (typeof day === "string" ? day : ""),
      })),
    },
    ...(basePrice > 0 && {
      "offers": {
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": basePrice,
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "priceCurrency": "USD",
          "price": basePrice,
          "valueAddedTaxIncluded": false,
        },
        "availability": "https://schema.org/InStock",
        "url": `https://savanablu.com/safaris/${pkg.slug}`,
      },
    }),
  };

  return (
    <>
      <PageVisitTracker slug={pkg.slug} type="safari" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Section className="pb-20 pt-16">
        <div className="mx-auto max-w-5xl space-y-10">

        {/* HERO BANNER */}

        <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-sb-night via-sb-deep to-sb-ocean px-6 py-7 text-sb-shell shadow-md sm:px-8 sm:py-9">

          <div className="space-y-4">

            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-sb-shell/75">

              Zanzibar stays & combinations

            </p>



            <h1 className="font-display text-2xl text-sb-shell sm:text-3xl">

              {pkg.title}

            </h1>



            {pkg.shortDescription && (

              <p className="max-w-3xl text-[0.95rem] leading-relaxed text-sb-shell/90">

                {pkg.shortDescription}

              </p>

            )}



            {/* Info blocks inside the banner */}

            <div className="mt-4 grid gap-3 text-[0.85rem] sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-2xl bg-sb-shell/10 backdrop-blur-sm px-4 py-3 border border-sb-shell/20">

                <div className="flex items-center gap-2 mb-1">

                  <svg

                    className="h-4 w-4 text-sb-shell/90"

                    fill="none"

                    viewBox="0 0 24 24"

                    stroke="currentColor"

                  >

                    <path

                      strokeLinecap="round"

                      strokeLinejoin="round"

                      strokeWidth={2}

                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"

                    />

                  </svg>

                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/70">

                    Outline

                  </p>

                </div>

                <p className="font-medium text-sb-shell">

                  Multi-day Zanzibar stay

                  <span className="text-sb-shell/70">

                    {" "}

                    · easy to adjust

                  </span>

                </p>

              </div>



              {nights && (

                <div className="rounded-2xl bg-sb-shell/10 backdrop-blur-sm px-4 py-3 border border-sb-shell/20">

                  <div className="flex items-center gap-2 mb-1">

                    <svg

                      className="h-4 w-4 text-sb-shell/90"

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

                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/70">

                      Approx. length

                    </p>

                  </div>

                  <p className="font-medium text-sb-shell">

                    {nights} nights{" "}

                    <span className="text-sb-shell/70">

                      {" "}

                      in Zanzibar

                    </span>

                  </p>

                </div>

              )}



              <PriceInfoBlock

                label="From"

                price={

                  <>

                    <SafariPriceDisplay priceFrom={pkg.priceFrom} prefix="" />{" "}

                    <span className="text-sb-shell/70">for this outline</span>

                  </>

                }

              />



              <div className="rounded-2xl bg-sb-shell/10 backdrop-blur-sm px-4 py-3 border border-sb-shell/20">

                <div className="flex items-center gap-2 mb-1">

                  <svg

                    className="h-4 w-4 text-sb-shell/90"

                    fill="none"

                    viewBox="0 0 24 24"

                    stroke="currentColor"

                  >

                    <path

                      strokeLinecap="round"

                      strokeLinejoin="round"

                      strokeWidth={2}

                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"

                    />

                  </svg>

                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/70">

                    Style

                  </p>

                </div>

                <p className="font-medium text-sb-shell">

                  {pkg.slug === "selous-2-day-flying-safari-from-zanzibar" ||
                  pkg.slug === "mikumi-1-day-flying-safari-from-zanzibar" ||
                  pkg.slug === "selous-1-day-flying-safari-from-zanzibar" ||
                  pkg.slug === "mikumi-2-day-flying-safari-from-zanzibar" ||
                  pkg.slug === "manyara-tarangire-2-day-safari-from-zanzibar" ||
                  pkg.slug === "tarangire-ngorongoro-2-day-safari-from-zanzibar" ||
                  pkg.slug === "ngorongoro-tarangire-manyara-3-day-safari-from-zanzibar" ||
                  pkg.slug === "serengeti-3-day-flying-safari-from-zanzibar"
                    ? "Safari & wilderness"
                    : "Beach & culture"}{" "}

                  <span className="text-sb-shell/70">

                    {" "}

                    at an unhurried pace

                  </span>

                </p>

              </div>

            </div>

          </div>

        </header>



        {/* SMALL NOTE UNDER HERO */}

        <p className="text-[0.8rem] text-sb-ink/70">

          Think of this as a starting sketch. We can trim or stretch nights,

          {pkg.slug === "selous-2-day-flying-safari-from-zanzibar" ||
          pkg.slug === "mikumi-1-day-flying-safari-from-zanzibar" ||
          pkg.slug === "selous-1-day-flying-safari-from-zanzibar" ||
          pkg.slug === "mikumi-2-day-flying-safari-from-zanzibar" ||
          pkg.slug === "manyara-tarangire-2-day-safari-from-zanzibar" ||
          pkg.slug === "tarangire-ngorongoro-2-day-safari-from-zanzibar" ||
          pkg.slug === "ngorongoro-tarangire-manyara-3-day-safari-from-zanzibar" ||
          pkg.slug === "serengeti-3-day-flying-safari-from-zanzibar"
            ? " adjust the timing and activities,"
            : " adjust the balance of activities and locations,"}{" "}
          and match the stay to

          your flights and preferred pace. Everything is confirmed clearly in

          writing before you travel.

        </p>



        {/* OPTIONAL IMAGE GALLERY */}

        {galleryImages.length > 0 && (

          <div className="grid gap-3 sm:grid-cols-3">

            {galleryImages.map((src, idx) => (

              <div

                key={idx}

                className="group relative h-48 sm:h-56 w-full overflow-hidden rounded-2xl bg-sb-shell/60 cursor-pointer"

              >

                <Image

                  src={src}

                  alt={`${pkg.title} - Image ${idx + 1}`}

                  fill

                  className="object-cover transition-transform duration-300 group-hover:scale-110"

                  sizes="(max-width: 640px) 100vw, 33vw"

                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              </div>

            ))}

          </div>

        )}



        {/* Main content grid */}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)]">

          {/* LEFT: outline day by day */}

          <section className="space-y-8">

            <div className="rounded-2xl bg-white/50 p-6 border border-sb-mist/40">

              <div className="flex items-center gap-2 mb-4">

                <svg

                  className="h-5 w-5 text-sb-ocean"

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

                <h2 className="font-display text-lg text-sb-night">

                  Outline day by day

                </h2>

              </div>



              {days.length === 0 && (

                <p className="text-[0.9rem] text-sb-ink/80">

                  We&apos;re still finalising the day-by-day outline for this

                  package. In the meantime,{" "}

                  <Link

                    href="/contact"

                    className="font-semibold text-sb-ocean hover:underline"

                  >

                    contact us

                  </Link>{" "}

                  and we&apos;ll sketch a simple plan for your dates.

                </p>

              )}

            </div>



            {days.map((day, index) => {

              const dayNumber = index + 1;



              if (typeof day === "string") {

                return (

                  <article

                    key={index}

                    className="rounded-2xl border border-sb-mist/60 bg-white/50 p-6 shadow-sm hover:shadow-md transition-shadow"

                  >

                    <div className="flex items-center gap-3 mb-3">

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sb-ocean/10 text-sb-ocean">

                        <span className="text-sm font-semibold">{dayNumber}</span>

                      </div>

                      <p className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-sb-ink/60">

                        Day {dayNumber}

                      </p>

                    </div>

                    <p className="text-[0.9rem] leading-relaxed text-sb-ink/85">{day}</p>

                  </article>

                );

              }



              const anyDay = day as Record<string, any>;

              const title: string =

                anyDay.title || anyDay.name || `Day ${dayNumber} in Zanzibar`;

              const description: string =

                anyDay.description || anyDay.summary || anyDay.text || "";

              const activities: string[] = Array.isArray(anyDay.activities)

                ? anyDay.activities

                : [];



              return (

                <article

                  key={index}

                  className="rounded-2xl border border-sb-mist/60 bg-white/50 p-6 shadow-sm hover:shadow-md transition-shadow"

                >

                  <div className="flex items-center gap-3 mb-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sb-ocean/10 text-sb-ocean">

                      <span className="text-sm font-semibold">{dayNumber}</span>

                    </div>

                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-sb-ink/60">

                      Day {dayNumber}

                    </p>

                  </div>

                  <h3 className="mt-1 font-display text-base text-sb-night mb-3">

                    {title}

                  </h3>

                  {description && (

                    <p className="mt-2 text-[0.9rem] leading-relaxed text-sb-ink/85 whitespace-pre-line">

                      {description}

                    </p>

                  )}

                  {activities.length > 0 && (

                    <ul className="mt-3 space-y-2">

                      {activities.map((act, i) => (

                        <li key={i} className="flex items-start gap-3 text-[0.85rem] text-sb-ink/85">

                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sb-ocean flex-shrink-0" />

                          <span>{act}</span>

                        </li>

                      ))}

                    </ul>

                  )}

                </article>

              );

            })}

          </section>



          {/* RIGHT: includes / excludes */}

          <aside className="space-y-6">

            <div className="lg:sticky lg:top-24 space-y-6">

              <div className="rounded-2xl bg-white/95 p-6 shadow-md border border-sb-mist/40">

                <h2 className="font-display text-lg text-sb-night mb-2">

                  What&apos;s typically included

                </h2>

                {includes.length > 0 ? (

                  <ul className="mt-3 space-y-2.5">

                    {includes.map((item, i) => (

                      <li key={i} className="flex items-start gap-3 text-[0.85rem] text-sb-ink/85">

                        <svg

                          className="h-4 w-4 text-sb-ocean mt-0.5 flex-shrink-0"

                          fill="none"

                          viewBox="0 0 24 24"

                          stroke="currentColor"

                        >

                          <path

                            strokeLinecap="round"

                            strokeLinejoin="round"

                            strokeWidth={2}

                            d="M5 13l4 4L19 7"

                          />

                        </svg>

                        <span>{item}</span>

                      </li>

                    ))}

                  </ul>

                ) : (

                  <p className="mt-3 text-[0.85rem] text-sb-ink/80">

                    Inclusions vary slightly by season and hotel. We&apos;ll

                    confirm exactly what&apos;s included when you enquire.

                  </p>

                )}

              </div>



              <div className="rounded-2xl bg-white/95 p-6 shadow-md border border-sb-mist/40">

                <h2 className="font-display text-lg text-sb-night mb-2">

                  What&apos;s usually not included

                </h2>

                {excludes.length > 0 ? (

                  <ul className="mt-3 space-y-2.5">

                    {excludes.map((item, i) => (

                      <li key={i} className="flex items-start gap-3 text-[0.85rem] text-sb-ink/85">

                        <svg

                          className="h-4 w-4 text-sb-coral mt-0.5 flex-shrink-0"

                          fill="none"

                          viewBox="0 0 24 24"

                          stroke="currentColor"

                        >

                          <path

                            strokeLinecap="round"

                            strokeLinejoin="round"

                            strokeWidth={2}

                            d="M6 18L18 6M6 6l12 12"

                          />

                        </svg>

                        <span>{item}</span>

                      </li>

                    ))}

                  </ul>

                ) : (

                  <p className="mt-3 text-[0.85rem] text-sb-ink/80">

                    Flights to Zanzibar, long-haul travel insurance and most

                    personal expenses are typically not included. We&apos;ll

                    spell this out clearly before you pay anything.

                  </p>

                )}

              </div>

            </div>

          </aside>

        </div>



        {/* BOOKING BLOCK */}

        <div className="mt-8 rounded-2xl bg-gradient-to-br from-sb-cream/40 to-sb-shell/30 p-6 sm:p-8 border border-sb-mist/40 shadow-sm">

          <div className="max-w-4xl mx-auto">

            <div className="text-center mb-6">

              <h2 className="font-display text-2xl text-sb-night mb-2">

                Ready to book this package?

              </h2>

              <p className="text-[0.9rem] text-sb-ink/80 max-w-2xl mx-auto">

                You can secure this outline with a simple online booking. We

                review every request personally and confirm the details of your

                stay, transfers and day-by-day plan.

              </p>

            </div>



            <div className="bg-white rounded-xl p-6 shadow-sm border border-sb-mist/40">

              <BookingWidget

                bookingType="package"

                itemSlug={pkg.slug}

                itemTitle={pkg.title}

                basePrice={basePrice}

              />

            </div>



            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-[0.85rem]">

              <Link

                href={`/contact?package=${encodeURIComponent(pkg.title)}`}

                className="flex items-center gap-2 font-semibold text-sb-ocean hover:text-sb-night transition-colors"

              >

                <svg

                  className="h-4 w-4"

                  fill="none"

                  viewBox="0 0 24 24"

                  stroke="currentColor"

                >

                  <path

                    strokeLinecap="round"

                    strokeLinejoin="round"

                    strokeWidth={2}

                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"

                  />

                </svg>

                Prefer to enquire first?

              </Link>

              <span className="hidden sm:inline text-sb-ink/40">•</span>

              <Link

                href="/safaris"

                className="flex items-center gap-2 text-sb-ink/80 hover:text-sb-ocean transition-colors"

              >

                <svg

                  className="h-4 w-4"

                  fill="none"

                  viewBox="0 0 24 24"

                  stroke="currentColor"

                >

                  <path

                    strokeLinecap="round"

                    strokeLinejoin="round"

                    strokeWidth={2}

                    d="M10 19l-7-7m0 0l7-7m-7 7h18"

                  />

                </svg>

                Back to all packages

              </Link>

            </div>

          </div>

        </div>

      </div>

      </Section>
    </>
  );

}
