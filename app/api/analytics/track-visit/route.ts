// app/api/analytics/track-visit/route.ts

import { NextRequest, NextResponse } from "next/server";
import { incrementPageVisit } from "@/lib/data/page-visits";
import { addVisitRecord } from "@/lib/data/analytics";
import { getLocationFromRequest, parseUserAgent, parseReferrer } from "@/lib/analytics/geolocation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, type, userAgent, referrer } = body;

    // Validate input
    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Invalid slug" },
        { status: 400 }
      );
    }

    if (!type || (type !== "safari" && type !== "tour")) {
      return NextResponse.json(
        { error: "Invalid type. Must be 'safari' or 'tour'" },
        { status: 400 }
      );
    }

    // Increment simple visit count (backward compatible)
    const newCount = await incrementPageVisit(slug, type);

    // Get advanced analytics data
    const headers = request.headers;
    const location = await getLocationFromRequest(headers);
    const { device, browser } = parseUserAgent(userAgent);
    const { referrer: parsedReferrer, referrerType } = parseReferrer(referrer);

    // Add detailed visit record (only if cookie consent is given - checked client-side)
    try {
      await addVisitRecord({
        slug,
        type,
        country: location.country,
        city: location.city,
        device,
        browser,
        referrer: parsedReferrer,
        referrerType,
        userAgent: userAgent || undefined,
      });
    } catch (err) {
      // Don't fail the request if analytics recording fails
      console.warn("[Analytics] Failed to record detailed visit:", err);
    }

    return NextResponse.json({
      success: true,
      slug,
      type,
      count: newCount,
    });
  } catch (error: any) {
    console.error("Error tracking page visit:", error);
    return NextResponse.json(
      { error: "Failed to track visit", message: error.message },
      { status: 500 }
    );
  }
}

