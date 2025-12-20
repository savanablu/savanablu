import ContactForm from "@/components/contact/ContactForm";
import Section from "@/components/ui/Section";
import Image from "next/image";

export const metadata = {
  title: "Contact | Savana Blu Luxury Expeditions",
  description:
    "Message the Savana Blu team to plan your Zanzibar stay – boutique safaris, ocean escapes and tailor-made experiences.",
};

type ContactPageProps = {
  searchParams?: {
    status?: string;
  };
};

export default function ContactPage({ searchParams }: ContactPageProps) {
  const status = searchParams?.status;

  return (
    <Section className="bg-sb-shell">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="relative overflow-hidden rounded-3xl shadow-sm ring-1 ring-sb-mist/70">
          {/* Background image */}
          <div className="absolute inset-0">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: "url(/images/contact-hero.jpg)" }}
            />
            {/* Darker overlay so text is readable */}
            <div className="absolute inset-0 bg-gradient-to-br from-sb-night/65 via-sb-night/45 to-sb-ocean/25" />
            {/* Slight extra darkening at the bottom for text area */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/45 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative px-6 py-8 text-sb-shell sm:px-8 sm:py-10">
            {/* Optional subtle dark panel behind text for extra contrast */}
            <div className="inline-block rounded-2xl bg-sb-night/40 px-4 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
              <div className="h-1 w-20 rounded-full bg-gradient-to-r from-sb-shell/85 to-sb-ocean/90" />

              <div className="mt-4 space-y-3">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-sb-shell/90">
                  Contact Savana Blu
                </p>
                <h1 className="font-display text-2xl text-sb-shell sm:text-3xl">
                  Message a Zanzibar team, not a call centre
                </h1>
                <p className="max-w-3xl text-[0.95rem] leading-relaxed text-sb-shell/95">
                  Share your dates, where you&apos;re staying and who you&apos;re
                  travelling with. We&apos;ll suggest a simple outline for your time on
                  the islands &ndash; no pressure to book, no automated scripts.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-[0.85rem] sm:grid-cols-3">
              <div className="rounded-2xl bg-sb-shell/16 px-3 py-2 backdrop-blur-sm">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/90">
                  Typical response
                </p>
                <p className="mt-0.5 text-sb-shell/95">
                  Within a few working hours in Zanzibar time (UTC+3).
                </p>
              </div>
              <div className="rounded-2xl bg-sb-shell/18 px-3 py-2 backdrop-blur-sm">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/90">
                  What to share
                </p>
                <p className="mt-0.5 text-sb-shell/95">
                  Dates, hotel or villa, who you&apos;re with and what you enjoy.
                </p>
              </div>
              <div className="rounded-2xl bg-sb-shell/20 px-3 py-2 backdrop-blur-sm">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/90">
                  How we reply
                </p>
                <p className="mt-0.5 text-sb-shell/95">
                  A clear, human message with simple options – not a template.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT: full-width form, side notes below */}
        <div className="mt-8 space-y-6">
          {/* FORM – now full width, same max width as banner */}
          <div className="rounded-3xl bg-white/95 p-5 shadow-sm ring-1 ring-sb-mist/70">
            {status === "success" && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
                Thank you – your message has been received. A member of the Savana
                Blu team will be in touch shortly.
              </div>
            )}

            {status === "error" && (
              <div className="mb-4 rounded-xl border border-sb-coral/40 bg-sb-coral/10 px-4 py-3 text-xs text-sb-coral">
                We couldn&apos;t send your message just now. Please try again, or
                email{" "}
                <a
                  href="mailto:hello@savanablu.com"
                  className="font-medium underline-offset-2 hover:underline"
                >
                  hello@savanablu.com
                </a>
                .
              </div>
            )}

            <ContactForm />
          </div>

          {/* SIDE NOTES BELOW – still helpful but don't steal width from the form */}
          <aside className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl bg-sb-shell/70 p-4 sm:p-5">
              <h2 className="font-display text-sm text-sb-night">
                Prefer WhatsApp?
              </h2>
              <p className="mt-1 text-[0.9rem] leading-relaxed text-sb-ink/85">
                Many guests start with a short WhatsApp message and then move to a
                simple outline from there. We&apos;ll acknowledge your message and
                share our usual response window in Zanzibar time.
              </p>
              <p className="mt-2 text-[0.78rem] text-sb-ink/75">
                Zanzibar is usually UTC+3. If you message late at night our time,
                we&apos;ll reply as soon as we&apos;re back online.
              </p>
            </div>

            <div className="flex flex-col items-center rounded-3xl bg-white/95 p-4 sm:p-5 shadow-sm">
              <h3 className="font-display text-sm text-sb-night mb-2 text-center">
                Save our contact
              </h3>
              <p className="text-[0.85rem] text-sb-ink/75 text-center mb-3">
                Scan this QR code to save Savana Blu to your contacts
              </p>
              <div className="flex-shrink-0 relative w-40 h-40">
                <Image
                  src="/images/Contact save.png"
                  alt="QR code to save Savana Blu contact"
                  width={160}
                  height={160}
                  className="rounded-lg shadow-sm object-contain"
                  unoptimized
                />
              </div>
            </div>

            <div className="space-y-2 rounded-3xl bg-white/95 p-4 text-[0.9rem] shadow-sm text-sb-ink/85">
              <h3 className="font-display text-sm text-sb-night">
                A few notes before you book
              </h3>
              <ul className="list-disc space-y-1 pl-5">
                <li>Payment is normally made in Zanzibar; you may receive an optional secure online advance link after booking if you&apos;d like to lock in your date.</li>
                <li>Children under 12 usually pay 50% of the adult rate.</li>
                <li>
                  We adjust timings gently to fit tides and realistic sea
                  conditions.
                </li>
                <li>
                  If you already have set dates, letting us know early helps us
                  hold the best days for you.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </Section>
  );
}
