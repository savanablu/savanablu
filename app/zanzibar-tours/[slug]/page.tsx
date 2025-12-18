// app/zanzibar-tours/[slug]/page.tsx

import toursData from "@/data/tours.json";

import Link from "next/link";
import Image from "next/image";

import Section from "@/components/ui/Section";

import BookingWidget from "@/components/booking/BookingWidget";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { PriceInfoBlock } from "@/components/ui/PriceInfoBlock";



type Tour = {

  slug: string;

  title: string;

  shortDescription?: string;

  description?: string;

  location?: string;

  durationHours?: number;

  basePrice?: number;

  category?: string;

  highlights?: string[];

  included?: string[];

  notIncluded?: string[];

  whatToBring?: string[];

  pickupTime?: string;

  images?: string[]; // NEW: optional images for gallery

};



const allTours = toursData as Tour[];



export default function TourDetailPage({

  params,

}: {

  params: { slug: string };

}) {

  const tour = allTours.find((t) => t.slug === params.slug);



  if (!tour) {

    return (

      <main className="mx-auto max-w-4xl px-4 py-16">

        <h1 className="mb-2 font-display text-2xl text-sb-night">

          Tour not found

        </h1>

        <p className="text-[0.95rem] text-sb-ink/80">

          We couldn&apos;t find that tour. Please return to the{" "}

          <Link

            href="/zanzibar-tours"

            className="font-semibold text-sb-ocean underline"

          >

            tours page

          </Link>{" "}

          and try again.

        </p>

      </main>

    );

  }



  const highlights = Array.isArray(tour.highlights) ? tour.highlights : [];

  const included = Array.isArray(tour.included) ? tour.included : [];

  const notIncluded = Array.isArray(tour.notIncluded)

    ? tour.notIncluded

    : [];

  const whatToBring = Array.isArray(tour.whatToBring)

    ? tour.whatToBring

    : [];

  const galleryImages = Array.isArray(tour.images) ? tour.images.slice(0, 3) : [];



  const basePrice =

    typeof tour.basePrice === "number" ? tour.basePrice : 0;



  return (

    <Section className="pb-20 pt-16">

      <div className="mx-auto max-w-5xl space-y-10">

        {/* HERO BANNER */}

        <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-sb-night via-sb-deep to-sb-ocean px-6 py-7 text-sb-shell shadow-md sm:px-8 sm:py-9">

          <div className="space-y-4">

            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-sb-shell/70">

              {tour.category || "Zanzibar experience"}

            </p>



            <h1 className="font-display text-2xl text-sb-shell sm:text-3xl">

              {tour.title}

            </h1>



            {tour.shortDescription && (

              <p className="max-w-3xl text-[0.95rem] leading-relaxed text-sb-shell/90">

                {tour.shortDescription}

              </p>

            )}



            {/* Info blocks inside the banner */}

            <div className="mt-4 grid gap-3 text-[0.85rem] sm:grid-cols-2 lg:grid-cols-4">

              {tour.durationHours && (

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

                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"

                      />

                    </svg>

                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/70">

                      Duration

                    </p>

                  </div>

                  <p className="font-medium text-sb-shell">

                    {tour.durationHours} hours{" "}

                    <span className="text-sb-shell/70">approx.</span>

                  </p>

                </div>

              )}



              {tour.location && (

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

                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"

                      />

                      <path

                        strokeLinecap="round"

                        strokeLinejoin="round"

                        strokeWidth={2}

                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"

                      />

                    </svg>

                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/70">

                      Area

                    </p>

                  </div>

                  <p className="font-medium text-sb-shell">{tour.location}</p>

                </div>

              )}



              {tour.pickupTime && (

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

                      Typical pick-up

                    </p>

                  </div>

                  <p className="font-medium text-sb-shell">{tour.pickupTime}</p>

                </div>

              )}



              {typeof tour.basePrice === "number" && (

                <PriceInfoBlock

                  label="From"

                  price={

                    <>

                      <PriceDisplay amountUSD={tour.basePrice} />{" "}

                      <span className="text-sb-shell/70">per adult</span>

                    </>

                  }

                />

              )}

            </div>

          </div>

        </header>



        {/* SMALL NOTE UNDER HERO */}

        <p className="text-[0.8rem] text-sb-ink/70">

          Exact timings and inclusions can shift slightly with tides, weather

          and the time of year. We&apos;ll confirm everything clearly in your

          personalised confirmation.

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

                  alt={`${tour.title} - Image ${idx + 1}`}

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

          {/* LEFT: story / highlights / what to bring */}

          <section className="space-y-8">

            {tour.description && (

              <div className="space-y-4 rounded-2xl bg-white/50 p-6 border border-sb-mist/40">

                <div className="flex items-center gap-2">

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

                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"

                    />

                  </svg>

                  <h2 className="font-display text-lg text-sb-night">

                    What the day feels like

                  </h2>

                </div>

                <div className="text-[0.95rem] leading-relaxed text-sb-ink/85 whitespace-pre-line">

                  {tour.description}

                </div>

              </div>

            )}



            {highlights.length > 0 && (

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

                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"

                    />

                  </svg>

                  <h2 className="font-display text-lg text-sb-night">

                    Highlights

                  </h2>

                </div>

                <ul className="space-y-2.5">

                  {highlights.map((h, i) => (

                    <li key={i} className="flex items-start gap-3 text-[0.9rem] text-sb-ink/85">

                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sb-ocean flex-shrink-0" />

                      <span>{h}</span>

                    </li>

                  ))}

                </ul>

              </div>

            )}



            {whatToBring.length > 0 && (

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

                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"

                    />

                  </svg>

                  <h2 className="font-display text-lg text-sb-night">

                    What to bring

                  </h2>

                </div>

                <ul className="space-y-2.5">

                  {whatToBring.map((item, i) => (

                    <li key={i} className="flex items-start gap-3 text-[0.9rem] text-sb-ink/85">

                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sb-ocean flex-shrink-0" />

                      <span>{item}</span>

                    </li>

                  ))}

                </ul>

              </div>

            )}

          </section>



          {/* RIGHT: includes / not included */}

          <aside className="space-y-6">

            <div className="lg:sticky lg:top-24 space-y-6">

              <div className="rounded-2xl bg-white/95 p-6 shadow-md border border-sb-mist/40">

                <h2 className="font-display text-lg text-sb-night mb-2">

                  What&apos;s included

                </h2>

                {included.length > 0 ? (

                  <ul className="mt-3 space-y-2.5">

                    {included.map((item, i) => (

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

                    Inclusions vary slightly by season. We&apos;ll confirm the

                    exact details in your confirmation message.

                  </p>

                )}

              </div>



              <div className="rounded-2xl bg-white/95 p-6 shadow-md border border-sb-mist/40">

                <h2 className="font-display text-lg text-sb-night mb-2">

                  What&apos;s not included

                </h2>

                {notIncluded.length > 0 ? (

                  <ul className="mt-3 space-y-2.5">

                    {notIncluded.map((item, i) => (

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

                    Flights, insurance and personal expenses are usually not

                    included. We&apos;ll note any extras clearly.

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

                Ready to book this tour?

              </h2>

              <p className="text-[0.9rem] text-sb-ink/80 max-w-2xl mx-auto">

                Book safely online with Savana Blu. We&apos;ll review your

                details and send a personal confirmation with timings, pick-up

                information and what to bring.

              </p>

            </div>



            <div className="bg-white rounded-xl p-6 shadow-sm border border-sb-mist/40">

              <BookingWidget

                bookingType="tour"

                itemSlug={tour.slug}

                itemTitle={tour.title}

                basePrice={basePrice}

              />

            </div>



            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-[0.85rem]">

              <Link

                href={`/contact?tour=${encodeURIComponent(tour.title)}`}

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

                href="/zanzibar-tours"

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

                Back to all tours

              </Link>

            </div>

          </div>

        </div>

      </div>

    </Section>

  );

}
