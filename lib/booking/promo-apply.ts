import { getPromoByCode } from "@/lib/data/promos";

export async function applyPromoToTotal(
  total: number,
  promoCode?: string | null
): Promise<number> {
  if (!promoCode || !promoCode.trim()) {
    return total;
  }

  const promo = await getPromoByCode(promoCode.trim().toUpperCase());

  if (!promo || !promo.active) {
    return total;
  }

  let discount = 0;

  if (promo.type === "percent") {
    discount = (total * promo.value) / 100;
  } else if (promo.type === "fixed") {
    discount = Math.min(promo.value, total);
  }

  return Math.max(0, total - discount);
}

