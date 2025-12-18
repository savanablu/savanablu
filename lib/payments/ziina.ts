// lib/payments/ziina.ts

import "server-only";

const ZIINA_API_BASE =
  process.env.ZIINA_API_BASE ?? "https://api-v2.ziina.com/api";
const ZIINA_API_KEY = process.env.ZIINA_API_KEY;

if (!ZIINA_API_KEY) {
  console.warn(
    "[Ziina] ZIINA_API_KEY is not set. Payment intent creation will fail."
  );
}

type CreatePaymentIntentOptions = {
  amountUsd: number;
  description: string;
  successPath: string;
  cancelPath: string;
  test?: boolean;
};

type ZiinaPaymentIntentResponse = {
  id: string;
  redirect_url: string;
  status: string;
};

export async function createZiinaPaymentIntent({
  amountUsd,
  description,
  successPath,
  cancelPath,
  test = true,
}: CreatePaymentIntentOptions): Promise<{
  paymentIntentId: string;
  redirectUrl: string;
}> {
  if (!ZIINA_API_KEY) {
    throw new Error("ZIINA_API_KEY is not configured");
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Ziina expects amount in cents for USD: 1 USD = 100 cents
  const amountCents = Math.round(amountUsd * 100);

  // Ensure minimum amount (Ziina might have a minimum)
  if (amountCents < 100) {
    throw new Error("Amount too small. Minimum is 1 USD (100 cents)");
  }

  // Construct logo URL (must be publicly accessible)
  // Use production domain if available, otherwise use baseUrl
  const productionUrl = process.env.NEXT_PUBLIC_APP_URL?.includes('localhost') 
    ? 'https://savanablu.com' 
    : (process.env.NEXT_PUBLIC_APP_URL || baseUrl);
  const logoUrl = `${productionUrl}/images/logo-header.png`;

  // Website brand colors
  const brandColors = {
    primary: "#0F6F7C",      // lagoon (turquoise)
    secondary: "#0B3C49",    // ocean (deep)
    background: "#F9F3EB",   // shell (light)
    accent: "#F9735B",       // coral (sunset)
    text: "#111827",         // ink (dark)
  };

  const payload: any = {
    amount: amountCents,
    currency_code: "USD",
    success_url: `${baseUrl}${successPath}`,
    cancel_url: `${baseUrl}${cancelPath}`,
    description,
    merchant_name: "Savana Blu Luxury Expeditions",
    logo_url: logoUrl,
    // Alternative field names that some APIs use
    business_name: "Savana Blu Luxury Expeditions",
    image_url: logoUrl,
    // Theme/color customization (may not be supported by Ziina API)
    theme_color: brandColors.primary,
    primary_color: brandColors.primary,
    secondary_color: brandColors.secondary,
    background_color: brandColors.background,
    accent_color: brandColors.accent,
    text_color: brandColors.text,
    // Alternative naming conventions
    color_primary: brandColors.primary,
    color_background: brandColors.background,
    color_accent: brandColors.accent,
  };

  // Only include test if it's true (some APIs don't accept false)
  if (test) {
    payload.test = true;
  }

  console.log("[Ziina] Request payload:", JSON.stringify(payload, null, 2));
  console.log("[Ziina] API endpoint:", `${ZIINA_API_BASE}/payment_intent`);

  const res = await fetch(`${ZIINA_API_BASE}/payment_intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ZIINA_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorBody: string;
    try {
      errorBody = await res.text();
    } catch {
      errorBody = "Could not read error response";
    }
    
    console.error(
      "[Ziina] Failed to create payment intent",
      {
        status: res.status,
        statusText: res.statusText,
        body: errorBody,
        payload,
      }
    );
    
    // Try to parse error message from response
    let errorMessage = `Ziina payment_intent error: ${res.status} ${res.statusText}`;
    try {
      const errorJson = JSON.parse(errorBody);
      if (errorJson.message || errorJson.error) {
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      }
    } catch {
      // If not JSON, use the text as is
      if (errorBody && errorBody.length < 200) {
        errorMessage = errorBody;
      }
    }
    
    throw new Error(errorMessage);
  }

  const data = (await res.json()) as ZiinaPaymentIntentResponse;

  if (!data.redirect_url || !data.id) {
    console.error("[Ziina] Unexpected response", data);
    throw new Error("Ziina did not return redirect_url or id");
  }

  return {
    paymentIntentId: data.id,
    redirectUrl: data.redirect_url,
  };
}

