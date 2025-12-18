import Link from "next/link";
import { readCrmLeads, type CrmLead } from "@/lib/data/crm-leads";

export const dynamic = "force-dynamic";

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

function sortLeads(leads: CrmLead[]): CrmLead[] {
  return [...leads].sort((a, b) => {
    const aDate = a.createdAt || "";
    const bDate = b.createdAt || "";
    return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
  });
}

function statusLabel(status: CrmLead["status"]) {
  switch (status) {
    case "new":
      return "New";
    case "in-progress":
      return "In progress";
    case "closed-won":
      return "Booked";
    case "closed-lost":
      return "Lost";
    default:
      return status;
  }
}

export default async function AdminCrmPage() {
  let leads: CrmLead[] = [];

  try {
    leads = await readCrmLeads();
  } catch (err) {
    console.error("Error reading crm-leads.json:", err);
  }

  const sorted = sortLeads(leads);
  const newCount = leads.filter((l) => l.status === "new").length;
  const inProgressCount = leads.filter((l) => l.status === "in-progress").length;
  const bookedCount = leads.filter((l) => l.status === "closed-won").length;
  const lostCount = leads.filter((l) => l.status === "closed-lost").length;

  return (
    <main className="min-h-screen bg-sb-deep text-sb-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10">
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
            Enquiries
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sb-cream/80">
            All enquiries captured from the website contact form. Follow up with
            guests over email or WhatsApp with a calm, personal touch.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/api/admin/crm/export"
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
              Download enquiries CSV
            </Link>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-5">
          <div className="rounded-xl border border-sb-sand/20 bg-sb-cream/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-sb-cream/60">
              Total enquiries
            </p>
            <p className="mt-2 text-2xl font-semibold text-sb-cream">
              {leads.length}
            </p>
          </div>
          <div className="rounded-xl border border-sb-sand/20 bg-sb-cream/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-sb-cream/60">
              New
            </p>
            <p className="mt-2 text-2xl font-semibold text-sb-coral">
              {newCount}
            </p>
          </div>
          <div className="rounded-xl border border-sb-sand/20 bg-sb-cream/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-sb-cream/60">
              In progress
            </p>
            <p className="mt-2 text-2xl font-semibold text-sb-lagoon">
              {inProgressCount}
            </p>
          </div>
          <div className="rounded-xl border border-sb-sand/20 bg-sb-cream/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-sb-cream/60">
              Booked
            </p>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">
              {bookedCount}
            </p>
          </div>
          <div className="rounded-xl border border-sb-sand/20 bg-sb-cream/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-sb-cream/60">
              Lost
            </p>
            <p className="mt-2 text-2xl font-semibold text-red-400">
              {lostCount}
            </p>
          </div>
        </div>

        {sorted.length === 0 ? (
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="mt-4 font-semibold text-sb-cream">
              No enquiries recorded yet.
            </p>
            <p className="mt-2 text-sm text-sb-cream/70">
              When guests send enquiries via your contact form, new leads will
              appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-sb-cream/20 bg-sb-deep/40 shadow-lg">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-sb-cream/20 bg-sb-deep/60 text-xs uppercase tracking-wide text-sb-cream/70">
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-left">Lead</th>
                  <th className="px-4 py-3 text-left">Preferred tour</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Follow-up</th>
                  <th className="px-4 py-3 text-left">Source</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-sb-cream/10 last:border-none hover:bg-sb-deep/50"
                  >
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-sb-cream">
                          {formatDate(lead.createdAt)}
                        </span>
                        <span className="text-[11px] text-sb-cream/60">
                          ID: <code>{lead.id}</code>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col gap-0.5">
                        <Link
                          href={`/admin/crm/${lead.id}`}
                          className="font-medium text-sb-cream hover:text-sb-lagoon hover:underline"
                        >
                          {lead.name}
                        </Link>
                        <span className="text-xs text-sb-cream/70">
                          {lead.email}
                          {lead.phone ? ` · ${lead.phone}` : ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-sb-cream/80">
                      {lead.preferredTour || "–"}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          lead.status === "new"
                            ? "bg-sb-coral/20 text-sb-coral"
                            : lead.status === "in-progress"
                            ? "bg-sb-lagoon/20 text-sb-lagoon"
                            : lead.status === "closed-won"
                            ? "bg-emerald-400/20 text-emerald-400"
                            : "bg-red-400/20 text-red-400"
                        }`}
                      >
                        {statusLabel(lead.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {lead.followUpDate ? (
                        (() => {
                          const followUp = new Date(lead.followUpDate);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const isPast = followUp < today;
                          return (
                            <span
                              className={isPast ? "text-sb-cream/40 line-through" : "text-sb-cream/80"}
                            >
                              {formatDate(lead.followUpDate)}
                            </span>
                          );
                        })()
                      ) : (
                        "–"
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-xs text-sb-cream/70">
                      {lead.source || "–"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

