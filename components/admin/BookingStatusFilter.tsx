"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getBookingStatus } from "./StatusBadge";

type StatusFilter = "all" | "confirmed" | "on-hold" | "cancelled";

interface BookingStatusFilterProps {
  bookings: any[];
}

export default function BookingStatusFilter({
  bookings,
}: BookingStatusFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentFilter = (searchParams.get("status") as StatusFilter) || "all";

  const statusCounts = {
    all: bookings.length,
    confirmed: bookings.filter((b) => getBookingStatus(b) === "confirmed")
      .length,
    "on-hold": bookings.filter((b) => getBookingStatus(b) === "on-hold")
      .length,
    cancelled: bookings.filter((b) => getBookingStatus(b) === "cancelled")
      .length,
  };

  const handleFilterChange = (status: StatusFilter) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const filters: { value: StatusFilter; label: string; color: string }[] = [
    { value: "all", label: "All", color: "text-sb-cream" },
    {
      value: "confirmed",
      label: "Confirmed",
      color: "text-emerald-400",
    },
    {
      value: "on-hold",
      label: "On hold",
      color: "text-sb-coral",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "text-red-400",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => {
        const isActive = currentFilter === filter.value;
        const count = statusCounts[filter.value];

        return (
          <button
            key={filter.value}
            onClick={() => handleFilterChange(filter.value)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
              isActive
                ? `border-current ${filter.color} bg-current/10`
                : "border-sb-cream/30 text-sb-cream/70 hover:border-sb-cream/50 hover:text-sb-cream/90 hover:bg-sb-cream/5"
            }`}
          >
            {filter.label}
            <span className="ml-1.5 rounded-full bg-current/20 px-1.5 py-0.5 text-[10px]">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}





