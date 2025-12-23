// app/faq/page.tsx

import React from "react";
import Section from "@/components/ui/Section";
import Link from "next/link";



export const metadata = {

  title: "Frequently Asked Questions | Savana Blu Zanzibar",

  description:

    "Answers to common questions about Savana Blu experiences in Zanzibar — payments, deposits, children, timings, weather and private options.",

};



type FaqItem = {

  question: string;

  answer: React.ReactNode;

};



const faqs: FaqItem[] = [

  {

    question: "How do payments work for Savana Blu experiences and safaris?",

    answer: (

      <>

        For most experiences, you pay the balance in Zanzibar on the day of your

        experience or safari. To secure the date, we usually take a{" "}

        <strong>small 20% advance</strong> via our secure online payment

        partner. This keeps your booking confirmed while keeping the process

        simple and flexible.

      </>

    ),

  },

  {

    question: "Is the 20% advance payment refundable?",

    answer: (

      <>

        If you cancel your trip, the 20% advance payment is <strong>non-refundable</strong>, as we

        commit guides, boats and vehicles in advance. If you need to adjust your

        date or timing, our team is flexible where tides, flights and availability allow.

        We recommend contacting us as early as possible if your plans

        change.

      </>

    ),

  },

  {

    question: "How do I pay the 20% advance online?",

    answer: (

      <>

        After you send a booking request, we email you a{" "}

        <strong>secure payment link</strong> powered by Ziina. The amount is

        processed securely online, and we keep an internal record in USD for your booking.

        Once the advance is paid, you&apos;ll receive a{" "}

        <strong>confirmation email</strong> from Savana Blu.

      </>

    ),

  },

  {

    question: "What happens after I send a booking request?",

    answer: (

      <>

        You&apos;ll see a confirmation page and receive an{" "}

        <strong>on-hold email</strong> with your experience or safari details, party

        size and a summary of the total. That email also includes a secure link

        for the 20% advance. Once the advance is paid, you&apos;ll receive a

        second email confirming that your booking is fully secured.

      </>

    ),

  },

  {

    question: "Can you organise airport pick-ups for my experience or safari?",

    answer: (

      <>

        Yes. On the booking form you can tick the{" "}

        <strong>airport pick-up</strong> option and share your{" "}

        <strong>flight number</strong>. Our team uses this to monitor arrival

        timings and coordinate your pick-up calmly. If you&apos;re staying in

        Stone Town or on the coast, you can also share your hotel or villa

        details and we&apos;ll plan accordingly.

      </>

    ),

  },

  {

    question: "Do you only arrange tours in Zanzibar, or also safaris?",

    answer: (

      <>

        We host <strong>Zanzibar experiences</strong> directly and also curate{" "}

        <strong>safaris from Zanzibar</strong> to parks such as Selous and

        Mikumi. Many guests combine a few days on the coast with a short,

        focused wildlife stay. We&apos;re happy to give calm, realistic advice

        on what fits into your days without rushing.

      </>

    ),

  },

  {

    question: "Is it suitable for families with young children?",

    answer: (

      <>

        Yes. Many of our Zanzibar experiences and short safaris are{" "}

        <strong>family-friendly</strong>, and we keep group sizes small so that

        you don&apos;t feel lost in a crowd. On the booking form you can note

        children&apos;s ages and any special requests, and we adjust the pace

        and timing accordingly.

      </>

    ),

  },

  {

    question: "How do I contact you if I have more questions?",

    answer: (

      <>

        You can always{" "}

        <Link href="/contact" className="underline underline-offset-4">

          send us a note

        </Link>{" "}

        or use the{" "}

        <span className="font-semibold">WhatsApp button</span> on the website to

        share your dates, hotel and any must-do experiences. You&apos;ll receive

        a clear, human reply from our team — not an automated script.

      </>

    ),

  },

];



// Helper function to extract plain text from React nodes for structured data
function extractTextFromReactNode(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).join(" ").trim();
  }
  if (node && typeof node === "object" && "props" in node) {
    if (node.props?.children) {
      return extractTextFromReactNode(node.props.children);
    }
  }
  return "";
}

