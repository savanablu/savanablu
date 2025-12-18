import { NextRequest, NextResponse } from "next/server";
import { createZiinaPaymentIntent } from "@/lib/payments/ziina";

type CreateZiinaPaymentIntentBody = {
  /**
   * Deposit amount in USD (we will convert to cents here).
   * Example: 11.52 (USD) -> 1152 (cents)
   */
  amountUsd: number;
  /**
   * Optional bookingId so we can keep track when user returns.
   */
  bookingId?: string;
  /**
   * Optional description shown in Ziina / your dashboard.
   */
  description?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateZiinaPaymentIntentBody;
    const { amountUsd, bookingId, description } = body;

    if (!amountUsd || amountUsd <= 0) {
      return NextResponse.json(
        { error: "amountUsd must be a positive number" },
        { status: 400 }
      );
    }

    // Build success and cancel paths
    const successPath = bookingId
      ? `/booking/ziina/success?bookingId=${encodeURIComponent(bookingId)}`
      : `/booking/ziina/success`;

    const cancelPath = bookingId
      ? `/booking/ziina/cancel?bookingId=${encodeURIComponent(bookingId)}`
      : `/booking/ziina/cancel`;

    // Use explicit test mode flag or fall back to NODE_ENV check
    // Set ZIINA_TEST_MODE=true in .env.local to force test mode
    const isTestMode = process.env.ZIINA_TEST_MODE === "true" || process.env.NODE_ENV !== "production";

    const { paymentIntentId, redirectUrl } = await createZiinaPaymentIntent({
      amountUsd,
      description: description || "Savana Blu – 20% advance payment",
      successPath,
      cancelPath,
      test: isTestMode,
    });

    return NextResponse.json({
      redirectUrl,
      paymentIntentId,
    });
  } catch (err) {
    console.error("Error creating Ziina payment intent:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Unexpected error creating Ziina payment intent";
    
    // Return more detailed error for debugging
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" 
          ? (err instanceof Error ? err.stack : String(err))
          : undefined
      },
      { status: 500 }
    );
  }
}

