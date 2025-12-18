import { NextResponse } from "next/server";
import { appendBooking, readBookings, writeBookings } from "@/lib/data/bookings";
import { getTourBySlug } from "@/lib/data/tours";
import { getPackageBySlug } from "@/lib/data/packages";
import { calculateBookingTotal } from "@/lib/booking/pricing";
import { findPromoByCode } from "@/lib/data/promos";
import { formatDateLabel } from "@/lib/utils/date";
import {
  sendBookingOnHoldToGuest,
  sendBookingOnHoldToAdmin,
} from "@/lib/email";
import { createZiinaPaymentIntent } from "@/lib/payments/ziina";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      type, // "tour" or "package"
      slug,
      date,
      adults,
      children,
      promoCode,
      customerName,
      customerEmail,
      customerPhone,
      notes,
    } = body;

    if (!type || !slug || !date || !adults || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const adultsNum = Number(adults) || (type === "package" ? 2 : 1);
    const childrenNum = Number(children) || 0;

    // Get tour or package
    const item = type === "tour" 
      ? await getTourBySlug(slug)
      : await getPackageBySlug(slug);

    if (!item) {
      return NextResponse.json(
        { error: `${type === "tour" ? "Tour" : "Package"} not found.` },
        { status: 404 }
      );
    }

    const experienceTitle = item.title;
    const basePrice = type === "tour" 
      ? (item as any).basePrice 
      : (item as any).priceFrom;

    // Calculate totals
    const baseTotal = calculateBookingTotal(basePrice, adultsNum, childrenNum);

    // Apply promo
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

    // Create booking ID
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Format date for display
    const dateLabel = formatDateLabel(date);

    // Map booking type to URL type parameter
    // "tour" -> "zanzibar-tour", "package" -> "safari"
    const urlType = type === "tour" ? "zanzibar-tour" : "safari";

    // Create and save booking (with dateLabel and type for redirect)
    const booking = {
      id: bookingId,
      type: urlType, // Store as "zanzibar-tour" or "safari" for URL consistency
      experienceSlug: slug,
      experienceTitle,
      date,
      dateLabel, // Human-readable date format
      adults: adultsNum,
      children: childrenNum,
      totalUSD: finalTotal,
      totalUsd: finalTotal, // Also include camelCase for consistency
      depositUSD: 0, // Will be paid via Ziina
      balanceUSD: finalTotal,
      promoCode: appliedPromoCode || undefined,
      customerName,
      customerEmail,
      customerPhone: customerPhone || "",
      notes: notes || "",
      status: "pending", // Pending payment
      createdAt: new Date().toISOString(),
      source: "website-booking",
    };

    await appendBooking(booking);

    // Parse notes to extract pickup details
    const notesLines = (notes || "").split("\n");
    let pickupLocation: string | null = null;
    let pickupTime: string | null = null;
    let airportPickup = false;
    let airportFlight: string | null = null;

    for (const line of notesLines) {
      if (line.startsWith("Pick-up location:")) {
        pickupLocation = line.replace("Pick-up location:", "").trim();
        if (pickupLocation === "Not provided") pickupLocation = null;
      } else if (line.startsWith("Pick-up time:")) {
        pickupTime = line.replace("Pick-up time:", "").trim();
        if (pickupTime === "Not provided") pickupTime = null;
      } else if (line.startsWith("Airport pick-up required:")) {
        airportPickup = line.includes("Yes");
      } else if (line.startsWith("Flight details:")) {
        const flightInfo = line.replace("Flight details:", "").trim();
        if (flightInfo && flightInfo !== "Not required (hotel/villa pick-up)" && flightInfo !== "Not provided") {
          airportFlight = flightInfo;
        }
      }
    }

    // Add parsed pickup details to booking object
    booking.pickupLocation = pickupLocation;
    booking.pickupTime = pickupTime;
    booking.airportPickup = airportPickup;
    booking.airportFlight = airportFlight;
    booking.guestName = customerName;
    booking.guestEmail = customerEmail;
    booking.guestPhone = customerPhone || "";

    // ...after booking is saved to bookings.json:

    // 1) Compute total & 20% advance in USD and AED
    const totalUsd: number | undefined =
      typeof booking.totalUsd === "number"
        ? booking.totalUsd
        : typeof booking.totalUSD === "number"
        ? booking.totalUSD
        : undefined;

    let depositUsd: number | undefined;
    let depositAed: number | undefined;

    const fxRateFromEnv = Number(
      process.env.NEXT_PUBLIC_ZIINA_USD_TO_AED_RATE ?? "3.7"
    );
    const fxRate =
      Number.isFinite(fxRateFromEnv) && fxRateFromEnv > 0 ? fxRateFromEnv : 3.7;

    if (typeof totalUsd === "number") {
      const rawDepositUsd = totalUsd * 0.2;
      depositUsd = Math.round(rawDepositUsd * 100) / 100;
      const rawDepositAed = depositUsd * fxRate;
      depositAed = Math.round(rawDepositAed * 100) / 100;
    }

    // 2) Create Ziina payment intent if we have a deposit amount
    let paymentLinkUrl: string | null = null;
    let ziinaPaymentIntentId: string | null = null;

    if (typeof depositAed === "number" && depositAed > 0) {
      try {
        console.log("[Ziina] Creating payment intent for booking:", {
          bookingId: booking.id,
          depositUsd,
        });
        
        const isTestMode = process.env.NODE_ENV !== "production";
        const { paymentIntentId, redirectUrl } = await createZiinaPaymentIntent({
          amountUsd: depositUsd,
          description:
            booking.experienceTitle ||
            "Savana Blu booking advance",
          successPath: `/booking/ziina/success?bookingId=${encodeURIComponent(
            booking.id
          )}`,
          cancelPath: `/booking/ziina/cancel?bookingId=${encodeURIComponent(
            booking.id
          )}`,
          test: isTestMode, // 🔹 set to false when you go live
        });

        ziinaPaymentIntentId = paymentIntentId;
        paymentLinkUrl = redirectUrl;

        console.log("[Ziina] Payment link created successfully:", {
          paymentIntentId,
          redirectUrl,
        });

        // 👉 Update the booking in-memory with these details
        booking.ziinaPaymentIntentId = ziinaPaymentIntentId;
        booking.paymentLinkUrl = paymentLinkUrl;

        // And persist back to bookings.json
        const allBookings = await readBookings();
        const updatedBookings = allBookings.map((b) =>
          b.id === booking.id ? booking : b
        );
        await writeBookings(updatedBookings);
      } catch (err) {
        console.error("[Ziina] Failed to create payment link for booking", err);
        console.error("[Ziina] Error details:", {
          bookingId: booking.id,
          depositAed,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    } else {
      console.log("[Ziina] Skipping payment link creation - no valid deposit amount:", {
        depositAed,
        depositUsd,
      });
    }

    // 3) Build the email payload (including the link if we have one)
    const emailPayload = {
      id: booking.id,
      experienceTitle:
        booking.experienceTitle ||
        booking.title ||
        booking.tourTitle ||
        booking.packageTitle,
      type: booking.type,
      dateLabel: booking.dateLabel || booking.preferredDate || booking.date,
      guestName: booking.guestName || booking.customerName || booking.name,
      guestEmail: booking.guestEmail || booking.customerEmail || booking.email,
      guestPhone: booking.guestPhone || booking.customerPhone || booking.phone,
      adults: booking.adults,
      children: booking.children,
      totalUsd,
      depositUsd,
      depositAed,
      promoCode: booking.promoCode || booking.promo || null,
      pickupLocation: booking.pickupLocation || null,
      pickupTime: booking.pickupTime || null,
      airportPickup: booking.airportPickup || false,
      airportFlight: booking.airportFlight || null,
      paymentLinkUrl, // 🔹 here
      notes: booking.notes || null,
    };

    console.log("[Email] Email payload prepared:", {
      guestEmail: emailPayload.guestEmail,
      guestName: emailPayload.guestName,
      bookingId: emailPayload.id,
      hasPaymentLink: !!emailPayload.paymentLinkUrl,
      paymentLinkUrl: emailPayload.paymentLinkUrl,
      emailValid: emailPayload.guestEmail && emailPayload.guestEmail.includes("@"),
    });

    // 4) Send on-hold emails (guest + admin)
    //    Fire-and-forget – we don't block the API response on email success
    (async () => {
      try {
        if (!emailPayload.guestEmail) {
          console.error("[Email] No guest email address in payload:", emailPayload);
          return;
        }
        console.log("[Email] Sending on-hold email to guest:", emailPayload.guestEmail);
        await sendBookingOnHoldToGuest(emailPayload);
        console.log("[Email] Guest email sent successfully to:", emailPayload.guestEmail);
      } catch (err) {
        console.error("[Email] on-hold guest error:", err);
        console.error("[Email] Error details:", {
          guestEmail: emailPayload.guestEmail,
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });
      }
    })();
    
    (async () => {
      try {
        console.log("[Email] Sending on-hold email to admin");
        await sendBookingOnHoldToAdmin(emailPayload);
        console.log("[Email] Admin email sent successfully");
      } catch (err) {
        console.error("[Email] on-hold admin error:", err);
        console.error("[Email] Error details:", {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });
      }
    })();

    // Build redirect URL using the same pattern as shown
    const searchParams = new URLSearchParams({
      bookingId: booking.id,
      experienceTitle: booking.experienceTitle,
      totalUsd: String(booking.totalUsd),
      date: booking.dateLabel,
      type: booking.type,
    });

    const redirectUrl = `/booking/success?${searchParams.toString()}`;

    // Check if client wants JSON response (for client-side fetch)
    const url = new URL(req.url);
    const returnJson = url.searchParams.get("returnJson") === "true" || 
                       req.headers.get("accept")?.includes("application/json");

    if (returnJson) {
      // Return JSON for client-side navigation
      return NextResponse.json({ redirectUrl, bookingId });
    }

    // Server-side redirect
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  } catch (err) {
    console.error("Booking creation error:", err);
    return NextResponse.json(
      { error: "Unable to create booking. Please try again." },
      { status: 500 }
    );
  }
}

