import type { Tour } from "@/lib/data/tours";
import { cn } from "@/lib/utils";

type Props = {
  tour: Tour;
  variant?: "light" | "dark";
};

export default function TourFacts({ tour, variant = "light" }: Props) {
  const isDark = variant === "dark";
  
  return (
    <section
      aria-label="Key facts"
      className={cn(
        "mt-6 grid gap-4 rounded-2xl border p-4 text-xs md:grid-cols-4",
        isDark
          ? "border-sb-shell/20 bg-sb-shell/10 text-sb-shell/90"
          : "border-sb-mist/80 bg-sb-shell/90 text-sb-ink/80"
      )}
    >
      <div>
        <div className={cn(
          "text-[0.65rem] font-semibold uppercase tracking-[0.18em]",
          isDark ? "text-sb-shell/60" : "text-sb-ink/60"
        )}>
          Location
        </div>
        <div className={cn(
          "mt-1 text-sm",
          isDark ? "text-sb-shell/90" : "text-sb-ink/90"
        )}>{tour.location}</div>
      </div>
      <div>
        <div className={cn(
          "text-[0.65rem] font-semibold uppercase tracking-[0.18em]",
          isDark ? "text-sb-shell/60" : "text-sb-ink/60"
        )}>
          Duration
        </div>
        <div className={cn(
          "mt-1 text-sm",
          isDark ? "text-sb-shell/90" : "text-sb-ink/90"
        )}>
          Approx. {tour.durationHours} hours
        </div>
      </div>
      <div>
        <div className={cn(
          "text-[0.65rem] font-semibold uppercase tracking-[0.18em]",
          isDark ? "text-sb-shell/60" : "text-sb-ink/60"
        )}>
          From
        </div>
        <div className={cn(
          "mt-1 text-sm font-semibold",
          isDark ? "text-sb-lagoon" : "text-sb-ocean"
        )}>
          USD {tour.basePrice.toFixed(0)} per adult
        </div>
      </div>
      <div>
        <div className={cn(
          "text-[0.65rem] font-semibold uppercase tracking-[0.18em]",
          isDark ? "text-sb-shell/60" : "text-sb-ink/60"
        )}>
          Style
        </div>
        <div className={cn(
          "mt-1 text-sm",
          isDark ? "text-sb-shell/90" : "text-sb-ink/90"
        )}>
          {tour.category} ·{" "}
          {tour.privateOptionAvailable
            ? "Small-group & private on request"
            : "Small-group departures"}
        </div>
      </div>
    </section>
  );
}
