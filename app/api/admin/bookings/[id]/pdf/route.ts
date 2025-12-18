import { NextResponse } from "next/server";
import { getBookingById } from "@/lib/data/bookings";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const runtime = "nodejs";

type RouteParams = {
  params: { id: string };
};

function formatMoney(value?: number): string {
  if (typeof value !== "number" || isNaN(value)) return "-";

  return `USD ${value.toFixed(2)}`;
}

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

export async function GET(_req: Request, { params }: RouteParams) {
  const booking = await getBookingById(params.id);

  if (!booking) {
    return NextResponse.json(
      { error: "Booking not found" },
      { status: 404 }
    );
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 portrait
  const { width, height } = page.getSize();

  const fontTitle = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontBody = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - 60;
  const marginX = 60;

  const drawText = (
    text: string,
    options?: { size?: number; bold?: boolean; colorGray?: number }
  ) => {
    const size = options?.size ?? 10;
    const font = options?.bold ? fontTitle : fontBody;
    const gray = options?.colorGray ?? 0.15;

    page.drawText(text, {
      x: marginX,
      y,
      size,
      font,
      color: rgb(gray, gray, gray),
    });

    y -= size + 6;
  };

  // Header
  drawText("Savana Blu Luxury Expeditions", {
    size: 14,
    bold: true,
  });
  drawText("Internal booking snapshot", { size: 10, colorGray: 0.35 });
  y -= 10;

  // Basic details
  drawText(`Booking ID: ${booking.id}`, { size: 9, colorGray: 0.4 });
  drawText(
    `Type: ${
      booking.type === "package"
        ? "Package"
        : booking.type === "tour"
        ? "Tour"
        : "-"
    }`,
    { size: 9, colorGray: 0.4 }
  );
  y -= 6;

  drawText(
    `Created: ${booking.createdAt ? formatDate(booking.createdAt) : "-"}`,
    { size: 9, colorGray: 0.4 }
  );
  drawText(
    `Tour date: ${booking.date ? formatDate(booking.date) : "-"}`,
    { size: 9, colorGray: 0.4 }
  );
  y -= 12;

  // Experience
  drawText("Experience", { size: 11, bold: true });
  drawText(booking.experienceTitle || "-", { size: 10 });
  if (booking.experienceSlug) {
    drawText(`Slug: ${booking.experienceSlug}`, {
      size: 8,
      colorGray: 0.4,
    });
  }
  y -= 6;

  // Guest
  y -= 4;
  drawText("Guest", { size: 11, bold: true });
  drawText(booking.customerName || "-", { size: 10 });
  if (booking.customerEmail) {
    drawText(`Email: ${booking.customerEmail}`, {
      size: 9,
      colorGray: 0.35,
    });
  }
  if (booking.customerPhone) {
    drawText(`Phone: ${booking.customerPhone}`, {
      size: 9,
      colorGray: 0.35,
    });
  }
  y -= 8;

  // Party & money
  y -= 4;
  drawText("Party & amounts", { size: 11, bold: true });
  drawText(
    `Party: ${booking.adults ?? 0} adult(s)${
      booking.children ? `, ${booking.children} child(ren)` : ""
    }`,
    { size: 9 }
  );
  drawText(
    `Trip value: ${formatMoney(booking.totalUSD)} · Advance (if paid): ${formatMoney(
      booking.depositUSD
    )} · Balance: ${formatMoney(booking.balanceUSD)}`,
    { size: 9 }
  );
  if (booking.promoCode) {
    drawText(`Promo code: ${booking.promoCode}`, {
      size: 9,
      colorGray: 0.4,
    });
  }
  y -= 8;

  // Booking notes & pickup details
  y -= 4;
  drawText("Booking notes & pickup details", { size: 11, bold: true });
  const notesText = booking.notes || "No additional notes recorded.";
  const notesLines = wrapText(notesText, 70);
  for (const line of notesLines) {
    drawText(line, { size: 9, colorGray: 0.25 });
  }

  // Internal notes
  if (booking.internalNotes) {
    y -= 6;
    drawText("Internal notes (operator only)", {
      size: 11,
      bold: true,
    });
    const lines = wrapText(booking.internalNotes, 70);
    for (const line of lines) {
      drawText(line, { size: 9, colorGray: 0.25 });
    }
  }

  // Footer
  y = 40;
  page.drawText("Zanzibar · East Africa Time (GMT+3)", {
    x: marginX,
    y,
    size: 8,
    font: fontBody,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="booking-${booking.id}.pdf"`,
    },
  });
}

// Very small text wrapper: splits by words into lines of ~maxChars characters
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (!current) {
      current = word;
    } else if ((current + " " + word).length <= maxChars) {
      current += " " + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

