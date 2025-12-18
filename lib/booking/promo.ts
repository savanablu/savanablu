export type PromoResult = {
  valid: boolean;
  type?: "percent" | "fixed";
  value?: number;
  error?: string;
};

export async function applyPromoCode(
  code: string,
  amount: number
): Promise<PromoResult> {
  if (!code || !code.trim()) {
    return {
      valid: false,
      error: "Please enter a promo code."
    };
  }

  try {
    const res = await fetch("/api/promos/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim().toUpperCase(), amount })
    });

    const data = await res.json();

    if (!data.success) {
      return {
        valid: false,
        error: data.error || "Invalid or inactive promo code."
      };
    }

    return {
      valid: true,
      type: data.type,
      value: data.value
    };
  } catch (err) {
    return {
      valid: false,
      error: "Failed to validate promo code. Please try again."
    };
  }
}

