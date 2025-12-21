import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { appendBooking, type BookingRecord } from "@/lib/data/bookings";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const runtime = "nodejs"; // required to use Stripe's Node SDK & raw body

export async function POST(req: Request) {
  if (!stripeSecretKey) {
    console.error("Stripe secret key is not configured.");
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2022-11-15",
  });

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();

    if (webhookSecret) {
      const sig = headers().get("stripe-signature");
      if (!sig) {
        console.error("Missing Stripe signature header");
        return NextResponse.json(
          { error: "Missing Stripe signature" },
          { status: 400 }
        );
      }

      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      // No webhook secret configured – fall back to trusting the body (dev only)
      console.warn(
        "[stripe webhook] STRIPE_WEBHOOK_SECRET not set – skipping signature verification (dev mode)."
      );
      event = JSON.parse(rawBody) as Stripe.Event;
    }
  } catch (err: any) {
    console.error("Stripe webhook error:", err.message);
    return NextResponse.json(
      { error: "Invalid webhook payload" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata || {};

    try {
      const type =
        (meta.type as "tour" | "package") === "package"
          ? "package"
          : "tour";

      const experienceSlug =
        (meta.tourSlug as string) ||
        (meta.packageSlug as string) ||
        "";

      const experienceTitle =
        (meta.tourTitle as string) ||
        (meta.packageTitle as string) ||
        "Experience";

      const date = (meta.date as string) || "";

      const adults = Number(meta.adults || "0") || 0;
      const children = Number(meta.children || "0") || 0;

      // Use finalTotalUSD from metadata, or calculate from baseTotalUSD and discountUSD
      const finalTotalUSD =
        Number(meta.finalTotalUSD || "0") ||
        (Number(meta.baseTotalUSD || "0") - Number(meta.discountUSD || "0")) ||
        0;

      const depositUSD =
        Number(meta.depositUSD || "0") ||
        (typeof session.amount_total === "number"
          ? session.amount_total / 100
          : 0);

      const balanceUSD =
        finalTotalUSD > depositUSD
          ? Number((finalTotalUSD - depositUSD).toFixed(2))
          : 0;

      const promoCode = (meta.promoCode as string) || undefined;
      const customerName = (meta.customerName as string) || "Guest";
      const customerEmail =
        session.customer_details?.email ||
        (meta.customerEmail as string) ||
        "";
      const customerPhone =
        (meta.customerPhone as string) ||
        session.customer_details?.phone ||
        undefined;
      const notes = (meta.notes as string) || undefined;

      if (!customerEmail) {
        console.warn(
          "[stripe webhook] Checkout session completed without customer email – skipping booking append."
        );
      } else {
        const booking: BookingRecord = {
          id: `booking_${Date.now()}_${session.id}`,
          sessionId: session.id,
          type,
          experienceSlug,
          experienceTitle,
          date,
          adults,
          children,
          totalUSD: finalTotalUSD,
          depositUSD,
          balanceUSD,
          promoCode,
          customerName,
          customerEmail,
          customerPhone,
          notes,
          status: "confirmed",
          createdAt: new Date().toISOString(),
          source: "stripe-checkout",
        };

        await appendBooking(booking);
      }
    } catch (err) {
      console.error("Error while saving booking from webhook:", err);
      // Don't fail the webhook for this – Stripe will retry, and we don't want repeated duplicates
    }
  } else {
    // For now we ignore other event types
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

