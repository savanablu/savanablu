import { NextResponse } from "next/server";
import { findPromoByCode } from "@/lib/data/promos";

type PromoValidateRequest = {
  code: string;
  amount: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PromoValidateRequest;

    const code = body.code?.trim();
    const amount = Number(body.amount);

    if (!code || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a valid amount and promo code."
        },
        { status: 400 }
      );
    }

    const promo = await findPromoByCode(code);
    if (!promo || !promo.active) {
      return NextResponse.json(
        {
          success: false,
          error: "This promo code is not valid or no longer active."
        },
        { status: 400 }
      );
    }

    let discountAmount = 0;

    if (promo.type === "percent") {
      discountAmount = (amount * promo.value) / 100;
    } else if (promo.type === "fixed") {
      discountAmount = promo.value;
    }

    if (discountAmount > amount) {
      discountAmount = amount;
    }

    const finalTotal = amount - discountAmount;

    return NextResponse.json({
      success: true,
      code: promo.code,
      type: promo.type,
      value: promo.value,
      discountAmount,
      finalTotal,
      message:
        promo.type === "percent"
          ? `Promo applied: ${promo.value}% off your tour.`
          : `Promo applied: USD ${promo.value.toFixed(2)} off your tour.`
    });
  } catch (err) {
    console.error("Error validating promo:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong. Please try that promo again."
      },
      { status: 500 }
    );
  }
}
