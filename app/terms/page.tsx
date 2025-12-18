import Section from "@/components/ui/Section";
import TableOfContents from "@/components/legal/TableOfContents";
import type { Metadata } from "next";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "booking-payment", title: "Booking and Payment" },
  { id: "cancellations", title: "Cancellations and Refunds" },
  { id: "travel-insurance", title: "Travel Insurance" },
  { id: "health-safety", title: "Health and Safety" },
  { id: "responsibility", title: "Responsibility and Liability" },
  { id: "travel-documents", title: "Travel Documents" },
  { id: "conduct", title: "Conduct and Behavior" },
  { id: "photography", title: "Photography and Media" },
  { id: "complaints", title: "Complaints and Disputes" },
  { id: "force-majeure", title: "Force Majeure" },
  { id: "governing-law", title: "Governing Law" },
  { id: "changes", title: "Changes to Terms" },
  { id: "contact", title: "Contact Us" },
];

export default function TermsAndConditionsPage() {
  return (
    <Section className="pb-20 pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 space-y-4">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-sb-ocean">
            Legal information
          </p>
          <h1 className="font-display text-4xl text-sb-night sm:text-5xl">
            Terms and Conditions
          </h1>
          <p className="text-[0.95rem] leading-relaxed text-sb-ink/80">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[240px,1fr]">
          <TableOfContents sections={sections} />

          {/* Main Content */}
          <div className="space-y-6">
            <section id="introduction" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Introduction</h2>
              <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">
                These Terms and Conditions (&quot;Terms&quot;) govern your use of the Savana Blu Luxury Expeditions website and services. By booking a tour or safari with us, you agree to be bound by these Terms. Please read them carefully.
              </p>
            </section>

            <section id="booking-payment" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Booking and Payment</h2>
              <div className="space-y-4">
                <div className="rounded-xl border border-sb-mist/40 bg-sb-shell/30 p-4">
                  <h3 className="mb-2 font-semibold text-sb-night">Advance Payment</h3>
                  <p className="text-[0.9rem] leading-relaxed text-sb-ink/85">
                    To confirm your booking, a 20% advance payment is required. This advance payment is processed securely online through our payment partner, Ziina. The remaining balance is paid in Zanzibar on the day of your experience, typically in USD or Tanzanian Shillings.
                  </p>
                </div>
                <div className="rounded-xl border border-sb-mist/40 bg-sb-shell/30 p-4">
                  <h3 className="mb-2 font-semibold text-sb-night">Booking Confirmation</h3>
                  <p className="text-[0.9rem] leading-relaxed text-sb-ink/85">
                    Your booking is confirmed once we receive your 20% advance payment. You will receive a confirmation email with all relevant details, including pickup times, meeting points, and what to bring.
                  </p>
                </div>
              </div>
            </section>

            <section id="cancellations" className="scroll-mt-24 rounded-2xl border-2 border-sb-coral/30 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Cancellations and Refunds</h2>
              <div className="space-y-4">
                <div className="rounded-xl border-2 border-sb-coral/40 bg-red-50/30 p-4">
                  <h3 className="mb-2 font-semibold text-sb-night">Cancellation by You</h3>
                  <p className="text-[0.9rem] leading-relaxed text-sb-ink/85">
                    If you cancel your trip, the 20% advance payment is <strong className="text-sb-coral">non-refundable</strong>, as we have already committed guides, boats, vehicles, and other resources in advance.
                  </p>
                </div>
                <div className="rounded-xl border border-sb-mist/40 bg-sb-shell/30 p-4">
                  <h3 className="mb-2 font-semibold text-sb-night">Date and Time Changes</h3>
                  <p className="text-[0.9rem] leading-relaxed text-sb-ink/85">
                    If you need to adjust your date or pick-up time, please contact us as early as possible. We will do our best to accommodate changes around tides, flights, and availability, but changes are subject to availability and cannot be guaranteed.
                  </p>
                </div>
                <div className="rounded-xl border border-sb-mist/40 bg-sb-shell/30 p-4">
                  <h3 className="mb-2 font-semibold text-sb-night">Cancellation by Us</h3>
                  <p className="text-[0.9rem] leading-relaxed text-sb-ink/85">
                    In the unlikely event that we must cancel a tour due to circumstances beyond our control (e.g., severe weather, safety concerns), we will offer you a full refund of the advance payment or the option to reschedule to an alternative date.
                  </p>
                </div>
              </div>
            </section>

            <section id="travel-insurance" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Travel Insurance</h2>
              <div className="rounded-lg border-l-4 border-sb-lagoon bg-sb-shell/20 p-4">
                <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">
                  We strongly recommend that you obtain comprehensive travel insurance covering medical expenses, trip cancellation, personal liability, and activities. Savana Blu Luxury Expeditions is not responsible for any costs incurred due to medical emergencies, trip cancellations, or other unforeseen circumstances.
                </p>
              </div>
            </section>

            <section id="health-safety" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Health and Safety</h2>
              <p className="mb-4 text-[0.95rem] leading-relaxed text-sb-ink/90">
                By booking with us, you acknowledge that:
              </p>
              <ul className="ml-4 space-y-2 text-[0.95rem] leading-relaxed text-sb-ink/90">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>You are in good health and physically capable of participating in the activities included in your booking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>You have disclosed any medical conditions, allergies, or dietary requirements that may affect your participation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>You understand and accept the inherent risks associated with travel, water activities, and wildlife encounters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>You will follow the instructions of our guides and staff at all times</span>
                </li>
              </ul>
            </section>

            <section id="responsibility" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Responsibility and Liability</h2>
              <p className="mb-4 text-[0.95rem] leading-relaxed text-sb-ink/90">
                Savana Blu Luxury Expeditions acts as an intermediary between you and local service providers (guides, boat operators, accommodation, etc.). While we carefully select our partners, we are not liable for:
              </p>
              <ul className="ml-4 space-y-2 text-[0.95rem] leading-relaxed text-sb-ink/90">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>Loss or damage to personal belongings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>Personal injury or illness, except where caused by our negligence</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>Delays, cancellations, or changes due to weather, natural disasters, or other circumstances beyond our control</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>Acts or omissions of third-party service providers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>Any indirect, consequential, or incidental damages</span>
                </li>
              </ul>
            </section>

            <section id="travel-documents" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Travel Documents and Requirements</h2>
              <p className="mb-4 text-[0.95rem] leading-relaxed text-sb-ink/90">
                It is your responsibility to ensure you have:
              </p>
              <ul className="mb-4 ml-4 space-y-2 text-[0.95rem] leading-relaxed text-sb-ink/90">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>Valid passport (valid for at least 6 months from your travel date)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>Appropriate visas for Tanzania/Zanzibar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>Required vaccinations and health certificates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>Travel insurance</span>
                </li>
              </ul>
              <div className="rounded-lg border-l-4 border-sb-coral bg-red-50/30 p-3">
                <p className="text-[0.9rem] leading-relaxed text-sb-ink/90">
                  We are not responsible for any costs or consequences resulting from inadequate travel documents or health requirements.
                </p>
              </div>
            </section>

            <section id="conduct" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Conduct and Behavior</h2>
              <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">
                We reserve the right to refuse service or remove any participant from a tour if their behavior is disruptive, dangerous, or violates local laws or customs. In such cases, no refund will be provided.
              </p>
            </section>

            <section id="photography" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Photography and Media</h2>
              <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">
                We may take photographs or videos during tours for promotional purposes. By participating in our tours, you consent to the use of such media. If you prefer not to be photographed, please inform us in advance.
              </p>
            </section>

            <section id="complaints" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Complaints and Disputes</h2>
              <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">
                If you have a complaint during your tour, please inform your guide or contact us immediately so we can address the issue promptly. Complaints received after the completion of your tour may be more difficult to resolve.
              </p>
            </section>

            <section id="force-majeure" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Force Majeure</h2>
              <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">
                We are not liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to natural disasters, war, terrorism, pandemics, government actions, or other force majeure events.
              </p>
            </section>

            <section id="governing-law" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Governing Law</h2>
              <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">
                These Terms are governed by the laws of Tanzania. Any disputes arising from these Terms or our services shall be subject to the exclusive jurisdiction of the courts of Tanzania.
              </p>
            </section>

            <section id="changes" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Changes to Terms</h2>
              <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after such changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section id="contact" className="scroll-mt-24 rounded-2xl border-2 border-sb-lagoon/40 bg-gradient-to-br from-sb-shell/60 to-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Contact Us</h2>
              <p className="mb-4 text-[0.95rem] leading-relaxed text-sb-ink/90">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-2 text-[0.95rem] leading-relaxed text-sb-ink/90">
                <p>
                  <strong className="text-sb-night">Email:</strong>{" "}
                  <a
                    href="mailto:hello@savanablu.com"
                    className="font-medium text-sb-ocean underline underline-offset-4 hover:text-sb-lagoon"
                  >
                    hello@savanablu.com
                  </a>
                </p>
                <p>
                  <strong className="text-sb-night">Address:</strong> Sogea, Zanzibar, Tanzania
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Section>
  );
}
