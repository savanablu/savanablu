import { NextResponse } from "next/server";
import { getTourBySlug } from "@/lib/data/tours";
import { calculateBookingTotal } from "@/lib/booking/pricing";
import { findPromoByCode } from "@/lib/data/promos";

// Optional Stripe import (not required - using Ziina now)
let Stripe: any = null;
let stripe: any = null;

try {
  Stripe = require("stripe").default;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    console.warn(
      "[Stripe] STRIPE_SECRET_KEY is not set. Checkout will not function until configured."
    );
  }
  stripe = stripeSecretKey
    ? new Stripe(stripeSecretKey, {
        apiVersion: "2023-10-16"
      })
    : null;
} catch (err) {
  // Stripe not installed - that's fine, we're using Ziina now
  console.log("[Stripe] Stripe package not installed - using Ziina for payments");
}

// 30% deposit
const DEPOSIT_RATE = 0.3;

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Payment system is not configured. Please contact hello@savanablu.com to complete your booking."
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const {
      slug,
      date,
      adults,
      children,
      promoCode,
      customerName,
      customerEmail,
      customerPhone,
      notes
    } = body;

    if (!slug || !date || !adults || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: "Missing required booking details." },
        { status: 400 }
      );
    }

    const tour = await getTourBySlug(slug);
    if (!tour) {
      return NextResponse.json(
        { error: "Tour not found." },
        { status: 404 }
      );
    }

    // Base total in USD (adult full, children 50%)
    const baseTotal = calculateBookingTotal(tour.basePrice, adults, children);

    // Apply promo (server-side)
    let discountAmount = 0;
    let appliedPromoCode = "";
    if (promoCode && promoCode.trim()) {
      const promo = await findPromoByCode(promoCode);
      if (promo && promo.active) {
        appliedPromoCode = promo.code;
        if (promo.type === "percent") {
          discountAmount = (baseTotal * promo.value) / 100;
        } else if (promo.type === "fixed") {
          discountAmount = promo.value;
        }
      }
    }

    if (discountAmount > baseTotal) {
      discountAmount = baseTotal;
    }

    const finalTotal = baseTotal - discountAmount;

    // Deposit is 30% of final total
    const depositAmount = finalTotal * DEPOSIT_RATE;
    if (depositAmount <= 0) {
      return NextResponse.json(
        { error: "Booking total must be greater than zero." },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(depositAmount * 100);
    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountInCents,
            product_data: {
              name: `Tour: ${tour.title}`,
              description: `Deposit for ${adults} adults, ${children} children on ${date}`
            }
          }
        }
      ],
      metadata: {
        type: "tour",
        tourSlug: slug,
        tourTitle: tour.title,
        date,
        adults: String(adults),
        children: String(children),
        promoCode: appliedPromoCode,
        baseTotalUSD: baseTotal.toFixed(2),
        discountUSD: discountAmount.toFixed(2),
        finalTotalUSD: finalTotal.toFixed(2),
        depositRate: String(DEPOSIT_RATE),
        depositUSD: depositAmount.toFixed(2),
        customerName,
        customerEmail,
        customerPhone: customerPhone || "",
        notes: notes || ""
      },
      success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking/cancel`
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe tour session error:", err);
    return NextResponse.json(
      { error: err.message || "Unable to create checkout session." },
      { status: 500 }
    );
  }
}
