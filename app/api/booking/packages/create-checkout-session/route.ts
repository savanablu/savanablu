import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPackageBySlug } from "@/lib/data/packages";
import { calculateBookingTotal } from "@/lib/booking/pricing";
import { findPromoByCode } from "@/lib/data/promos";
import { sendEmail } from "@/lib/email";
import {
  bookingDepositCustomerEmail,
  bookingDepositOperatorEmail,
  type BookingSummary,
} from "@/lib/email";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2022-11-15" })
  : null;

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 500 }
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
      notes,
      totalUSD,
      depositUSD,
    } = body;

    const pkg = await getPackageBySlug(slug);
    if (!pkg) {
      return NextResponse.json(
        { error: "Package not found." },
        { status: 404 }
      );
    }

    const adultsNum = Number(adults) || 2;
    const childrenNum = Number(children) || 0;

    // Base total in USD (adult full, children 50%)
    const baseTotal = calculateBookingTotal(
      pkg.priceFrom,
      adultsNum,
      childrenNum
    );

    // Apply promo (server-side validation)
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
    const depositAmount = finalTotal * 0.3;
    if (depositAmount <= 0) {
      return NextResponse.json(
        { error: "Booking total must be greater than zero." },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(depositAmount * 100);
    const origin = req.headers.get("origin") ?? baseUrl;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountInCents,
            product_data: {
              name: `Package: ${pkg.title}`,
              description: `Deposit for ${pkg.title} starting ${date} for ${adultsNum} adults and ${childrenNum} children.`,
            },
          },
        },
      ],
      customer_email: customerEmail,
      success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking/cancel`,
      metadata: {
        type: "package",
        packageSlug: slug,
        packageTitle: pkg.title,
        date,
        adults: String(adultsNum),
        children: String(childrenNum),
        promoCode: appliedPromoCode,
        baseTotalUSD: baseTotal.toFixed(2),
        discountUSD: discountAmount.toFixed(2),
        finalTotalUSD: finalTotal.toFixed(2),
        depositRate: "0.3",
        depositUSD: depositAmount.toFixed(2),
        customerName: customerName || "",
        customerEmail: customerEmail || "",
        customerPhone: customerPhone || "",
        notes: notes || "",
      },
    });

    // Fire-and-forget notification emails (do not block the response)
    if (customerEmail) {
      const summary: BookingSummary = {
        kind: "package",
        title: pkg.title,
        date,
        adults: adultsNum,
        children: childrenNum,
        customerName: customerName || "Guest",
        customerEmail,
        customerPhone: customerPhone || "",
        totalUSD: finalTotal,
        depositUSD: Number(depositAmount.toFixed(2)),
        balanceUSD: Number((finalTotal - depositAmount).toFixed(2)),
        promoCode: appliedPromoCode || "",
      };

      (async () => {
        try {
          await sendEmail({
            to: customerEmail,
            subject:
              "Your Zanzibar itinerary with Savana Blu – deposit payment link",
            html: bookingDepositCustomerEmail(summary),
          });

          await sendEmail({
            to: "hello@savanablu.com",
            subject: `New package booking started – ${pkg.title}`,
            html: bookingDepositOperatorEmail(summary),
          });
        } catch (err) {
          console.error("Package booking email error:", err);
        }
      })();
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Package checkout error:", err);
    return NextResponse.json(
      { error: "Unable to start payment session." },
      { status: 500 }
    );
  }
}
