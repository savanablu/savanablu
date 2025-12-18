// app/about/page.tsx

import Section from "@/components/ui/Section";
import TripAdvisorCertificate from "@/components/ui/TripAdvisorCertificate";



export const metadata = {

  title: "About Savana Blu Luxury Expeditions | Zanzibar & Safari",

  description:

    "Savana Blu is a small Zanzibar-based team curating calm ocean days, Stone Town walks and thoughtful links with East African safaris.",

};



export default function AboutPage() {

  return (

    <Section className="pb-20 pt-16">

      {/* Wider container to match FAQ */}
      <div className="mx-auto max-w-6xl space-y-8">

        {/* HERO – matches FAQ hero layout exactly */}

        <header className="relative min-h-[340px] overflow-hidden rounded-3xl shadow-sm ring-1 ring-sb-mist/70">

        {/* Background image */}

        <div className="absolute inset-0">

          <div

            className="h-full w-full bg-cover bg-center"

            style={{ backgroundImage: "url(/images/about-hero.jpg)" }}

          />

          {/* Darker overlay for text legibility */}

          <div className="absolute inset-0 bg-gradient-to-br from-sb-night/65 via-sb-night/45 to-sb-ocean/25" />

          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/45 to-transparent" />

        </div>



        {/* Content */}

        <div className="relative px-6 py-8 text-sb-shell sm:px-8 sm:py-10">

          {/* Dark panel behind main copy for extra contrast */}

          <div className="inline-block rounded-2xl bg-sb-night/40 px-4 py-3 backdrop-blur-sm sm:px-5 sm:py-4">

            <div className="h-1 w-20 rounded-full bg-gradient-to-r from-sb-shell/85 to-sb-ocean/90" />



            <div className="mt-4 space-y-3">

              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-sb-shell/90">

                About Savana Blu

              </p>

              <h1 className="font-display text-2xl text-sb-shell sm:text-3xl">

                A Zanzibar team linking sea days and safaris

              </h1>

              <p className="max-w-3xl text-[0.95rem] leading-relaxed text-sb-shell/95">

                A boutique team based in Sogea, on the Zanzibar islands, offering quiet island days and safaris to Mikumi and Selous. We plan both sides together so your coast and bush time feels like one continuous trip.

              </p>

            </div>

          </div>



          <div className="mt-5 grid gap-3 text-[0.85rem] sm:grid-cols-3">

            <div className="rounded-2xl bg-sb-shell/16 px-3 py-2 backdrop-blur-sm">

              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/90">

                Zanzibar first

              </p>

              <p className="mt-0.5 text-sb-shell/95">

                We work around real tides, light and sea conditions.

              </p>

            </div>

            <div className="rounded-2xl bg-sb-shell/18 px-3 py-2 backdrop-blur-sm">

              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/90">

                Boutique group sizes

              </p>

              <p className="mt-0.5 text-sb-shell/95">

                Small groups and private options available.

              </p>

            </div>

            <div className="rounded-2xl bg-sb-shell/20 px-3 py-2 backdrop-blur-sm">

              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/90">

                Safari connections

              </p>

              <p className="mt-0.5 text-sb-shell/95">

                Calm advice on combining safari with coast time.

              </p>

            </div>

          </div>

        </div>

      </header>



      {/* MAIN CONTENT */}

        {/* Who we are */}

        <section className="grid gap-6 rounded-3xl bg-white/95 p-6 shadow-sm ring-1 ring-sb-mist/80 sm:p-8 md:grid-cols-[1.4fr,1fr]">

          <div className="space-y-3">

            <h2 className="font-display text-lg text-sb-night">Who we are</h2>

            <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">

              We design Zanzibar days, short breaks and safaris that fit around your flights, energy levels and the people you&apos;re travelling with. Rather than selling fixed, rigid itineraries, we start with your dates and where you are staying, then suggest a calm mix of Stone Town, reef time and safari.

            </p>

            <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">

              We focus on the kinds of days we enjoy ourselves: time on the

              water in traditional dhows, unhurried walks through Stone Town,

              spice and forest visits at a gentle pace, and clear, honest

              conversations about how to weave these together with safari time

              on the mainland.

            </p>

            <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">

              Our guests are often couples, families, friends and honeymooners

              who value calm hosting over loud entertainment – people who would

              rather remember a few well–chosen experiences than rush through a

              crowded schedule.

            </p>

          </div>

          <div className="space-y-3 rounded-2xl bg-sb-shell/80 p-4 text-[0.9rem] text-sb-ink/90 sm:p-5">

            <h3 className="font-display text-sm text-sb-night">

              The way we like days to feel

            </h3>

            <p>

              We design itineraries around light, tides and realistic travel

              times, not just what looks good on paper. That might mean

              suggesting a quieter afternoon dhow, a shorter snorkel for younger

              children, or leaving one whole day free.

            </p>

            <p>

              When you share your dates, who you&apos;re travelling with and any

              must–do ideas, we treat it as the start of a conversation, not a

              booking funnel.

            </p>

          </div>

        </section>



        {/* TripAdvisor Certificate */}
        <div className="rounded-3xl bg-gradient-to-br from-sb-shell/60 to-sb-mist/40 p-6 sm:p-8">
          <TripAdvisorCertificate />
        </div>



        {/* How we host you */}

        <section className="space-y-4 rounded-3xl bg-sb-shell/90 p-6 shadow-sm ring-1 ring-sb-mist/80 sm:p-8">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h2 className="font-display text-lg text-sb-night">

                How we host you in Zanzibar

              </h2>

              <p className="mt-1 max-w-2xl text-[0.95rem] leading-relaxed text-sb-ink/90">

                A Savana Blu stay is usually a mix of sea, town and quieter

                pauses – not a race from one photo stop to the next.

              </p>

            </div>

          </div>

          <div className="grid gap-4 text-[0.9rem] text-sb-ink/90 md:grid-cols-3">

            <div className="space-y-1 rounded-2xl bg-white/70 p-4">

              <h3 className="text-sm font-semibold text-sb-night">Ocean days</h3>

              <p>

                Dhow sailings, sandbanks and reef snorkelling chosen for calmer

                conditions where possible, with time to simply be on the water

                as well as in it.

              </p>

            </div>

            <div className="space-y-1 rounded-2xl bg-white/70 p-4">

              <h3 className="text-sm font-semibold text-sb-night">

                Town & culture

              </h3>

              <p>

                Stone Town walks, spice farms and village visits hosted at an

                easy pace, with room for shade, stories and small details.

              </p>

            </div>

            <div className="space-y-1 rounded-2xl bg-white/70 p-4">

              <h3 className="text-sm font-semibold text-sb-night">

                Breathing space

              </h3>

              <p>

                We encourage leaving open time in your plan, so the islands

                still feel like a holiday, even when you link them with wildlife

                days inland.

              </p>

            </div>

          </div>

        </section>



        {/* Safari + Zanzibar band */}

        <section className="grid gap-6 rounded-3xl bg-white/95 p-6 shadow-sm ring-1 ring-sb-mist/80 sm:p-8 md:grid-cols-[1.4fr,1fr]">

          <div className="space-y-3">

            <h2 className="font-display text-lg text-sb-night">

              Linking safari with the islands

            </h2>

            <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">

              Many guests come to Zanzibar before or after time on safari in

              Tanzania. We arrange safari combinations with the same calm approach we use for

              our island days – realistic travel times, breathing space and an

              honest eye on how you might feel at each stage.

            </p>

            <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">

              Rather than pushing rigid, one–size–fits–all routes, we offer

              guidance on where to leave room to rest, which types of days tend

              to pair well with wildlife time, and how to avoid over–scheduling

              your stay on the islands.

            </p>

            <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">

              If you let us know roughly how many days you have &quot;in the bush&quot;

              and how many by the sea, we can help shape both your safari and

              your Zanzibar time so they complement one another instead of

              competing for energy.

            </p>

          </div>

          <div className="space-y-2 rounded-2xl bg-sb-shell/85 p-4 text-[0.9rem] text-sb-ink/90 sm:p-5">

            <h3 className="font-display text-sm text-sb-night">

              A note on expectations

            </h3>

            <p>

              Weather, sea conditions and flight patterns can all influence the

              fine details of a journey. We prefer to be upfront about this and

              work with you on realistic outlines, rather than offer promises

              that ignore the living nature of the places you visit.

            </p>

            <p>

              What we can offer is clear communication, a team that pays

              attention, and days that feel considered rather than generic.

            </p>

          </div>

        </section>



        {/* Team */}

        <section className="grid gap-6 rounded-3xl bg-sb-shell/95 p-6 shadow-sm ring-1 ring-sb-mist/80 sm:p-8 md:grid-cols-[1.2fr,1fr]">

          <div className="space-y-3 text-[0.95rem] leading-relaxed text-sb-ink/90">

            <h2 className="font-display text-lg text-sb-night">

              A locally–connected team

            </h2>

            <p>

              We work closely with trusted captains, guides and hosts in Zanzibar. This makes it

              easier to adapt to real conditions on the ground and to keep our

              attention on each guest rather than on volume.

            </p>

            <p>

              From your first WhatsApp message to the day you fly home, you speak with the same Savana Blu team – even when we are arranging lodge stays and game drives on the mainland. We read what you share, ask a few clarifying questions when needed and then suggest a way forward that fits your dates, pace and preferences.

            </p>

            <p>

              Whether you are planning a honeymoon, a family stay or a short

              extension after days on safari, our aim is the same: days that

              feel unhurried, well cared for and quietly memorable.

            </p>

          </div>

          <div className="space-y-3 rounded-2xl bg-white/95 p-4 text-[0.9rem] text-sb-ink/90 sm:p-5">

            <h3 className="font-display text-sm text-sb-night">

              If you&apos;d like to start a conversation

            </h3>

            <p>

              You can share your dates, where you plan to stay and who you are

              travelling with via the contact page. A short outline is enough;

              we will take it from there and reply with clear suggestions, not

              pressure.

            </p>

            <p>

              For last–minute or in–trip questions, the WhatsApp button on your

              screen is usually the quickest way to reach us in Zanzibar time

              (UTC+3).

            </p>

            <a

              href="/contact"

              className="inline-flex items-center rounded-full bg-sb-night px-4 py-2 text-[0.9rem] font-semibold text-sb-shell hover:bg-sb-ocean"

            >

              Message the Savana Blu team

            </a>

          </div>

        </section>

      </div>

    </Section>

  );

}
