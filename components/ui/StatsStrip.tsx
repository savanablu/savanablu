import Section from "@/components/ui/Section";

export default function StatsStrip() {
  return (
    <Section
      background="shell"
      eyebrow="Why travel with Savana Blu"
      title="Boutique expertise, not a mass-market portal."
      subtitle="From first email to final sunset, our team handles the details with discretion and care, keeping group sizes intentionally small."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-sb-mist/80 bg-sb-shell/80 p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sb-ink/60">
            Small Groups Only
          </div>
          <div className="mt-2 text-2xl font-semibold text-sb-ocean">
            2–10 guests
          </div>
          <p className="mt-2 text-sb-ink/75">
            Kept intentionally intimate to preserve comfort, flexibility and a
            sense of place.
          </p>
        </div>

        <div className="rounded-2xl border border-sb-mist/80 bg-sb-shell/80 p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sb-ink/60">
            Local Partnerships
          </div>
          <div className="mt-2 text-2xl font-semibold text-sb-ocean">
            Handpicked crews
          </div>
          <p className="mt-2 text-sb-ink/75">
            We work with a close circle of trusted skippers, guides and hosts
            rooted in Zanzibar.
          </p>
        </div>

        <div className="rounded-2xl border border-sb-mist/80 bg-sb-shell/80 p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sb-ink/60">
            Tailored Journeys
          </div>
          <div className="mt-2 text-2xl font-semibold text-sb-ocean">
            Bespoke itineraries
          </div>
          <p className="mt-2 text-sb-ink/75">
            Combine dhow, forest, spice farms and coast into a trip sketched
            around your pace and interests.
          </p>
        </div>
      </div>
    </Section>
  );
}
