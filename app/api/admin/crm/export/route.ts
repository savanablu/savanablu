import { NextResponse } from "next/server";
import { readCrmLeads } from "@/lib/data/crm-leads";

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export async function GET() {
  const leads = await readCrmLeads();

  const headersRow = [
    "Lead ID",
    "Created At",
    "Status",
    "Source",
    "Name",
    "Email",
    "Phone",
    "Preferred Tour",
    "Message",
    "Follow-up Date",
    "Internal Notes",
  ];

  const lines: string[] = [];

  // Header
  lines.push(headersRow.map(escapeCsv).join(","));

  // Rows
  for (const lead of leads) {
    const row = [
      lead.id,
      formatDate(lead.createdAt),
      lead.status,
      lead.source || "",
      lead.name,
      lead.email,
      lead.phone || "",
      lead.preferredTour || "",
      lead.message || "",
      lead.followUpDate ? formatDate(lead.followUpDate) : "",
      lead.internalNotes || "",
    ];

    lines.push(row.map(escapeCsv).join(","));
  }

  const csv = lines.join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="savanablu-enquiries.csv"',
    },
  });
}

