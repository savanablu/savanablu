import { NextResponse } from "next/server";
import {
  getBlockedDatesForTour,
  readAvailability,
} from "@/lib/data/availability";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tourSlug = url.searchParams.get("tourSlug");

  try {
    let blockedDates: string[] = [];

    if (tourSlug) {
      blockedDates = await getBlockedDatesForTour(tourSlug);
    } else {
      // If no tourSlug is provided, just return global blocked dates
      const data = await readAvailability();
      blockedDates = data.globalBlocked || [];
    }

    return NextResponse.json({ blockedDates });
  } catch (err) {
    console.error("Error loading availability:", err);
    return NextResponse.json(
      { error: "Unable to load availability" },
      { status: 500 }
    );
  }
}