export default function FaqPage() {
  // Build FAQPage structured data for SEO
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": extractTextFromReactNode(item.answer).replace(/\s+/g, " ").trim(),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <Section className="pb-20 pt-16">

      {/* Wider container to match Contact */}
      <div className="mx-auto max-w-6xl space-y-8">

        {/* HERO – matches Contact width & readability treatment */}

        <header className="relative min-h-[340px] overflow-hidden rounded-3xl shadow-sm ring-1 ring-sb-mist/70">

          {/* Background image */}

          <div className="absolute inset-0">

            <div

              className="h-full w-full bg-cover bg-center"

              style={{ backgroundImage: "url(/images/faq-hero.jpg)" }}

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

                  Frequently asked questions

                </p>

                <h1 className="font-display text-2xl text-sb-shell sm:text-3xl">

                  FAQs for calm, well-understood days in Zanzibar

                </h1>

                <p className="max-w-3xl text-[0.95rem] leading-relaxed text-sb-shell/95">

                  These notes cover the questions guests most often ask us —

                  payments, children, timings and what happens if the weather

                  changes. If anything is still unclear, you can always message

                  us directly.

                </p>

              </div>

            </div>



            <div className="mt-5 grid gap-3 text-[0.85rem] sm:grid-cols-3">

              <div className="rounded-2xl bg-sb-shell/16 px-3 py-2 backdrop-blur-sm">

                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/90">

                  Clear money side

                </p>

                <p className="mt-0.5 text-sb-shell/95">

                  Payment normally in Zanzibar, optional advance online — always shown in writing.

                </p>

              </div>

              <div className="rounded-2xl bg-sb-shell/18 px-3 py-2 backdrop-blur-sm">

                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/90">

                  Guests of all ages

                </p>

                <p className="mt-0.5 text-sb-shell/95">

                  Families, couples and older guests hosted at an easy pace.

                </p>

              </div>

              <div className="rounded-2xl bg-sb-shell/20 px-3 py-2 backdrop-blur-sm">

                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/90">

                  Honest about conditions

                </p>

                <p className="mt-0.5 text-sb-shell/95">

                  We respect tides and weather, and explain options clearly.

                </p>

              </div>

            </div>

          </div>

        </header>



        {/* FAQ LIST – 1 column on mobile, 2 columns on larger screens */}

        <div className="grid gap-3 md:grid-cols-2">

          {faqs.map((item, idx) => (

            <details

              key={idx}

              className="group h-full rounded-2xl border border-sb-mist/80 bg-white/95 p-4 shadow-sm open:border-sb-ocean/50"

            >

              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">

                <div className="text-left">

                  <p className="text-[0.95rem] font-semibold text-sb-night">

                    {item.question}

                  </p>

                </div>

                <span className="shrink-0 text-[1.1rem] text-sb-ink/50 transition group-open:rotate-45">

                  +

                </span>

              </summary>

              <div className="mt-2 text-[0.9rem] leading-relaxed text-sb-ink/85">

                {item.answer}

              </div>

            </details>

          ))}

        </div>



        {/* STILL UNSURE CTA – with only Contact, WhatsApp via floating button */}

        <section className="mt-8 rounded-3xl bg-sb-shell/80 px-4 py-5 shadow-sm ring-1 ring-sb-mist/80 sm:px-6 sm:py-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="max-w-xl space-y-2">

              <h2 className="font-display text-sm text-sb-night">

                Still unsure about something?

              </h2>

              <p className="text-[0.9rem] leading-relaxed text-sb-ink/85">

                If you&apos;re planning a special trip, travelling with young

                children or combining Zanzibar with safari, it&apos;s completely

                normal to have more detailed questions.

              </p>

              <p className="text-[0.9rem] leading-relaxed text-sb-ink/85">

                Send us a short note with your dates, hotel and any must-do

                experiences. Our team will reply with a clear, human answer — not

                an automated script.

              </p>

            </div>



            <div className="flex flex-col gap-2 text-[0.85rem] sm:items-end">

              <a

                href="/contact"

                className="inline-flex items-center rounded-full bg-sb-night px-4 py-2 font-semibold text-sb-shell hover:bg-sb-ocean"

              >

                Send a quick note

              </a>

              <p className="max-w-xs text-right text-[0.78rem] text-sb-ink/70">

                Prefer messaging? You can also use the WhatsApp button on the

                screen to reach us in Zanzibar time (UTC+3).

              </p>

            </div>

          </div>

        </section>

      </div>

    </Section>
    </>
  );

}
