import Tag from "@/components/ui/Tag";
import { ButtonLink } from "@/components/ui/Button";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-sb-shell">
      {/* Ocean–sand gradient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-sb-mist via-sb-shell to-sb-sand"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 -top-24 -z-10 h-80 rounded-full bg-sb-lagoon/10 blur-3xl"
      />

      <section className="container-page flex min-h-[70vh] flex-col items-start justify-center py-12 md:py-20">
        <Tag tone="highlight">
          <span className="h-1 w-1 rounded-full bg-sb-lagoon" />
          Boutique · Zanzibar · Small Groups & Private
        </Tag>

        <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight text-sb-night sm:text-5xl md:text-6xl">
          Luxury expeditions,
          <span className="block text-sb-ocean">
            written by the tides of Zanzibar.
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-sb-ink/75 md:text-lg">
          Savana Blu designs intimate, small-group and private experiences on
          the Spice Island – from dhow journeys over glassy lagoons to sunset
          strolls through Stone Town and quiet village encounters beyond the
          usual circuits.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ButtonLink href="/zanzibar-tours" variant="primary" size="lg">
            Explore signature tours
          </ButtonLink>
          <ButtonLink
            href="/contact"
            variant="secondary"
            size="lg"
            aria-label="Plan a bespoke itinerary with Savana Blu"
          >
            Plan a bespoke itinerary
          </ButtonLink>
        </div>

        <div className="mt-10 grid gap-4 text-xs text-sb-ink/70 sm:grid-cols-3">
          <div className="rounded-2xl border border-sb-mist/80 bg-sb-shell/80 p-4 backdrop-blur">
            <div className="text-[0.78rem] font-semibold tracking-[0.2em] uppercase text-sb-ink/60">
              Curated Experiences
            </div>
            <p className="mt-2">
              Dhow sailing, hidden sandbanks, spice farms, forest trails and
              coastal villages – thoughtfully combined, never rushed.
            </p>
          </div>
          <div className="rounded-2xl border border-sb-mist/80 bg-sb-shell/80 p-4 backdrop-blur">
            <div className="text-[0.78rem] font-semibold tracking-[0.2em] uppercase text-sb-ink/60">
              Small & Private Groups
            </div>
            <p className="mt-2">
              A focus on couples, families and close friends seeking space,
              comfort and genuine connection with place.
            </p>
          </div>
          <div className="rounded-2xl border border-sb-mist/80 bg-sb-shell/80 p-4 backdrop-blur">
            <div className="text-[0.78rem] font-semibold tracking-[0.2em] uppercase text-sb-ink/60">
              On-the-ground Insight
            </div>
            <p className="mt-2">
              A locally rooted team, trusted skippers and guides who know
              Zanzibar&apos;s quieter corners, tides and seasons.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
