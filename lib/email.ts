const RESEND_API_KEY = process.env.RESEND_API_KEY;

const DEFAULT_FROM = "Savana Blu <hello@savanablu.com>";
const FROM_EMAIL = "Savana Blu <hello@savanablu.com>";
const ADMIN_EMAIL = "hello@savanablu.com";

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  cc?: string[];
  bcc?: string[];
};

/**
 * Minimal wrapper around Resend.
 * If RESEND_API_KEY is not set, this logs to the server console instead.
 */
export async function sendEmail({
  to,
  subject,
  html,
  from,
  cc,
  bcc,
}: SendEmailOptions) {
  if (!RESEND_API_KEY) {
    const errorMsg = "[Email] RESEND_API_KEY not configured. Email would be sent to:";
    console.error(errorMsg, {
      to,
      subject,
      from: from ?? DEFAULT_FROM,
    });
    console.error("[Email] CRITICAL: No actual email will be sent! Add RESEND_API_KEY to environment variables.");
    // In production, throw an error so it's visible in logs
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not configured. Cannot send emails.");
    }
    return { ok: false, stub: true, error: "RESEND_API_KEY not configured" };
  }

  // Validate email address
  const emailToCheck = Array.isArray(to) ? to[0] : to;
  if (!emailToCheck || !emailToCheck.includes("@")) {
    console.error("[Email] Invalid email address:", to);
    throw new Error(`Invalid email address: ${to}`);
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: from ?? DEFAULT_FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        cc,
        bcc,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Resend API error:", {
        status: response.status,
        statusText: response.statusText,
        body: text,
      });
      throw new Error(`Resend API error (${response.status}): ${text}`);
    }

    const result = await response.json();
    console.log("Email sent via Resend:", {
      id: result.id,
      to: Array.isArray(to) ? to : [to],
    });
    return result;
  } catch (err: any) {
    console.error("Email sending error:", {
      error: err?.message,
      stack: err?.stack,
      to: Array.isArray(to) ? to : [to],
    });
    throw err;
  }
}

type BookingKind = "tour" | "package";

export type BookingSummary = {
  kind: BookingKind;
  title: string;
  date: string;
  adults: number;
  children: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalUSD: number;
  depositUSD: number;
  balanceUSD: number;
  promoCode?: string;
};

export type EnquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  preferredTour?: string;
  dates?: string;
  accommodation?: string;
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatMoney(value: number): string {
  return `USD ${value.toFixed(2)}`;
}

/* ---------- Enquiry emails ---------- */

export function enquiryCustomerEmail(payload: EnquiryPayload): string {
  const { name } = payload;
  
  // Use production URL for logo (emails can't access localhost)
  // In production, set NEXT_PUBLIC_APP_URL to your domain (e.g., https://savanablu.com)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://savanablu.com";
  const logoUrl = `${appUrl}/images/logo-footer.png`;

  return `
  <div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;color:#0f172a;line-height:1.6;">
    <p style="margin:0 0 16px 0;">Hi ${escapeHtml(name || "there")},</p>
    
    <p style="margin:0 0 16px 0;">Thank you for reaching out to Savana Blu Luxury Expeditions.</p>
    
    <p style="margin:0 0 16px 0;">Our team in Zanzibar has received your note and will reply at the earliest convenience.</p>
    
    <p style="margin:0 0 16px 0;">If your enquiry is time-sensitive or for travel within the next 48 hours, you can also send us a WhatsApp on <strong>+255 678 439 529</strong> with your name and dates and we will revert quickly.</p>
    
    <p style="margin:24px 0 8px 0;">Warm regards,</p>
    
    <p style="margin:0 0 24px 0;">Savana Blu Luxury Expeditions<br/>Sogea, Zanzibar, Tanzania</p>
    
    <p style="margin:24px 0 0 0;">
      <img src="${logoUrl}" alt="Savana Blu Luxury Expeditions" style="max-width:150px;height:auto;display:block;" />
    </p>
  </div>
  `;
}

