import { NextResponse } from "next/server";
import { getBookingById, updateBookingNotes } from "@/lib/data/bookings";

type RouteParams = {
  params: { id: string };
};

export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = params;

  try {
    const booking = await getBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (err) {
    console.error("Error fetching booking:", err);
    return NextResponse.json(
      { error: "Unable to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const { id } = params;

  try {
    const body = await req.json();
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
  } catch (err) {
    console.error("Error updating booking notes:", err);
    return NextResponse.json(
      { error: "Unable to update notes" },
      { status: 500 }
    );
  }
}

