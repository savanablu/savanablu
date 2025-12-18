"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CurrencyCode, FxConfig } from "@/lib/fx";
import fxSettings from "@/data/fx-settings.json";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  fx: FxConfig;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

const FX_CONFIG: FxConfig = {
  baseCurrency: fxSettings.baseCurrency,
  rates: fxSettings.rates,
  markups: fxSettings.markups,
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  // Load currency from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("currency") as CurrencyCode | null;
    if (saved && ["USD", "EUR", "GBP", "TSH"].includes(saved)) {
      setCurrencyState(saved);
    }
  }, []);

  // Save currency to localStorage when it changes
  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, fx: FX_CONFIG }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