export function enquiryOperatorEmail(payload: EnquiryPayload): string {
  const { name, email, phone, message, preferredTour, dates, accommodation } = payload;

  return `
  <div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;color:#0f172a;line-height:1.6;">
    <p><strong>New website enquiry</strong></p>
    <p><strong>Name:</strong> ${escapeHtml(name)}<br/>
       <strong>Email:</strong> ${escapeHtml(email)}<br/>
       <strong>Phone:</strong> ${escapeHtml(phone || "-")}<br/>
       <strong>Preferred tour:</strong> ${escapeHtml(preferredTour || "-")}<br/>
       <strong>Travel dates:</strong> ${escapeHtml(dates || "-")}<br/>
       <strong>Accommodation:</strong> ${escapeHtml(accommodation || "-")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    <p style="font-size:12px;color:#64748b;">Source: Website contact form</p>
  </div>
  `;
}

/* ---------- Booking deposit emails ---------- */

export function bookingDepositCustomerEmail(summary: BookingSummary): string {
  const kindLabel =
    summary.kind === "package" ? "multi-day itinerary" : "day tour";

  return `
  <div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;color:#0f172a;line-height:1.6;">
    <p>Hi ${escapeHtml(summary.customerName || "there")},</p>
    <p>Thank you for choosing Savana Blu Luxury Expeditions.</p>
    <p>We've received your details for the following ${kindLabel} and opened a secure card payment page in your browser to collect your deposit:</p>
    <ul>
      <li><strong>Experience:</strong> ${escapeHtml(summary.title)}</li>
      <li><strong>Date:</strong> ${escapeHtml(summary.date)}</li>
      <li><strong>Guests:</strong> ${summary.adults} adult(s)${
    summary.children ? `, ${summary.children} child(ren)` : ""
  }</li>
      <li><strong>Trip value:</strong> ${formatMoney(summary.totalUSD)}</li>
      <li><strong>Amount to pay now:</strong> ${formatMoney(
        summary.depositUSD
      )}</li>
      <li><strong>Estimated balance in Zanzibar:</strong> ${formatMoney(
        summary.balanceUSD
      )}</li>
    </ul>
    ${
      summary.promoCode
        ? `<p><strong>Promo code applied:</strong> ${escapeHtml(
            summary.promoCode
          )}</p>`
        : ""
    }
    <p>If you close the payment window by mistake, just reply to this email and we'll send you a fresh payment link.</p>
    <p>Kindly note that if you cancel your trip, the 20% advance payment is <strong>non-refundable</strong>, as our team and services in Zanzibar will already be reserved for you.</p>
    <p>Warm regards,<br/>Savana Blu Luxury Expeditions<br/>Zanzibar · East Africa Time (GMT+3)</p>
  </div>
  `;
}

export function bookingDepositOperatorEmail(summary: BookingSummary): string {
  const kindLabel =
    summary.kind === "package" ? "PACKAGE" : "TOUR";

  return `
  <div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;color:#0f172a;line-height:1.6;">
    <p><strong>New ${kindLabel} booking started (deposit checkout created)</strong></p>
    <p>
      <strong>Experience:</strong> ${escapeHtml(summary.title)}<br/>
      <strong>Date:</strong> ${escapeHtml(summary.date)}<br/>
      <strong>Guests:</strong> ${summary.adults} adult(s)${
    summary.children ? `, ${summary.children} child(ren)` : ""
  }<br/>
      <strong>Total:</strong> ${formatMoney(summary.totalUSD)}<br/>
      <strong>Advance (if paid):</strong> ${formatMoney(
        summary.depositUSD
      )}<br/>
      <strong>Balance:</strong> ${formatMoney(summary.balanceUSD)}<br/>
      <strong>Promo:</strong> ${summary.promoCode || "-"}
    </p>
    <p>
      <strong>Name:</strong> ${escapeHtml(summary.customerName)}<br/>
      <strong>Email:</strong> ${escapeHtml(summary.customerEmail)}<br/>
      <strong>Phone:</strong> ${escapeHtml(summary.customerPhone || "-")}
    </p>
    <p style="font-size:12px;color:#64748b;">Source: Website booking</p>
  </div>
  `;
}

/* ---------- Reminders & review requests ---------- */

