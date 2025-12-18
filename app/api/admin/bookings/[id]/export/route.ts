import { NextResponse } from "next/server";
import { getBookingById } from "@/lib/data/bookings";

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);

  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

type RouteParams = {
  params: { id: string };
};

export async function GET(_req: Request, { params }: RouteParams) {
  const booking = await getBookingById(params.id);

  if (!booking) {
    return NextResponse.json(
      { error: "Booking not found" },
      { status: 404 }
    );
  }

  const headersRow = [
    "Booking ID",
    "Type",
    "Experience Slug",
    "Experience Title",
    "Date",
    "Adults",
    "Children",
    "Total USD",
    "Deposit USD",
    "Balance USD",
    "Promo Code",
    "Customer Name",
    "Customer Email",
    "Customer Phone",
    "Guest Notes",
    "Internal Notes",
    "Status",
    "Created At",
    "Source",
    "Payment Session ID",
  ];

  const row = [
    booking.id,
    booking.type ?? "",
    booking.experienceSlug ?? "",
    booking.experienceTitle ?? "",
    booking.date ?? "",
    booking.adults ?? "",
    booking.children ?? "",
    booking.totalUSD ?? "",
    booking.depositUSD ?? "",
    booking.balanceUSD ?? "",
    booking.promoCode ?? "",
    booking.customerName ?? "",
    booking.customerEmail ?? "",
    booking.customerPhone ?? "",
    booking.notes ?? "",
    booking.internalNotes ?? "",
    booking.status ?? "",
    booking.createdAt ?? "",
    booking.source ?? "",
    booking.sessionId ?? "",
  ];

  const csv =
    headersRow.map(escapeCsv).join(",") +
    "\n" +
    row.map(escapeCsv).join(",");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="booking-${booking.id}.csv"`,
    },
  });
}

