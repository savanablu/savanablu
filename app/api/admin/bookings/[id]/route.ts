import { NextResponse } from "next/server";
import { updateBookingNotes, updateBookingStatus } from "@/lib/data/bookings";

type RouteParams = {
  params: { id: string };
};

export async function PATCH(req: Request, { params }: RouteParams) {
  const { id } = params;

  try {
    const body = await req.json();

    // Handle internal notes update
    if (body.internalNotes !== undefined) {
      const internalNotes =
        typeof body.internalNotes === "string" ? body.internalNotes : "";

      const updated = await updateBookingNotes(id, internalNotes);

      if (!updated) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, booking: updated });
    }

    // Handle status updates (cancel, reverse payment)
    if (body.action === "cancel" || body.action === "reverse-payment") {
      const updates: any = {};

      if (body.action === "cancel") {
        updates.status = "cancelled";
        updates.paymentStatus = "cancelled";
        if (body.reason) {
          updates.cancellationReason = body.reason;
        }
      }

      if (body.action === "reverse-payment") {
        updates.paymentStatus = "refunded";
        updates.refundedAt = new Date().toISOString();
        if (body.amount) {
          updates.refundedAmount = body.amount;
        }
        if (body.reason) {
          updates.refundReason = body.reason;
        }
      }

      const updated = await updateBookingStatus(id, updates);

      if (!updated) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, booking: updated });
    }

    return NextResponse.json(
      { error: "Invalid action or missing fields" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Error updating booking:", err);
    return NextResponse.json(
      { error: "Unable to update booking" },
      { status: 500 }
    );
  }
}

