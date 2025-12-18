import Section from "@/components/ui/Section";
import {
  readAllBookings,
  splitBookingsByDate,
  getBookingDate,
  type AdminBooking,
} from "@/lib/admin/bookings";
import StaffScheduleClient from "@/components/admin/StaffScheduleClient";

export const dynamic = "force-dynamic";

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function StaffSchedulePage() {
  const allBookings = await readAllBookings();
  const { upcoming } = splitBookingsByDate(allBookings);

  // Sort upcoming by date, then by experience title
  const sorted = [...upcoming].sort((a, b) => {
    const aDate = getBookingDate(a);
    const bDate = getBookingDate(b);
    if (!aDate || !bDate) return 0;
    if (aDate.getTime() === bDate.getTime()) {
      return ((a.experienceTitle as string) || "").localeCompare(
        (b.experienceTitle as string) || ""
      );
    }
    return aDate.getTime() - bDate.getTime();
  });

  const withLabels = sorted.map((b) => {
    const bookingDate = getBookingDate(b);
    const dateStr = bookingDate ? bookingDate.toISOString().split("T")[0] : null;
    return {
      ...b,
      dateLabel: dateStr ? formatDateLabel(dateStr) : "Date tbc",
    } as AdminBooking & { dateLabel: string };
  });

  // Group by date label for display
  const grouped = withLabels.reduce<
    Record<string, (typeof withLabels)[number][]>
  >((acc, b) => {
    if (!acc[b.dateLabel]) acc[b.dateLabel] = [];
    acc[b.dateLabel].push(b);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => {
    const aSample = grouped[a][0];
    const bSample = grouped[b][0];
    const aDate = getBookingDate(aSample as AdminBooking);
    const bDate = getBookingDate(bSample as AdminBooking);
    if (!aDate || !bDate) return 0;
    return aDate.getTime() - bDate.getTime();
  });

  return (
    <Section className="pb-16 pt-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2">
          <h1 className="font-display text-2xl text-sb-night">
            Staff handover – upcoming bookings
          </h1>
          <p className="max-w-2xl text-sm text-sb-ink/80">
            A simple view of all upcoming bookings from today onwards. Use this for your handover with guides and drivers.
          </p>
        </header>

        <StaffScheduleClient bookings={withLabels} />

        {sortedDates.length === 0 ? (
          <div className="rounded-2xl border border-sb-mist/80 bg-white/95 p-6 text-sm text-sb-ink/80">
            <p className="font-semibold text-sb-night">
              No upcoming bookings.
            </p>
            <p className="mt-2 text-xs text-sb-ink/70">
              Once you have bookings with tour dates from today onwards, they
              will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDates.map((label) => (
              <div
                key={label}
                className="rounded-2xl border border-sb-mist/80 bg-white/95 p-4 shadow-sm"
              >
                <h2 className="font-display text-sm text-sb-night">
                  {label}
                </h2>
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-sb-mist/70 bg-sb-shell/80 text-[0.78rem] uppercase tracking-wide text-sb-ink/70">
                        <th className="px-3 py-2 text-left">Experience</th>
                        <th className="px-3 py-2 text-left">Guest</th>
                        <th className="px-3 py-2 text-left">Party</th>
                        <th className="px-3 py-2 text-left">Contact</th>
                        <th className="px-3 py-2 text-left">Internal notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grouped[label].map((b) => (
                        <tr
                          key={b.id}
                          className="border-b border-sb-mist/40 last:border-none hover:bg-sb-shell/40"
                        >
                          <td className="px-3 py-2 align-top">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium text-sb-night">
                                {b.experienceTitle || "Experience"}
                              </span>
                              <span className="text-[0.68rem] text-sb-ink/60">
                                slug: <code>{b.experienceSlug}</code>
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2 align-top text-[0.85rem] text-sb-ink/80">
                            {b.customerName || "Guest"}
                          </td>
                          <td className="px-3 py-2 align-top text-[0.85rem] text-sb-ink/80">
                            {b.adults ?? 0} adult(s)
                            {b.children ? `, ${b.children} child(ren)` : ""}
                          </td>
                          <td className="px-3 py-2 align-top text-[0.85rem] text-sb-ink/80">
                            {b.customerPhone || b.customerEmail || "–"}
                          </td>
                          <td className="px-3 py-2 align-top text-[0.85rem] text-sb-ink/80">
                            {b.internalNotes
                              ? b.internalNotes.length > 160
                                ? b.internalNotes.slice(0, 157) + "..."
                                : b.internalNotes
                              : "–"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-[0.78rem] text-sb-ink/60">
          This page is internal only and sits behind your admin passcode. To
          share details with guides, either copy the summary text above into
          WhatsApp or take a quick screenshot of the relevant section.
        </p>
      </div>
    </Section>
  );
}

