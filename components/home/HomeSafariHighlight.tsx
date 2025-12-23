// components/home/HomeSafariHighlight.tsx

export function HomeSafariHighlight() {
  return (
    <section className="bg-sb-sand/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        {/* Heading + intro */}
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sb-ink/65">
            Zanzibar & safari, gently joined
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-sb-ink sm:text-2xl">
            Why travellers choose Savana Blu
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-sb-ink/80 sm:text-[0.95rem]">
            We&apos;re based on the islands and work closely with local hosts, staying close to real tides, light and flight timings.
            That means we can be honest about what fits into a day – and how to link ocean time with
            wildlife days inland without exhausting everyone.
          </p>
        </div>

        {/* Three gentle feature blocks */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-sb-ink/5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sb-ink/70">
              Zanzibar–first hosting
            </p>
            <p className="mt-2 text-sm text-sb-ink/85">
              We live and work here, so we plan around real conditions: winds, tides, traffic and the feel
              of each neighbourhood and beach.
            </p>
          </div>

          <div className="rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-sb-ink/5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sb-ink/70">
              Small groups & private days
            </p>
            <p className="mt-2 text-sm text-sb-ink/85">
              Boutique group sizes and private options where you need more space – ideal for families,
              honeymoons and friends travelling together.
            </p>
          </div>

          <div className="rounded-2xl bg-white/95 p-4 shadow-sm ring-1 ring-sb-ink/5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sb-ink/70">
              Safari & coast combinations
            </p>
            <p className="mt-2 text-sm text-sb-ink/85">
              Many guests link Zanzibar with Tanzania safaris. We offer calm, realistic guidance
              on how to fit everything into your days without losing the feeling of a holiday.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
