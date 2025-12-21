// app/api/admin/seo-stats/route.ts

import { NextResponse } from "next/server";
import { getSEOSummary } from "@/lib/data/seo";
import { readAnalyticsFromStorage } from "@/lib/data/analytics";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Debug: Check if we have analytics data
    const analyticsData = await readAnalyticsFromStorage();
    console.log("[SEO Stats] Total visits in analytics:", analyticsData.visits.length);
    console.log("[SEO Stats] Visits with referrer:", analyticsData.visits.filter(v => v.referrer).length);
    console.log("[SEO Stats] Visits with referrerType='search':", analyticsData.visits.filter(v => v.referrerType === "search").length);
    
    const summary = await getSEOSummary();
    console.log("[SEO Stats] Summary:", {
      organicSearchVisits: summary.organicSearchVisits,
      searchQueriesCount: summary.searchQueries.length,
      topPagesCount: summary.topSearchPages.length,
    });
    
    return NextResponse.json(summary);
  } catch (error: any) {
    console.error("[SEO Stats] Error loading SEO stats:", error);
    console.error("[SEO Stats] Error stack:", error?.stack);
    return NextResponse.json(
      { 
        error: "Failed to load SEO stats",
        message: error?.message,
        details: process.env.NODE_ENV === "development" ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}

