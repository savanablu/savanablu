// app/api/admin/seo-stats/route.ts

import { NextResponse } from "next/server";
import { getSEOSummary } from "@/lib/data/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const summary = await getSEOSummary();
    return NextResponse.json(summary);
  } catch (error: any) {
    console.error("Error loading SEO stats:", error);
    return NextResponse.json(
      { error: "Failed to load SEO stats" },
      { status: 500 }
    );
  }
}

