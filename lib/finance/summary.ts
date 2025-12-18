import { readBookings } from "@/lib/data/bookings";

export type FinanceTotals = {
  bookingCount: number;
  totalRevenueUSD: number;
  totalDepositsUSD: number;
  totalBalanceUSD: number;
};

export type FinanceByType = {
  tours: FinanceTotals;
  packages: FinanceTotals;
};

export type ExperienceRow = {
  experienceSlug: string;
  experienceTitle: string;
  bookingCount: number;
  totalRevenueUSD: number;
  totalDepositsUSD: number;
  totalBalanceUSD: number;
};

export type MonthlyRow = {
  monthKey: string;
  bookingCount: number;
  totalRevenueUSD: number;
  totalDepositsUSD: number;
  totalBalanceUSD: number;
};

export type FinanceSummary = {
  totals: FinanceTotals;
  byType: FinanceByType;
  byExperience: ExperienceRow[];
  byMonth: MonthlyRow[];
};

export async function getFinanceSummary(): Promise<FinanceSummary> {
  const bookings = await readBookings();

  const totals: FinanceTotals = {
    bookingCount: 0,
    totalRevenueUSD: 0,
    totalDepositsUSD: 0,
    totalBalanceUSD: 0,
  };

  const byType = {
    tours: { ...totals },
    packages: { ...totals },
  };

  const byExperienceMap = new Map<string, ExperienceRow>();
  const byMonthMap = new Map<string, MonthlyRow>();

  for (const b of bookings) {
    const totalUSD = b.totalUSD ?? b.totalUsd ?? 0;
    const depositUSD = b.depositUSD ?? 0;
    const balanceUSD = b.balanceUSD ?? totalUSD - depositUSD;

    const isPackage = b.type === "Safari" || b.type === "package";
    const typeKey = isPackage ? "packages" : "tours";

    // Totals
    totals.bookingCount++;
    totals.totalRevenueUSD += totalUSD;
    totals.totalDepositsUSD += depositUSD;
    totals.totalBalanceUSD += balanceUSD;

    // By type
    byType[typeKey].bookingCount++;
    byType[typeKey].totalRevenueUSD += totalUSD;
    byType[typeKey].totalDepositsUSD += depositUSD;
    byType[typeKey].totalBalanceUSD += balanceUSD;

    // By experience
    const slug = b.experienceSlug || b.slug || "unknown";
    const title = b.experienceTitle || b.tourTitle || b.packageTitle || "Unknown";
    if (!byExperienceMap.has(slug)) {
      byExperienceMap.set(slug, {
        experienceSlug: slug,
        experienceTitle: title,
        bookingCount: 0,
        totalRevenueUSD: 0,
        totalDepositsUSD: 0,
        totalBalanceUSD: 0,
      });
    }
    const exp = byExperienceMap.get(slug)!;
    exp.bookingCount++;
    exp.totalRevenueUSD += totalUSD;
    exp.totalDepositsUSD += depositUSD;
    exp.totalBalanceUSD += balanceUSD;

    // By month
    const dateStr = b.date || b.tourDate || b.packageDate || b.createdAt;
    let monthKey = "Unknown";
    if (dateStr) {
      try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        }
      } catch {
        // Keep "Unknown"
      }
    }
    if (!byMonthMap.has(monthKey)) {
      byMonthMap.set(monthKey, {
        monthKey,
        bookingCount: 0,
        totalRevenueUSD: 0,
        totalDepositsUSD: 0,
        totalBalanceUSD: 0,
      });
    }
    const month = byMonthMap.get(monthKey)!;
    month.bookingCount++;
    month.totalRevenueUSD += totalUSD;
    month.totalDepositsUSD += depositUSD;
    month.totalBalanceUSD += balanceUSD;
  }

  // Sort experiences by revenue descending
  const byExperience = Array.from(byExperienceMap.values()).sort(
    (a, b) => b.totalRevenueUSD - a.totalRevenueUSD
  );

  // Sort months chronologically
  const byMonth = Array.from(byMonthMap.values()).sort((a, b) => {
    if (a.monthKey === "Unknown") return 1;
    if (b.monthKey === "Unknown") return -1;
    return a.monthKey.localeCompare(b.monthKey);
  });

  return {
    totals,
    byType,
    byExperience,
    byMonth,
  };
}

