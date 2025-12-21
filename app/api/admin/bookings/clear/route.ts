// app/api/admin/bookings/clear/route.ts
// API endpoint to clear all booking data

import { NextResponse } from "next/server";
import { writeBookings } from "@/lib/data/bookings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
  try {
    // Clear all bookings by writing an empty array
    // This will clear both Redis (if available) and file system
    await writeBookings([]);
    
    return NextResponse.json({ 
      success: true, 
      message: "All bookings cleared successfully",
      count: 0
    });
  } catch (err: any) {
    console.error("Error clearing bookings:", err);
    return NextResponse.json(
      { error: "Failed to clear bookings", message: err.message },
      { status: 500 }
    );
  }
}

