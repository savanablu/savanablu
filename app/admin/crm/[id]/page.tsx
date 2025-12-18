import Link from "next/link";
import Section from "@/components/ui/Section";
import { getCrmLeadById } from "@/lib/data/crm-leads";
import { readAllBookings } from "@/lib/admin/bookings";
import CrmLeadDetailClient from "@/components/admin/CrmLeadDetailClient";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { id: string };
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function CrmLeadDetailPage({ params }: PageProps) {
  const lead = await getCrmLeadById(params.id);

  if (!lead) {
    return (
      <Section className="pb-16 pt-10">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="text-sm">
            <Link
              href="/admin/crm"
              className="text-[0.9rem] font-semibold text-sb-ocean hover:underline"
            >
              ← Back to leads
            </Link>
          </div>
          <div className="rounded-2xl bg-white/95 p-6 text-sm text-sb-ink">
            <h1 className="font-display text-xl text-sb-night">
              Lead not found
            </h1>
            <p className="mt-2 text-xs text-sb-ink/75">
              We couldn&apos;t find a lead with ID{" "}
              <code className="rounded bg-sb-shell/80 px-1 py-0.5">
                {params.id}
              </code>
              . It may have been removed or was never saved to{" "}
              <code className="rounded bg-sb-shell/80 px-1 py-0.5">
                data/crm-leads.json
              </code>
              .
            </p>
          </div>
        </div>
      </Section>
    );
  }

  // Find bookings with the same email (case-insensitive)
  const allBookings = await readAllBookings();
  const leadEmail = (lead.email || "").trim().toLowerCase();
  const relatedBookings = leadEmail
    ? allBookings.filter(
        (b) =>
          (b.customerEmail || "").trim().toLowerCase() === leadEmail
      )
    : [];

  return (
    <Section className="pb-16 pt-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="text-sm">
          <Link
            href="/admin/crm"
            className="text-[0.9rem] font-semibold text-sb-ocean hover:underline"
          >
            ← Back to leads
          </Link>
        </div>

        <header className="space-y-1">
          <h1 className="font-display text-2xl text-sb-night">
            {lead.name}
          </h1>
          <p className="text-xs text-sb-ink/75">
            Lead ID:{" "}
            <code className="rounded bg-sb-shell/80 px-1 py-0.5">
              {lead.id}
            </code>{" "}
            · Email: {lead.email}
          </p>
        </header>

        {/* Related bookings */}
        {relatedBookings.length > 0 && (
          <div className="rounded-2xl border border-sb-mist/80 bg-white/95 p-4 text-xs text-sb-ink/85 shadow-sm">
            <h2 className="font-display text-sm text-sb-night">
              Related bookings
            </h2>
            <p className="mt-1 text-[0.85rem] text-sb-ink/70">
              Bookings with the same email address as this lead.
            </p>
            <ul className="mt-3 space-y-2">
              {relatedBookings.map((b) => (
                <li
                  key={b.id}
                  className="flex flex-col gap-0.5 rounded-xl bg-sb-shell/60 px-3 py-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="text-[0.9rem] font-semibold text-sb-night hover:text-sb-ocean hover:underline"
                    >
                      {b.experienceTitle || "Booking details"}
                    </Link>
                    <span className="text-[0.78rem] text-sb-ink/70">
                      {b.date ? formatDate(b.date) : "Date tbc"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[0.78rem] text-sb-ink/70">
                    <span>
                      Party: {b.adults ?? 0} adult(s)
                      {b.children ? `, ${b.children} child(ren)` : ""}
                    </span>
                    <span>
                      Status: {b.status || "confirmed"} · Source:{" "}
                      {b.source || "website-booking"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <CrmLeadDetailClient lead={lead} />
      </div>
    </Section>
  );
}

