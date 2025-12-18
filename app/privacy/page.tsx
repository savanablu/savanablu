import Section from "@/components/ui/Section";
import TableOfContents from "@/components/legal/TableOfContents";
import type { Metadata } from "next";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "information-collect", title: "Information We Collect" },
  { id: "how-we-use", title: "How We Use Your Information" },
  { id: "information-sharing", title: "Information Sharing" },
  { id: "data-security", title: "Data Security" },
  { id: "data-retention", title: "Data Retention" },
  { id: "your-rights", title: "Your Rights" },
  { id: "cookies", title: "Cookies and Tracking" },
  { id: "third-party", title: "Third-Party Links" },
  { id: "children", title: "Children's Privacy" },
  { id: "changes", title: "Changes to This Privacy Policy" },
  { id: "contact", title: "Contact Us" },
];

export default function PrivacyPolicyPage() {
  return (
    <Section className="pb-20 pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 space-y-4">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-sb-ocean">
            Legal information
          </p>
          <h1 className="font-display text-4xl text-sb-night sm:text-5xl">
            Privacy Policy
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
                Savana Blu Luxury Expeditions (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </section>

            <section id="information-collect" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Information We Collect</h2>
              <div className="space-y-5">
                <div className="rounded-xl border border-sb-mist/40 bg-sb-shell/30 p-4">
                  <h3 className="mb-2 font-semibold text-sb-night">Personal Information</h3>
                  <p className="mb-3 text-[0.9rem] leading-relaxed text-sb-ink/85">
                    When you make a booking, contact us, or use our services, we may collect:
                  </p>
                  <ul className="ml-4 space-y-1.5 text-[0.9rem] leading-relaxed text-sb-ink/85">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-ocean" />
                      <span>Name and contact details (email address, phone number)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-ocean" />
                      <span>Travel dates and party composition</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-ocean" />
                      <span>Payment information (processed securely through our payment partners)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-ocean" />
                      <span>Accommodation details and pickup preferences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-ocean" />
                      <span>Any special requirements or dietary needs</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border border-sb-mist/40 bg-sb-shell/30 p-4">
                  <h3 className="mb-2 font-semibold text-sb-night">Automatically Collected Information</h3>
                  <p className="mb-3 text-[0.9rem] leading-relaxed text-sb-ink/85">
                    When you visit our website, we may automatically collect:
                  </p>
                  <ul className="ml-4 space-y-1.5 text-[0.9rem] leading-relaxed text-sb-ink/85">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-ocean" />
                      <span>IP address and browser type</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-ocean" />
                      <span>Pages visited and time spent on pages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-ocean" />
                      <span>Referring website addresses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-ocean" />
                      <span>Device information</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="how-we-use" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">How We Use Your Information</h2>
              <p className="mb-4 text-[0.95rem] leading-relaxed text-sb-ink/90">
                We use the information we collect to:
              </p>
              <ul className="ml-4 space-y-2 text-[0.95rem] leading-relaxed text-sb-ink/90">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>Process and confirm your bookings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>Communicate with you about your trip, including confirmations, reminders, and updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>Provide customer support and respond to your inquiries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>Send you important information about your booking, including changes or cancellations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>Improve our website and services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>Comply with legal obligations</span>
                </li>
              </ul>
            </section>

            <section id="information-sharing" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Information Sharing</h2>
              <p className="mb-4 text-[0.95rem] leading-relaxed text-sb-ink/90">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <div className="space-y-3">
                <div className="rounded-lg border-l-4 border-sb-lagoon bg-sb-shell/20 p-3">
                  <p className="text-[0.9rem] leading-relaxed text-sb-ink/90">
                    <strong className="text-sb-night">Service Providers:</strong> With trusted partners who assist us in operating our website, processing payments, or providing services (e.g., payment processors, email service providers)
                  </p>
                </div>
                <div className="rounded-lg border-l-4 border-sb-lagoon bg-sb-shell/20 p-3">
                  <p className="text-[0.9rem] leading-relaxed text-sb-ink/90">
                    <strong className="text-sb-night">Local Guides and Operators:</strong> With our local guides, drivers, and service providers in Zanzibar who need your information to deliver your booked experiences
                  </p>
                </div>
                <div className="rounded-lg border-l-4 border-sb-lagoon bg-sb-shell/20 p-3">
                  <p className="text-[0.9rem] leading-relaxed text-sb-ink/90">
                    <strong className="text-sb-night">Legal Requirements:</strong> When required by law or to protect our rights, property, or safety
                  </p>
                </div>
                <div className="rounded-lg border-l-4 border-sb-lagoon bg-sb-shell/20 p-3">
                  <p className="text-[0.9rem] leading-relaxed text-sb-ink/90">
                    <strong className="text-sb-night">Business Transfers:</strong> In connection with any merger, sale, or transfer of assets
                  </p>
                </div>
              </div>
            </section>

            <section id="data-security" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Data Security</h2>
              <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">
                We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section id="data-retention" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Data Retention</h2>
              <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <section id="your-rights" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Your Rights</h2>
              <p className="mb-4 text-[0.95rem] leading-relaxed text-sb-ink/90">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="mb-4 ml-4 space-y-2 text-[0.95rem] leading-relaxed text-sb-ink/90">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>The right to access your personal information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>The right to correct inaccurate information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>The right to request deletion of your information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>The right to object to processing of your information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sb-lagoon" />
                  <span>The right to data portability</span>
                </li>
              </ul>
              <div className="rounded-lg border border-sb-mist/60 bg-sb-shell/40 p-4">
                <p className="text-[0.9rem] leading-relaxed text-sb-ink/90">
                  To exercise these rights, please contact us at{" "}
                  <a
                    href="mailto:hello@savanablu.com"
                    className="font-medium text-sb-ocean underline underline-offset-4 hover:text-sb-lagoon"
                  >
                    hello@savanablu.com
                  </a>
                  .
                </p>
              </div>
            </section>

            <section id="cookies" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Cookies and Tracking</h2>
              <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">
                Our website may use cookies and similar tracking technologies to enhance your experience. You can set your browser to refuse cookies, but this may limit some functionality of our website.
              </p>
            </section>

            <section id="third-party" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Third-Party Links</h2>
              <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section id="children" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Children&apos;s Privacy</h2>
              <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section id="changes" className="scroll-mt-24 rounded-2xl border border-sb-mist/60 bg-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Changes to This Privacy Policy</h2>
              <p className="text-[0.95rem] leading-relaxed text-sb-ink/90">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section id="contact" className="scroll-mt-24 rounded-2xl border-2 border-sb-lagoon/40 bg-gradient-to-br from-sb-shell/60 to-white/50 p-6 backdrop-blur-sm">
              <h2 className="mb-4 font-display text-2xl text-sb-night">Contact Us</h2>
              <p className="mb-4 text-[0.95rem] leading-relaxed text-sb-ink/90">
                If you have any questions about this Privacy Policy, please contact us:
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
