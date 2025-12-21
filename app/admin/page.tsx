import Link from "next/link";
import { Suspense } from "react";
import { readBookings } from "@/lib/data/bookings";
import { readCrmLeads } from "@/lib/data/crm-leads";
import { getBookingStatus } from "@/components/admin/StatusBadge";
import { getFinanceSummary } from "@/lib/finance/summary";
import { getPageVisits, getVisitStatsByType } from "@/lib/data/page-visits";
import { getAnalyticsSummary, getUniqueVisitStatsByType, getTotalUniqueVisits } from "@/lib/data/analytics";
import RevenueByMonthChart from "@/components/admin/RevenueByMonthChart";
import BookingStatusChart from "@/components/admin/BookingStatusChart";
import RevenueByTypeChart from "@/components/admin/RevenueByTypeChart";
import GeographicChart from "@/components/admin/GeographicChart";
import DeviceBrowserChart from "@/components/admin/DeviceBrowserChart";
import ReferrerChart from "@/components/admin/ReferrerChart";
import TimePatternChart from "@/components/admin/TimePatternChart";
import TopPagesTable from "@/components/admin/TopPagesTable";
import PageVisitsChart from "@/components/admin/PageVisitsChart";
import BookingStatsChart from "@/components/admin/BookingStatsChart";
import RevenueStatsChart from "@/components/admin/RevenueStatsChart";
import ClearAllBookingsButton from "@/components/admin/ClearAllBookingsButton";
import { MoneyDisplay } from "@/components/admin/MoneyDisplay";

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  // Fetch data for quick stats
  let bookingsCount = 0;
  let upcomingCount = 0;
  let confirmedCount = 0;
  let onHoldCount = 0;
  let enquiriesCount = 0;
  let totalRevenue = 0;
  let totalAdvances = 0;
  let totalBalances = 0;
  let financeSummary = null;
  let cancelledCount = 0;
  let totalPageVisits = 0;
  let safariVisits = 0;
  let tourVisits = 0;
  let analyticsSummary = null;

  try {
    const bookings = await readBookings();
    bookingsCount = bookings.length;
    const now = new Date();
    upcomingCount = bookings.filter((b: any) => {
      const bookingDate = b.date ? new Date(b.date) : null;
      return bookingDate && bookingDate >= now;
    }).length;
    
    // Use consistent status logic
    const statusBreakdown = {
      confirmed: bookings.filter((b: any) => getBookingStatus(b) === "confirmed").length,
      onHold: bookings.filter((b: any) => getBookingStatus(b) === "on-hold").length,
      cancelled: bookings.filter((b: any) => getBookingStatus(b) === "cancelled").length,
    };
    confirmedCount = statusBreakdown.confirmed;
    onHoldCount = statusBreakdown.onHold;
    cancelledCount = statusBreakdown.cancelled;
  } catch (err) {
    console.error("Error loading bookings:", err);
  }

  try {
    const leads = await readCrmLeads();
    enquiriesCount = leads.length;
  } catch (err) {
    console.error("Error loading enquiries:", err);
  }

  try {
    financeSummary = await getFinanceSummary();
    totalRevenue = financeSummary.totals.totalRevenueUSD;
    totalAdvances = financeSummary.totals.totalDepositsUSD;
    totalBalances = financeSummary.totals.totalBalanceUSD;
  } catch (err) {
    console.error("Error loading finance:", err);
  }

  try {
    // Use unique visit counts from analytics (excludes your IP and counts only unique visitors)
    const uniqueStats = await getUniqueVisitStatsByType();
    totalPageVisits = await getTotalUniqueVisits();
    safariVisits = uniqueStats.safaris.total;
    tourVisits = uniqueStats.tours.total;
  } catch (err) {
    console.error("Error loading page visits:", err);
    // Fallback to simple counts if analytics fails
    try {
      const visitsData = await getPageVisits();
      totalPageVisits = visitsData.totalVisits;
      const statsByType = await getVisitStatsByType();
      safariVisits = statsByType.safaris.total;
      tourVisits = statsByType.tours.total;
    } catch (fallbackErr) {
      console.error("Error loading fallback page visits:", fallbackErr);
    }
  }

  try {
    analyticsSummary = await getAnalyticsSummary();
  } catch (err) {
    console.error("Error loading analytics summary:", err);
  }


  return (
    <main className="min-h-screen bg-sb-deep text-sb-cream">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-sb-cream/60">
                Admin · Savana Blu
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-wide sm:text-4xl">
                Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sb-cream/80">
                Internal tools for managing bookings, revenue snapshots and enquiries.
                This area is not visible to guests.
              </p>
            </div>
          </div>
        </header>

        {/* Clear All Bookings Button - Temporary */}
        <ClearAllBookingsButton />

        {/* Main Actions */}
        <section className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/bookings"
            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6 transition-all duration-300 hover:border-white/40 hover:shadow-xl hover:shadow-sb-ocean/20"
          >
            <div className="absolute right-4 top-4 opacity-20 transition-opacity group-hover:opacity-30">
              <svg
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/60">
                Core operations
              </p>
              <h2 className="mt-3 text-lg font-semibold text-white">
                Bookings
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                View all bookings, manage statuses, download CSV exports and send
                WhatsApp handovers with complete guest details.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                Open bookings
                <svg
                  className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
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
              </div>
            </div>
          </Link>

          <Link
            href="/admin/finance"
            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6 transition-all duration-300 hover:border-white/40 hover:shadow-xl hover:shadow-sb-ocean/20"
          >
            <div className="absolute right-4 top-4 opacity-20 transition-opacity group-hover:opacity-30">
              <svg
                className="h-12 w-12 text-white"
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
            </div>
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/60">
                Financial overview
              </p>
              <h2 className="mt-3 text-lg font-semibold text-white">
                Revenue snapshot
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Download CSV exports with booking totals, revenue breakdowns and
                financial summaries for Excel or Google Sheets.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                View finance
                <svg
                  className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
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
              </div>
            </div>
          </Link>

          <Link
            href="/admin/crm"
            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6 transition-all duration-300 hover:border-white/40 hover:shadow-xl hover:shadow-sb-ocean/20"
          >
            <div className="absolute right-4 top-4 opacity-20 transition-opacity group-hover:opacity-30">
              <svg
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/60">
                Guest communications
              </p>
              <h2 className="mt-3 text-lg font-semibold text-white">
                Enquiries
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                View all contact-form enquiries and follow up with guests over
                email or WhatsApp with a calm, personal touch.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                View enquiries
                <svg
                  className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
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
              </div>
            </div>
          </Link>
        </section>

        {/* Booking & Revenue Charts */}
        <div className="mb-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6 shadow-lg backdrop-blur-sm">
            <Suspense fallback={<div className="h-64 flex items-center justify-center text-white/60">Loading chart...</div>}>
              <BookingStatsChart
                total={bookingsCount}
                upcoming={upcomingCount}
                confirmed={confirmedCount}
                onHold={onHoldCount}
              />
            </Suspense>
          </div>
          <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6 shadow-lg backdrop-blur-sm">
            <Suspense fallback={<div className="h-64 flex items-center justify-center text-white/60">Loading chart...</div>}>
              <RevenueStatsChart
                totalRevenue={totalRevenue}
                advances={totalAdvances}
                balances={totalBalances}
              />
            </Suspense>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <div className="rounded-xl border border-sb-sand/20 bg-sb-cream/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-sb-cream/60">
              Enquiries
            </p>
            <p className="mt-2 text-2xl font-semibold text-sb-cream">
              {enquiriesCount}
            </p>
            <p className="mt-1 text-[11px] text-sb-cream/60">
              Contact form leads
            </p>
          </div>
          <div className="rounded-xl border border-sb-sand/20 bg-sb-cream/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-sb-cream/60">
              Collection rate
            </p>
            <p className="mt-2 text-xl font-semibold text-sb-cream">
              {totalRevenue > 0
                ? `${((totalAdvances / totalRevenue) * 100).toFixed(1)}%`
                : "0%"}
            </p>
            <p className="mt-1 text-[11px] text-sb-cream/60">
              Advances / Revenue
            </p>
          </div>
        </div>



        {/* Charts Section */}
        {financeSummary && (
          <section className="mb-10">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-sb-cream">
                Analytics & Insights
              </h2>
              <p className="mt-2 text-sm text-sb-cream/70">
                Visual breakdown of revenue trends, booking statuses, and performance by tour type
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6 shadow-lg backdrop-blur-sm">
                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-white">
                    Revenue Trends by Month
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/70">
                    Monthly breakdown showing total trip value (revenue) and advances collected. 
                    Helps identify seasonal patterns and payment collection trends over time.
                  </p>
                </div>
                <Suspense fallback={<div className="h-64 flex items-center justify-center text-white/60">Loading chart...</div>}>
                  <RevenueByMonthChart data={financeSummary.byMonth} />
                </Suspense>
              </div>

              <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6 shadow-lg backdrop-blur-sm">
                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-white">
                    Booking Status Distribution
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/70">
                    Visual breakdown of all bookings by status: confirmed (20% advance paid), 
                    on hold (awaiting payment), and cancelled. Shows overall booking health.
                  </p>
                </div>
                <Suspense fallback={<div className="h-64 flex items-center justify-center text-white/60">Loading chart...</div>}>
                  <BookingStatusChart
                    confirmed={confirmedCount}
                    onHold={onHoldCount}
                    cancelled={cancelledCount}
                  />
                </Suspense>
              </div>

              <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6 shadow-lg backdrop-blur-sm lg:col-span-2">
                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-white">
                    Revenue Comparison by Tour Category
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/70">
                    Side-by-side comparison of day tours vs. multi-day packages showing total revenue, 
                    advances collected, and balances due on arrival. Useful for understanding which category 
                    generates more revenue and payment collection efficiency.
                  </p>
                </div>
                <Suspense fallback={<div className="h-64 flex items-center justify-center text-white/60">Loading chart...</div>}>
                  <RevenueByTypeChart
                    tours={financeSummary.byType.tours}
                    packages={financeSummary.byType.packages}
                  />
                </Suspense>
              </div>
            </div>
          </section>
        )}

        {/* Advanced Analytics Section */}
        {analyticsSummary && (
          <section className="mb-10">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-sb-cream">
                Advanced Page Analytics
              </h2>
              <p className="mt-2 text-sm text-sb-cream/70">
                Detailed insights into visitor behavior, geographic distribution, device usage, and traffic sources
              </p>
            </div>

            {/* Geographic Analytics */}
            <div className="mb-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6 shadow-lg backdrop-blur-sm">
                <GeographicChart
                  data={analyticsSummary.byCountry}
                  title="Visits by Country"
                />
              </div>
              <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6 shadow-lg backdrop-blur-sm">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4">Top Cities</h4>
                  <div className="space-y-2">
                    {analyticsSummary.byCity.slice(0, 10).map((item, index) => (
                      <div
                        key={item.city}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <span className="text-sm text-white/80">
                          #{index + 1} {item.city}
                        </span>
                        <span className="text-sm font-semibold text-white">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Device & Browser Analytics */}
            <div className="mb-6 rounded-2xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6 shadow-lg backdrop-blur-sm">
              <DeviceBrowserChart
                deviceData={analyticsSummary.byDevice}
                browserData={analyticsSummary.byBrowser}
              />
            </div>

            {/* Referrer Analytics */}
            <div className="mb-6 rounded-2xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6 shadow-lg backdrop-blur-sm">
              <ReferrerChart data={analyticsSummary.byReferrer} />
            </div>

            {/* Time Patterns */}
            <div className="mb-6 rounded-2xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6 shadow-lg backdrop-blur-sm">
              <TimePatternChart
                hourlyData={analyticsSummary.byHour}
                dailyData={analyticsSummary.byDayOfWeek}
              />
            </div>

            {/* Page Visits Chart */}
            <div className="mb-6 rounded-2xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6 shadow-lg backdrop-blur-sm">
              <Suspense fallback={<div className="h-64 flex items-center justify-center text-white/60">Loading chart...</div>}>
                <PageVisitsChart
                  totalVisits={totalPageVisits}
                  safariVisits={safariVisits}
                  tourVisits={tourVisits}
                />
              </Suspense>
            </div>

            {/* Top Pages */}
            <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-sb-night/90 to-sb-ocean/80 p-6 shadow-lg backdrop-blur-sm">
              <TopPagesTable pages={analyticsSummary.topPages} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

