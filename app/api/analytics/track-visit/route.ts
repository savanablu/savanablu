// app/api/analytics/track-visit/route.ts

import { NextRequest, NextResponse } from "next/server";
import { incrementPageVisit } from "@/lib/data/page-visits";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, type } = body;

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

    // Increment visit count
    const newCount = await incrementPageVisit(slug, type);

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