export type ReminderPayload = {
  kind: BookingKind;
  title: string;
  date: string;
  customerName: string;
  pickupLocation?: string;
  pickupTime?: string;
  airportPickup?: boolean;
  flightDetails?: string;
};

export function tourReminderCustomerEmail(payload: ReminderPayload): string {
  const kindLabel =
    payload.kind === "package" ? "itinerary" : "day tour";

  return `
  <div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;color:#0f172a;line-height:1.6;">
    <p>Hi ${escapeHtml(payload.customerName || "there")},</p>
    <p>Just a quick note from Savana Blu to remind you about your ${
      kindLabel
    } tomorrow:</p>
    <ul>
      <li><strong>Experience:</strong> ${escapeHtml(payload.title)}</li>
      <li><strong>Date:</strong> ${escapeHtml(payload.date)}</li>
    </ul>
    <p>If any of your plans have changed, please reply to this email or send us a WhatsApp as soon as possible so we can adjust on our side.</p>
    <p>We look forward to welcoming you in Zanzibar.</p>
    <p>Warm regards,<br/>Savana Blu Luxury Expeditions</p>
  </div>
  `;
}

export function reviewRequestCustomerEmail(
  payload: ReminderPayload
): string {
  const kindLabel =
    payload.kind === "package" ? "trip" : "day tour";

  return `
  <div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;color:#0f172a;line-height:1.6;">
    <p>Hi ${escapeHtml(payload.customerName || "there")},</p>
    <p>We hope you enjoyed your ${kindLabel} with Savana Blu:</p>
    <p><strong>${escapeHtml(payload.title)}</strong></p>
    <p>If you have a quiet moment, we would be very grateful for a short review or a few lines about your experience. It helps a locally based operator like us a great deal.</p>
    <p>You can simply reply to this email with your thoughts, or share a review on your preferred platform.</p>
    <p>Warm regards,<br/>Savana Blu Luxury Expeditions</p>
  </div>
  `;
}

/* ---------- New booking email functions (on hold / confirmed) ---------- */

type BookingEmailPayload = {
  id?: string;
  experienceTitle?: string;
  type?: "zanzibar-tour" | "safari" | string;
  dateLabel?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  adults?: number;
  children?: number;
  totalUsd?: number;
  depositUsd?: number;
  depositAed?: number;
  promoCode?: string | null;
  pickupLocation?: string | null;
  pickupTime?: string | null;
  airportPickup?: boolean;
  airportFlight?: string | null;
  paymentLinkUrl?: string | null;
  notes?: string | null;
};

function safe(value: unknown, fallback = "—"): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  return String(value);
}

