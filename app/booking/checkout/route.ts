import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getTourBySlug } from "@/lib/data/tours";
import { calculateBookingTotal } from "@/lib/booking/pricing";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn(
    "[Stripe] STRIPE_SECRET_KEY is not set. Checkout will not function until configured."
  );
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2024-06-20",
    })
  : null;

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.redirect(
      "mailto:hello@savanablu.com?subject=Booking%20enquiry%20-%20payment%20offline&body=Our%20online%20payment%20is%20not%20yet%20configured.%20Please%20share%20your%20preferred%20tour%20and%20dates.",
      303
    );
  }

  const formData = await request.formData();

  const tourSlug = (formData.get("tourSlug") ?? "").toString();
  const date = (formData.get("date") ?? "").toString();
  const adults = parseInt((formData.get("adults") ?? "0").toString(), 10) || 0;
  const children =
    parseInt((formData.get("children") ?? "0").toString(), 10) || 0;
  const name = (formData.get("name") ?? "").toString().trim();
  const email = (formData.get("email") ?? "").toString().trim();
  const phone = (formData.get("phone") ?? "").toString().trim();
  const notes = (formData.get("notes") ?? "").toString().trim();

  const origin = request.headers.get("origin") ?? "http://localhost:3000";

  if (!tourSlug || !date || !name || !email || adults <= 0) {
    return NextResponse.redirect(`${origin}/zanzibar-tours/${tourSlug}`, 303);
  }

  const tour = await getTourBySlug(tourSlug);
  if (!tour) {
    return NextResponse.redirect(`${origin}/zanzibar-tours`, 303);
  }

  const { total, currency } = calculateBookingTotal({
    tour,
    adults,
    children,
  });

  if (total <= 0) {
    return NextResponse.redirect(`${origin}/zanzibar-tours/${tourSlug}`, 303);
  }

  const amountInMinor = Math.round(total * 100);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/booking/cancel`,
    customer_email: email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: amountInMinor,
          product_data: {
            name: `Savana Blu – ${tour.title}`,
            description: `Tour date: ${date} · Adults: ${adults} · Children: ${children}`,
          },
        },
      },
    ],
    metadata: {
      tourSlug: tour.slug,
      tourTitle: tour.title,
      date,
      adults: String(adults),
      children: String(children),
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      notes,
    },
  });

  return NextResponse.redirect(
    session.url ?? `${origin}/zanzibar-tours/${tourSlug}`,
    303
  );
}
