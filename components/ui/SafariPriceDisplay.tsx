"use client";

import { PriceDisplay } from "./PriceDisplay";

type SafariPriceDisplayProps = {
  priceFrom: number | string | undefined;
  prefix?: string;
};

export function SafariPriceDisplay({
  priceFrom,
  prefix = "From ",
}: SafariPriceDisplayProps) {
  if (typeof priceFrom === "number") {
    return (
      <>
        {prefix}
        <PriceDisplay amountUSD={priceFrom} />
      </>
    );
  }

  return <>{priceFrom || "Pricing on request"}</>;
}

