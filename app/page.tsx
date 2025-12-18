// app/page.tsx

import Link from "next/link";

import Section from "@/components/ui/Section";

import HomeHero from "@/components/home/HomeHero";
import { HomeSafariHighlight } from "@/components/home/HomeSafariHighlight";
import TripAdvisorRated from "@/components/ui/TripAdvisorRated";



export default function HomePage() {

  return (

    <>

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

                We keep days unhurried, with time for the sea, stories and a

                quiet drink at the end – not rushing from one crowded stop to

                the next.

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

                One point of contact throughout – from your first WhatsApp to meeting your guide.

              </p>

            </div>



            <div className="space-y-3 rounded-3xl bg-white/90 p-5 shadow-sm ring-1 ring-sb-mist/80">

              <h3 className="font-display text-sm text-sb-night">

                The kind of guests we look after

              </h3>

              <p className="text-[0.9rem] leading-relaxed text-sb-ink/90">

                Couples, families, honeymooners and friends who prefer calm

                hosting over loud entertainment – people who like good notes,

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

              <div className="mt-5 flex justify-center border-t border-sb-mist/50 pt-4">

                <TripAdvisorRated />

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

                Start with a day, or sketch the whole journey

              </h2>

              <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">

                You can browse our Zanzibar day tours to get a feel for what

                resonates – Stone Town walks, spice and forest, ocean days and

                sandbanks – or you can look at multi–day combinations that link

                the islands with time on safari.

              </p>

              <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">

                If you&apos;re not sure where to begin, it&apos;s perfectly

                fine to just tell us your dates, who you&apos;re travelling with

                and any must–do dreams. We&apos;ll reply with a calm outline,

                not pressure.

              </p>

              <div className="flex flex-wrap gap-3 pt-1 text-[0.9rem]">

                <Link

                  href="/zanzibar-tours"

                  className="inline-flex items-center rounded-full bg-sb-night px-4 py-2 font-semibold text-sb-shell hover:bg-sb-ocean"

                >

                  Browse Zanzibar tours

                </Link>

                <Link

                  href="/safaris"

                  className="inline-flex items-center rounded-full bg-sb-shell px-4 py-2 font-semibold text-sb-night ring-1 ring-sb-mist/80 hover:bg-white"

                >

                  See safaris & stays

                </Link>

              </div>

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

                  (UTC+3 – Zanzibar time).

                </p>

              </div>

            </div>

          </div>

        </div>

      </Section>

    </>

  );

}
