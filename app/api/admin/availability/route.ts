import { NextResponse } from "next/server";
import {
  readAvailability,
  writeAvailability,
  type AvailabilityData,
} from "@/lib/data/availability";

export async function GET() {
  try {
    const data = await readAvailability();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error reading availability:", err);
    return NextResponse.json(
      { error: "Unable to read availability" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<AvailabilityData>;

    const payload: AvailabilityData = {
      globalBlocked: Array.isArray(body.globalBlocked)
        ? body.globalBlocked
        : [],
      tours:
        typeof body.tours === "object" && body.tours !== null
          ? body.tours
          : {},
    };

    await writeAvailability(payload);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error writing availability:", err);
    return NextResponse.json(
      { error: "Unable to update availability" },
      { status: 500 }
    );
  }
}