export async function sendBookingOnHoldToGuest(
  booking: BookingEmailPayload
): Promise<void> {
  if (!booking.guestEmail) {
    console.error("[Email] sendBookingOnHoldToGuest: No guestEmail provided in booking payload:", {
      bookingId: booking.id,
      guestName: booking.guestName,
      hasEmail: !!booking.guestEmail,
    });
    return;
  }
  
  console.log("[Email] sendBookingOnHoldToGuest: Preparing email for:", booking.guestEmail);

  const typeLabel =
    booking.type === "safari"
      ? "safari from Zanzibar"
      : "Zanzibar tour or coastal experience";

  const subject = `Your Savana Blu booking is on hold – ${safe(
    booking.experienceTitle
  )}`;

  // Logo URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://savanablu.com";
  const logoUrl = `${appUrl}/images/logo-footer.png`;

  const html = `
  <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a; padding: 24px; background:#f8fafc;">

    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;padding:24px 24px 28px;border:1px solid #e2e8f0;">

      ${logoUrl ? `<div style="text-align:center;margin:0 0 24px;">
        <img src="${logoUrl}" alt="Savana Blu Luxury Expeditions" style="max-width:150px;height:auto;display:inline-block;" />
      </div>` : ''}

      <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#64748b;margin:0 0 12px;">Savana Blu · Booking received</p>

      <h1 style="font-size:20px;margin:0 0 12px;">Your booking is on hold</h1>

      <p style="font-size:14px;line-height:1.6;margin:0 0 12px;">

        Dear ${safe(booking.guestName, "guest")},

      </p>

      <p style="font-size:14px;line-height:1.6;margin:0 0 8px;">

        Thank you for choosing Savana Blu. We've received your request for:

      </p>

      <p style="font-size:15px;line-height:1.6;margin:0 0 4px;font-weight:600;">

        ${safe(booking.experienceTitle)}

      </p>

      ${
        booking.dateLabel
          ? `<p style="font-size:13px;line-height:1.6;margin:0 0 8px;color:#475569;">

               Preferred date: <strong>${booking.dateLabel}</strong>

             </p>`
          : ""
      }

      <p style="font-size:14px;line-height:1.6;margin:12px 0 8px;">

        Your ${typeLabel} is currently <strong>on hold</strong> and will be fully confirmed once we receive a 20% advance payment.

      </p>



      ${
        booking.totalUsd
          ? `<p style="font-size:14px;line-height:1.6;margin:8px 0;">

               Estimated total for your party: <strong>USD ${booking.totalUsd.toFixed(
                 2
               )}</strong>

             </p>`
          : ""
      }



      ${
        booking.depositUsd
          ? `<p style="font-size:13px;line-height:1.6;margin:8px 0 12px;color:#475569;">

               20% advance amount: <strong>USD ${booking.depositUsd.toFixed(2)}</strong>.

             </p>`
          : ""
      }

      ${
        booking.paymentLinkUrl
          ? `<div style="margin:20px 0;padding:16px;background:#f0fdfa;border:2px solid #14b8a6;border-radius:12px;text-align:center;">

               <p style="font-size:13px;line-height:1.6;margin:0 0 12px;color:#0f766e;font-weight:600;">

                 To confirm your booking, pay the 20% advance now:

               </p>

               <a href="${booking.paymentLinkUrl}" style="display:inline-block;padding:12px 24px;background:#14b8a6;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;margin:8px 0;">

                 Pay 20% advance via Ziina

               </a>

               <p style="font-size:11px;line-height:1.6;margin:8px 0 0;color:#64748b;">

                 The amount will be processed securely online, and we keep an internal record in USD.

               </p>

             </div>`
          : ""
      }

      <p style="font-size:13px;line-height:1.6;margin:12px 0 8px;color:#475569;">

        ${booking.paymentLinkUrl 
          ? "The remaining balance is paid in Zanzibar on the day of your experience."
          : "You can use the secure payment link provided on the website (or any follow-up message from us) to pay the 20% online. The remaining balance is paid in Zanzibar on the day of your experience."
        }

      </p>



      <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;" />



      <p style="font-size:12px;line-height:1.6;margin:0 0 8px;color:#64748b;">

        If you need to adjust your date, pick-up time or hotel details, simply reply to this email or contact us on WhatsApp. We'll do our best to accommodate changes around tides, flights and availability. However, if you cancel your trip, the 20% advance payment is non-refundable as we've already committed guides, boats and vehicles in advance.

      </p>



      <p style="font-size:12px;line-height:1.6;margin:0 0 4px;color:#64748b;">

        With warm regards from Zanzibar,

      </p>

      <p style="font-size:12px;line-height:1.6;margin:0;color:#64748b;">

        Savana Blu Luxury Expeditions

      </p>

    </div>

  </div>

  `;

  console.log("[Email] sendBookingOnHoldToGuest: Calling sendEmail with:", {
    to: booking.guestEmail,
    subject,
    hasHtml: !!html,
    htmlLength: html?.length || 0,
  });

  try {
    const result = await sendEmail({
      to: booking.guestEmail,
      subject,
      html,
    });
    console.log("[Email] sendBookingOnHoldToGuest: Email sent successfully:", {
      to: booking.guestEmail,
      resultId: result?.id,
    });
  } catch (err) {
    console.error("[Email] sendBookingOnHoldToGuest: Failed to send email:", {
      to: booking.guestEmail,
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}

export async function sendBookingOnHoldToAdmin(
  booking: BookingEmailPayload
): Promise<void> {
  const subject = `New booking on hold – ${safe(booking.experienceTitle)}`;

  // Logo URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://savanablu.com";
  const logoUrl = `${appUrl}/images/logo-footer.png`;

  const html = `
  <div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;padding:16px;background:#f8fafc;">

    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;padding:16px 20px;border:1px solid #e2e8f0;">

      ${logoUrl ? `<div style="text-align:center;margin:0 0 16px;">
        <img src="${logoUrl}" alt="Savana Blu Luxury Expeditions" style="max-width:150px;height:auto;display:inline-block;" />
      </div>` : ''}

      <h2 style="font-size:16px;margin:0 0 8px;">New booking on hold</h2>

      <p style="font-size:13px;margin:0 0 12px;">

        A new booking has been received and is currently <strong>on hold</strong> pending 20% advance payment.

      </p>

      <ul style="font-size:13px;line-height:1.6;margin:0 0 8px;padding-left:20px;">

        <li>Reference: ${safe(booking.id)}</li>

        <li>Experience: ${safe(booking.experienceTitle)}</li>

        <li>Type: ${safe(booking.type)}</li>

        <li>Date: ${safe(booking.dateLabel)}</li>

        <li>Guest: ${safe(booking.guestName)} (${safe(
    booking.guestEmail
  )}, ${safe(booking.guestPhone)})</li>

        <li>Party: ${safe(booking.adults, "0")} adults, ${safe(
    booking.children,
    "0"
  )} children</li>

        <li>Total (USD): ${
          booking.totalUsd ? booking.totalUsd.toFixed(2) : "—"
        }</li>

        <li>20% advance: ${
          booking.depositUsd
            ? `USD ${booking.depositUsd.toFixed(2)}`
            : "not calculated"
        }</li>

        <li>Pickup: ${safe(booking.pickupLocation)} at ${safe(
    booking.pickupTime
  )}</li>

        <li>Airport pickup: ${
          booking.airportPickup ? "Yes" : "No"
        } · Flight: ${safe(booking.airportFlight)}</li>

        <li>Promo code: ${safe(booking.promoCode)}</li>

        ${booking.notes
          ? `<li>Notes: ${safe(booking.notes)}</li>`
          : ''}

      </ul>

    </div>

  </div>

  `;

  await sendEmail({
    to: ADMIN_EMAIL,
    subject,
    html,
  });
}

export async function sendBookingConfirmedToGuest(
  booking: BookingEmailPayload
): Promise<void> {
  if (!booking.guestEmail) {
    console.error("[Email] sendBookingConfirmedToGuest: No guestEmail provided:", booking);
    return;
  }

  console.log("[Email] sendBookingConfirmedToGuest: Preparing email for:", booking.guestEmail);

  const typeLabel =
    booking.type === "safari"
      ? "safari from Zanzibar"
      : "Zanzibar tour or coastal experience";

  const subject = `Your Savana Blu booking is confirmed – ${safe(
    booking.experienceTitle
  )}`;

  // Logo URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://savanablu.com";
  const logoUrl = `${appUrl}/images/logo-footer.png`;

  // Calculate balance
  const balanceUsd = booking.totalUsd && booking.depositUsd
    ? booking.totalUsd - booking.depositUsd
    : null;

  const html = `
  <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a; padding: 24px; background:#f8fafc;">

    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;padding:24px 24px 28px;border:1px solid #e2e8f0;">

      ${logoUrl ? `<div style="text-align:center;margin:0 0 24px;">
        <img src="${logoUrl}" alt="Savana Blu Luxury Expeditions" style="max-width:150px;height:auto;display:inline-block;" />
      </div>` : ''}

      <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#64748b;margin:0 0 12px;">Savana Blu · Booking confirmed</p>

      <h1 style="font-size:20px;margin:0 0 12px;">Your booking is confirmed</h1>

      <p style="font-size:14px;line-height:1.6;margin:0 0 12px;">

        Dear ${safe(booking.guestName, "guest")},

      </p>

      <p style="font-size:14px;line-height:1.6;margin:0 0 8px;">

        Thank you – we've received your 20% advance and your ${typeLabel} is now <strong>fully confirmed</strong>.

      </p>

      <div style="background:#f8fafc;border-radius:12px;padding:16px;margin:16px 0;border:1px solid #e2e8f0;">

        <h2 style="font-size:16px;margin:0 0 12px;font-weight:600;">Booking Details</h2>

        <p style="font-size:15px;line-height:1.6;margin:0 0 8px;font-weight:600;color:#0f172a;">
          ${safe(booking.experienceTitle)}
        </p>

        <ul style="font-size:13px;line-height:1.8;margin:0;padding-left:20px;color:#475569;">

          ${booking.dateLabel ? `<li><strong>Date:</strong> ${booking.dateLabel}</li>` : ''}

          ${booking.adults !== undefined || booking.children !== undefined
            ? `<li><strong>Party:</strong> ${booking.adults || 0} adult${(booking.adults || 0) !== 1 ? 's' : ''}${booking.children ? `, ${booking.children} child${booking.children !== 1 ? 'ren' : ''}` : ''}</li>`
            : ''}

          ${booking.totalUsd
            ? `<li><strong>Total:</strong> USD ${booking.totalUsd.toFixed(2)}</li>`
            : ''}

          ${booking.depositUsd
            ? `<li><strong>20% Advance Paid:</strong> USD ${booking.depositUsd.toFixed(2)}</li>`
            : ''}

          ${balanceUsd
            ? `<li><strong>Balance Due in Zanzibar:</strong> USD ${balanceUsd.toFixed(2)}</li>`
            : ''}

          ${booking.promoCode
            ? `<li><strong>Promo Code Applied:</strong> ${safe(booking.promoCode)}</li>`
            : ''}

          ${booking.pickupLocation
            ? `<li><strong>Pick-up Location:</strong> ${safe(booking.pickupLocation)}</li>`
            : ''}

          ${booking.pickupTime
            ? `<li><strong>Pick-up Time:</strong> ${safe(booking.pickupTime)}</li>`
            : ''}

          ${booking.airportPickup
            ? `<li><strong>Airport Pick-up:</strong> Yes${booking.airportFlight ? ` (${safe(booking.airportFlight)})` : ''}</li>`
            : ''}

          ${booking.notes
            ? `<li><strong>Notes:</strong> ${safe(booking.notes)}</li>`
            : ''}

        </ul>

      </div>

      <p style="font-size:13px;line-height:1.6;margin:16px 0 8px;color:#475569;">

        On the day of your experience, you'll pay the remaining balance in Zanzibar. We'll contact you if we need to refine the pick-up time or location based on tides, traffic or flight timings.

      </p>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;" />

      <p style="font-size:12px;line-height:1.6;margin:0 0 8px;color:#64748b;">

        If you have any questions, simply reply to this email or reach out on WhatsApp at <strong>+255 678 439 529</strong>. We're here to help you keep the trip feeling calm and unhurried.

      </p>

      <p style="font-size:12px;line-height:1.6;margin:16px 0 4px;color:#64748b;">

        With warm regards from Zanzibar,

      </p>

      <p style="font-size:12px;line-height:1.6;margin:0 0 16px;color:#64748b;">

        Savana Blu Luxury Expeditions<br/>Sogea, Zanzibar, Tanzania

      </p>

    </div>

  </div>

  `;

  console.log("[Email] sendBookingConfirmedToGuest: Calling sendEmail with:", {
    to: booking.guestEmail,
    subject,
    hasHtml: !!html,
  });

  try {
    const result = await sendEmail({
      to: booking.guestEmail,
      subject,
      html,
    });
    console.log("[Email] sendBookingConfirmedToGuest: Email sent successfully:", {
      to: booking.guestEmail,
      resultId: result?.id,
    });
  } catch (err) {
    console.error("[Email] sendBookingConfirmedToGuest: Failed to send email:", {
      to: booking.guestEmail,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw err; // Re-throw so caller can handle
  }
}

export async function sendBookingConfirmedToAdmin(
  booking: BookingEmailPayload
): Promise<void> {
  console.log("[Email] sendBookingConfirmedToAdmin: Preparing email for admin");

  const subject = `Booking confirmed – ${safe(booking.experienceTitle)}`;

  // Logo URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://savanablu.com";
  const logoUrl = `${appUrl}/images/logo-footer.png`;

  // Calculate balance
  const balanceUsd = booking.totalUsd && booking.depositUsd
    ? booking.totalUsd - booking.depositUsd
    : null;

  const html = `
  <div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;padding:16px;background:#f8fafc;">

    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;padding:16px 20px;border:1px solid #e2e8f0;">

      ${logoUrl ? `<div style="text-align:center;margin:0 0 16px;">
        <img src="${logoUrl}" alt="Savana Blu Luxury Expeditions" style="max-width:150px;height:auto;display:inline-block;" />
      </div>` : ''}

      <h2 style="font-size:16px;margin:0 0 8px;">Booking confirmed (20% paid)</h2>

      <p style="font-size:13px;margin:0 0 12px;">

        The guest has completed the 20% advance via Ziina. Booking is now confirmed.

      </p>

      <div style="background:#f8fafc;border-radius:12px;padding:16px;margin:12px 0;border:1px solid #e2e8f0;">

        <h3 style="font-size:14px;margin:0 0 12px;font-weight:600;">Booking Details</h3>

        <ul style="font-size:13px;line-height:1.8;margin:0;padding-left:20px;color:#475569;">

          <li><strong>Experience:</strong> ${safe(booking.experienceTitle)}</li>

          <li><strong>Type:</strong> ${safe(booking.type)}</li>

          <li><strong>Date:</strong> ${safe(booking.dateLabel)}</li>

          <li><strong>Guest Name:</strong> ${safe(booking.guestName)}</li>

          <li><strong>Email:</strong> ${safe(booking.guestEmail)}</li>

          <li><strong>Phone:</strong> ${safe(booking.guestPhone)}</li>

          ${booking.adults !== undefined || booking.children !== undefined
            ? `<li><strong>Party:</strong> ${booking.adults || 0} adult${(booking.adults || 0) !== 1 ? 's' : ''}${booking.children ? `, ${booking.children} child${booking.children !== 1 ? 'ren' : ''}` : ''}</li>`
            : ''}

          <li><strong>Total (USD):</strong> ${
            booking.totalUsd ? booking.totalUsd.toFixed(2) : "—"
          }</li>

          <li><strong>20% Advance Received:</strong> ${
            booking.depositUsd
              ? `USD ${booking.depositUsd.toFixed(2)}`
              : "amount not available"
          }</li>

          ${balanceUsd
            ? `<li><strong>Balance Due:</strong> USD ${balanceUsd.toFixed(2)}</li>`
            : ''}

          ${booking.promoCode
            ? `<li><strong>Promo Code:</strong> ${safe(booking.promoCode)}</li>`
            : ''}

          ${booking.pickupLocation
            ? `<li><strong>Pick-up Location:</strong> ${safe(booking.pickupLocation)}</li>`
            : ''}

          ${booking.pickupTime
            ? `<li><strong>Pick-up Time:</strong> ${safe(booking.pickupTime)}</li>`
            : ''}

          ${booking.airportPickup
            ? `<li><strong>Airport Pick-up:</strong> Yes${booking.airportFlight ? ` (${safe(booking.airportFlight)})` : ''}</li>`
            : ''}

          ${booking.notes
            ? `<li><strong>Notes:</strong> ${safe(booking.notes)}</li>`
            : ''}

        </ul>

      </div>

    </div>

  </div>

  `;

  console.log("[Email] sendBookingConfirmedToAdmin: Calling sendEmail with:", {
    to: ADMIN_EMAIL,
    subject,
    hasHtml: !!html,
  });

  try {
    const result = await sendEmail({
      to: ADMIN_EMAIL,
      subject,
      html,
    });
    console.log("[Email] sendBookingConfirmedToAdmin: Email sent successfully:", {
      to: ADMIN_EMAIL,
      resultId: result?.id,
    });
  } catch (err) {
    console.error("[Email] sendBookingConfirmedToAdmin: Failed to send email:", {
      to: ADMIN_EMAIL,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw err; // Re-throw so caller can handle
  }
}
