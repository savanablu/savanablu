import Link from "next/link";
import { getFinanceSummary } from "@/lib/finance/summary";
import { MoneyDisplay } from "@/components/admin/MoneyDisplay";

export const dynamic = "force-dynamic";


function formatMonthLabel(key: string): string {
  if (key === "Unknown") return "Unknown";

  const [year, month] = key.split("-");

  const m = Number(month);

  const date = new Date(Number(year), m - 1, 1);

  return date.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

export default async function AdminFinancePage() {
  const summary = await getFinanceSummary();

  const hasData = summary.totals.bookingCount > 0;

  return (
    <main className="min-h-screen bg-sb-deep text-sb-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Link
                href="/admin"
                className="inline-flex items-center text-xs uppercase tracking-[0.25em] text-sb-cream/60 hover:text-sb-cream/80"
              >
                <svg
                  className="mr-2 h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Admin Dashboard
              </Link>
              <h1 className="mt-3 text-3xl font-semibold tracking-wide sm:text-4xl">
                Revenue snapshot
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sb-cream/80">
                High-level view of revenue from confirmed bookings. Figures are
                converted from USD base using the selected currency.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/api/admin/finance/export"
                className="inline-flex items-center rounded-full border border-sb-cream/40 bg-sb-cream/5 px-5 py-2.5 text-xs font-semibold tracking-wide text-sb-cream transition-all hover:border-sb-cream/60 hover:bg-sb-cream/10"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download finance CSV
              </Link>
              <Link
                href="/api/admin/bookings/export"
                className="inline-flex items-center rounded-full border border-sb-cream/30 bg-sb-cream/3 px-5 py-2.5 text-xs font-medium tracking-wide text-sb-cream/80 transition-all hover:border-sb-cream/50 hover:bg-sb-cream/8 hover:text-sb-cream"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download bookings CSV
              </Link>
            </div>
          </div>
        </header>

        {!hasData ? (
          <div className="rounded-2xl border border-sb-cream/20 bg-sb-deep/40 p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-sb-cream/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="mt-4 font-semibold text-sb-cream">
              No booking data available yet.
            </p>
            <p className="mt-2 text-sm text-sb-cream/70">
              Once your booking flow starts saving data, this page will show
              totals and breakdowns.
            </p>
          </div>
        ) : (
          <>
            {/* Top cards */}
            <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-sb-sand/20 bg-sb-cream/5 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-sb-cream/60">
                  Total bookings
                </p>
                <p className="mt-2 text-3xl font-semibold text-sb-cream">
                  {summary.totals.bookingCount}
                </p>
              </div>
              <div className="rounded-xl border border-sb-sand/20 bg-sb-cream/5 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-sb-cream/60">
                  Trip value
                </p>
                <p className="mt-2 text-2xl font-semibold text-sb-cream">
                  <MoneyDisplay amountUSD={summary.totals.totalRevenueUSD} />
                </p>
                <p className="mt-1 text-[11px] text-sb-cream/60">
                  100% of experience value
                </p>
              </div>
              <div className="rounded-xl border border-sb-sand/20 bg-sb-cream/5 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-sb-cream/60">
                  Advances collected
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-400">
                  <MoneyDisplay amountUSD={summary.totals.totalDepositsUSD} />
                </p>
                <p className="mt-1 text-[11px] text-sb-cream/60">
                  Paid online via Ziina
                </p>
              </div>
              <div className="rounded-xl border border-sb-sand/20 bg-sb-cream/5 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-sb-cream/60">
                  Balances on arrival
                </p>
                <p className="mt-2 text-2xl font-semibold text-sb-cream">
                  <MoneyDisplay amountUSD={summary.totals.totalBalanceUSD} />
                </p>
                <p className="mt-1 text-[11px] text-sb-cream/60">
                  To be collected in person
                </p>
              </div>
            </div>

            {/* By type */}
            <div className="mb-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-sb-cream/20 bg-sb-deep/40 p-6 shadow-lg">
                <h2 className="text-base font-semibold text-sb-cream">
                  Day tours
                </h2>
                <p className="mt-2 text-sm text-sb-cream/70">
                  Short experiences like Safari Blue, Stone Town, Prison Island,
                  etc.
                </p>
                <dl className="mt-4 space-y-2.5 text-sm">
                  <div className="flex items-center justify-between border-b border-sb-cream/10 pb-2">
                    <dt className="text-sb-cream/80">Bookings</dt>
                    <dd className="font-semibold text-sb-cream">
                      {summary.byType.tours.bookingCount}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-b border-sb-cream/10 pb-2">
                    <dt className="text-sb-cream/80">Trip value</dt>
                    <dd className="text-sb-cream">
                      <MoneyDisplay amountUSD={summary.byType.tours.totalRevenueUSD} />
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-b border-sb-cream/10 pb-2">
                    <dt className="text-sb-cream/80">Deposits collected</dt>
                    <dd className="font-semibold text-emerald-400">
                      <MoneyDisplay amountUSD={summary.byType.tours.totalDepositsUSD} />
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sb-cream/80">Balances on day</dt>
                    <dd className="text-sb-cream">
                      <MoneyDisplay amountUSD={summary.byType.tours.totalBalanceUSD} />
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-sb-cream/20 bg-sb-deep/40 p-6 shadow-lg">
                <h2 className="text-base font-semibold text-sb-cream">
                  Multi-day packages
                </h2>
                <p className="mt-2 text-sm text-sb-cream/70">
                  Tailored itineraries combining coast, culture and inland
                  experiences.
                </p>
                <dl className="mt-4 space-y-2.5 text-sm">
                  <div className="flex items-center justify-between border-b border-sb-cream/10 pb-2">
                    <dt className="text-sb-cream/80">Bookings</dt>
                    <dd className="font-semibold text-sb-cream">
                      {summary.byType.packages.bookingCount}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-b border-sb-cream/10 pb-2">
                    <dt className="text-sb-cream/80">Trip value</dt>
                    <dd className="text-sb-cream">
                      <MoneyDisplay amountUSD={summary.byType.packages.totalRevenueUSD} />
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-b border-sb-cream/10 pb-2">
                    <dt className="text-sb-cream/80">Deposits collected</dt>
                    <dd className="font-semibold text-emerald-400">
                      <MoneyDisplay amountUSD={summary.byType.packages.totalDepositsUSD} />
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sb-cream/80">Balances on day</dt>
                    <dd className="text-sb-cream">
                      <MoneyDisplay amountUSD={summary.byType.packages.totalBalanceUSD} />
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Revenue by experience */}
            <div className="mb-10 rounded-2xl border border-sb-cream/20 bg-sb-deep/40 p-6 shadow-lg">
              <h2 className="text-base font-semibold text-sb-cream">
                Revenue by experience
              </h2>
              <p className="mt-2 text-sm text-sb-cream/70">
                Top tours and itineraries by total trip value.
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-sb-cream/20 bg-sb-deep/60 text-xs uppercase tracking-wide text-sb-cream/70">
                      <th className="px-4 py-3 text-left">Experience</th>
                      <th className="px-4 py-3 text-left">Bookings</th>
                      <th className="px-4 py-3 text-right">Trip value</th>
                      <th className="px-4 py-3 text-right">Deposits</th>
                      <th className="px-4 py-3 text-right">Balances</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.byExperience.map((row) => (
                      <tr
                        key={row.experienceSlug}
                        className="border-b border-sb-cream/10 last:border-none hover:bg-sb-deep/50"
                      >
                        <td className="px-4 py-3 align-top">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-sb-cream">
                              {row.experienceTitle}
                            </span>
                            <span className="text-[11px] text-sb-cream/60">
                              slug: <code>{row.experienceSlug}</code>
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top text-sb-cream/80">
                          {row.bookingCount}
                        </td>
                        <td className="px-4 py-3 align-top text-right font-medium text-sb-cream">
                          <MoneyDisplay amountUSD={row.totalRevenueUSD} />
                        </td>
                        <td className="px-4 py-3 align-top text-right font-medium text-emerald-400">
                          <MoneyDisplay amountUSD={row.totalDepositsUSD} />
                        </td>
                        <td className="px-4 py-3 align-top text-right text-sb-cream/80">
                          <MoneyDisplay amountUSD={row.totalBalanceUSD} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Revenue by month */}
            <div className="rounded-2xl border border-sb-cream/20 bg-sb-deep/40 p-6 shadow-lg">
              <h2 className="text-base font-semibold text-sb-cream">
                Revenue by month
              </h2>
              <p className="mt-2 text-sm text-sb-cream/70">
                Based on the tour date or, if missing, the booking creation date.
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-sb-cream/20 bg-sb-deep/60 text-xs uppercase tracking-wide text-sb-cream/70">
                      <th className="px-4 py-3 text-left">Month</th>
                      <th className="px-4 py-3 text-left">Bookings</th>
                      <th className="px-4 py-3 text-right">Trip value</th>
                      <th className="px-4 py-3 text-right">Deposits</th>
                      <th className="px-4 py-3 text-right">Balances</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.byMonth.map((row) => (
                      <tr
                        key={row.monthKey}
                        className="border-b border-sb-cream/10 last:border-none hover:bg-sb-deep/50"
                      >
                        <td className="px-4 py-3 align-top font-medium text-sb-cream">
                          {formatMonthLabel(row.monthKey)}
                        </td>
                        <td className="px-4 py-3 align-top text-sb-cream/80">
                          {row.bookingCount}
                        </td>
                        <td className="px-4 py-3 align-top text-right font-medium text-sb-cream">
                          <MoneyDisplay amountUSD={row.totalRevenueUSD} />
                        </td>
                        <td className="px-4 py-3 align-top text-right font-medium text-emerald-400">
                          <MoneyDisplay amountUSD={row.totalDepositsUSD} />
                        </td>
                        <td className="px-4 py-3 align-top text-right text-sb-cream/80">
                          <MoneyDisplay amountUSD={row.totalBalanceUSD} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-xs text-sb-cream/60">
                Use this as a quick sense-check of seasonality and to align
                expected balance collections in Zanzibar with your real cash flow.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

