import Link from "next/link";
import { redirect } from "next/navigation";
import { getBookingById } from "@/lib/data/bookings";
import { ZiinaDepositButton } from "@/components/payments/ZiinaDepositButton";
import { MoneyDisplay } from "@/components/admin/MoneyDisplay";
import { BookingHoldPageClient } from "@/components/payments/BookingHoldPageClient";

export const dynamic = "force-dynamic";

type BookingSuccessPageProps = {
  searchParams?: {
    bookingId?: string;
    experienceTitle?: string;
    totalUsd?: string;
    date?: string;
    type?: string; // "zanzibar-tour" | "safari" | anything else
  };
};

export default async function BookingSuccessPage({
  searchParams,
}: BookingSuccessPageProps) {
  const bookingId = searchParams?.bookingId;
  const experienceTitle = searchParams?.experienceTitle;
  const totalUsdRaw = searchParams?.totalUsd;
  const date = searchParams?.date;
  const type = searchParams?.type;

  // Try to fetch booking to get payment link and accurate totals
  let booking = null;
  let paymentLinkUrl: string | null = null;
  if (bookingId) {
    try {
      booking = await getBookingById(bookingId);
      if (booking) {
        paymentLinkUrl = (booking as any).paymentLinkUrl || null;
        
        // If booking is already confirmed, redirect to confirmed page
        const isConfirmed = (booking as any).paymentStatus === "confirmed" || 
                          (booking as any).status === "confirmed" ||
                          (booking as any).confirmedAt;
        
        if (isConfirmed) {
          redirect(`/booking/ziina/success?bookingId=${encodeURIComponent(bookingId)}`);
        }
      }
    } catch (err) {
      console.error("Error fetching booking:", err);
    }
  }

  const totalUsd = booking
    ? (booking.totalUsd || booking.totalUSD)
    : totalUsdRaw
    ? Number(totalUsdRaw)
    : undefined;
  const hasPricing = typeof totalUsd === "number" && !isNaN(totalUsd);
  
  // Calculate payment breakdown
  const depositUsd = hasPricing ? totalUsd! * 0.2 : undefined;
  const balanceUsd = hasPricing && depositUsd ? totalUsd! - depositUsd : undefined;
  
  const fxRate = Number(process.env.NEXT_PUBLIC_ZIINA_USD_TO_AED_RATE ?? "3.7");
  const depositAed = depositUsd ? Math.round(depositUsd * fxRate * 100) / 100 : undefined;

  let typeLabel = "experience";
  let nextLinkLabel = "Explore more Zanzibar tours and safaris";
  let nextLinkHref = "/zanzibar-tours";

  if (type === "zanzibar-tour") {
    typeLabel = "Zanzibar tour";
    nextLinkLabel = "Explore more Zanzibar tours";
    nextLinkHref = "/zanzibar-tours";
  } else if (type === "safari") {
    typeLabel = "safari from Zanzibar";
    nextLinkLabel = "View more safaris from Zanzibar";
    nextLinkHref = "/safaris";
  }

  return (
    <main className="min-h-[70vh] bg-sb-deep text-sb-cream">
      {/* Client-side check to redirect if already confirmed */}
      <BookingHoldPageClient />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-sb-cream/60">
            Savana Blu · Booking received
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-wide sm:text-4xl">
            Your booking is on hold
          </h1>
        </div>

        {/* Status Card */}
        <div className="mb-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 rounded-full bg-emerald-500/20 p-3">
              <svg
                className="h-6 w-6 text-emerald-400"
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
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-sb-cream">
                Booking received
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-sb-cream/90">
                Thank you – we&apos;ve received your request and created a provisional
                booking. Right now your place is{" "}
                <span className="font-semibold text-emerald-400">on hold</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mb-8 rounded-2xl border border-sb-cream/10 bg-sb-deep/40 p-6">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-sb-lagoon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-sb-cream/90">
                To fully confirm the date, we usually take a{" "}
                <span className="font-semibold">20% advance</span>. We&apos;ve emailed
                you your details, including a secure payment link where you can pay this
                advance online. The remaining balance is paid in Zanzibar on the day of
                your tour or safari.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-sb-cream/70">
                If you can&apos;t find the email or something doesn&apos;t look right,
                just reply to{" "}
                <a
                  href="mailto:hello@savanablu.com"
                  className="font-mono text-[12px] text-sb-lagoon hover:underline"
                >
                  hello@savanablu.com
                </a>{" "}
                or message us on WhatsApp and we&apos;ll help.
              </p>
            </div>
          </div>
        </div>

        {experienceTitle && (
          <section className="mb-8 rounded-2xl border border-sb-cream/15 bg-gradient-to-br from-sb-deep/60 to-sb-deep/40 p-6 shadow-lg">
            <div className="flex items-start gap-3 mb-4">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-sb-lagoon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <div className="flex-1">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-sb-cream/70">
                  Your {typeLabel}
                </h2>
                <p className="mt-2 text-xl font-semibold text-sb-cream">
                  {experienceTitle}
                </p>
              </div>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-2">
              {date && (
                <div className="flex items-center gap-2 text-sm">
                  <svg
                    className="h-4 w-4 text-sb-cream/60"
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
                  <span className="text-sb-cream/80">Date:</span>
                  <span className="font-medium text-sb-cream">{date}</span>
                </div>
              )}
            </div>

            {hasPricing && (
              <div className="mt-6 rounded-xl border border-sb-cream/10 bg-sb-deep/80 p-5">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-sb-cream/70">
                  Payment breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-sb-cream/80">Estimated total</span>
                    <span className="text-base font-semibold text-sb-cream">
                      <MoneyDisplay amountUSD={totalUsd!} />
                    </span>
                  </div>
                  {depositUsd && (
                    <div className="flex items-center justify-between border-t border-sb-cream/10 pt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-sb-cream/80">20% advance</span>
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                          Pay now
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-semibold text-emerald-400">
                          <MoneyDisplay amountUSD={depositUsd} />
                        </span>
                      </div>
                    </div>
                  )}
                  {balanceUsd && (
                    <div className="flex items-center justify-between border-t border-sb-cream/10 pt-3">
                      <span className="text-sm text-sb-cream/80">Balance in Zanzibar</span>
                      <span className="text-base font-semibold text-sb-cream">
                        <MoneyDisplay amountUSD={balanceUsd} />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {hasPricing && (
          <section className="mb-8 rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-emerald-500/30 p-2">
                <svg
                  className="h-5 w-5 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-sb-cream">
                  Confirm your booking
                </h2>
                <p className="mt-0.5 text-xs text-sb-cream/70">
                  Pay 20% advance to secure your date
                </p>
              </div>
            </div>
            
            <p className="mb-4 text-sm leading-relaxed text-sb-cream/90">
              To move your booking from <span className="font-semibold">&quot;on hold&quot;</span> to{" "}
              <span className="font-semibold text-emerald-400">fully confirmed</span>, please pay
              a 20% advance using our secure UAE payment partner, Ziina. The
              balance is paid in Zanzibar on the day of your {typeLabel}.
            </p>

            {paymentLinkUrl ? (
              <div className="space-y-3">
                <a
                  href={paymentLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-sb-cream to-sb-cream/95 px-6 py-3.5 text-sm font-semibold tracking-wide text-sb-deep shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <svg
                    className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="relative">Pay 20% advance via Ziina</span>
                  <svg
                    className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
                <p className="text-center text-xs text-sb-cream/70">
                  Secure payment • Amount:{" "}
                  <span className="font-semibold text-sb-cream">
                    <MoneyDisplay amountUSD={depositUsd || 0} />
                  </span>
                </p>
              </div>
            ) : (
              <ZiinaDepositButton
                bookingId={bookingId}
                totalUsd={totalUsd!}
                label="Pay 20% advance via Ziina"
              />
            )}

            <div className="mt-4 rounded-lg border border-sb-cream/10 bg-sb-deep/60 p-3">
              <p className="text-xs leading-relaxed text-sb-cream/70">
                <span className="font-semibold">Note:</span> If you need to adjust your date or pick-up time, let us know as
                early as possible. However, if you cancel your trip, the 20% advance payment is non-refundable as we&apos;ve already committed
                guides, boats and vehicles in advance.
              </p>
            </div>
          </section>
        )}

        {!hasPricing && (
          <section className="mb-8 rounded-2xl border border-sb-cream/15 bg-sb-deep/60 p-6">
            <div className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-sb-lagoon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h2 className="text-sm font-semibold text-sb-cream/90">
                  What happens next
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-sb-cream/80">
                  A member of our team will review your request and send you a
                  personalised email with your total, a 20% advance amount and a
                  secure Ziina link to confirm your booking.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Action Links */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href={nextLinkHref}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-sb-cream/40 bg-gradient-to-r from-sb-cream/5 to-sb-cream/3 px-5 py-2.5 text-sm font-medium tracking-wide text-sb-cream transition-all duration-300 hover:border-sb-cream/60 hover:bg-gradient-to-r hover:from-sb-cream/15 hover:to-sb-cream/10 hover:shadow-lg hover:shadow-sb-cream/10 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sb-lagoon/0 via-sb-lagoon/5 to-sb-lagoon/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <svg
              className="relative h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="relative">{nextLinkLabel}</span>
            <svg
              className="relative ml-1 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2.5 text-sm font-medium tracking-wide text-sb-cream/80 transition-all duration-300 hover:border-sb-cream/30 hover:bg-sb-cream/5 hover:gap-3 hover:text-sb-cream hover:shadow-sm active:scale-95"
          >
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Back to home</span>
          </Link>
        </div>

        {/* Help Section */}
        <div className="rounded-xl border border-sb-cream/10 bg-sb-deep/40 p-4">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-sb-cream/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-sb-cream/70">
                Need help?
              </p>
              <p className="mt-1 text-xs leading-relaxed text-sb-cream/60">
                If you don&apos;t see an email within a few minutes, please check your spam
                or promotions folder, or send us a note at{" "}
                <a
                  href="mailto:hello@savanablu.com"
                  className="font-medium text-sb-lagoon hover:underline"
                >
                  hello@savanablu.com
                </a>{" "}
                or on WhatsApp using the button on this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
