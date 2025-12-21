// components/admin/StatusBadge.tsx

type BookingStatus = "confirmed" | "on-hold" | "pending" | "cancelled" | string;

interface StatusBadgeProps {
  status: BookingStatus;
  paymentStatus?: string;
  className?: string;
}

export function getBookingStatus(
  booking: { status?: string; paymentStatus?: string }
): BookingStatus {
  // Priority: paymentStatus > status
  if (booking.paymentStatus === "confirmed") return "confirmed";
  if (booking.paymentStatus === "cancelled") return "cancelled";
  if (booking.status === "cancelled") return "cancelled";
  if (booking.paymentStatus === "pending" || booking.status === "pending" || booking.status === "on-hold") {
    return "on-hold";
  }
  // Default to on-hold if no status
  return "on-hold";
}

export function getStatusLabel(status: BookingStatus): string {
  switch (status) {
    case "confirmed":
      return "Confirmed";
    case "on-hold":
      return "On hold";
    case "pending":
      return "Pending";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

export function getStatusDescription(status: BookingStatus): string {
  switch (status) {
    case "confirmed":
      return "20% advance paid";
    case "on-hold":
      return "Awaiting 20% advance";
    case "pending":
      return "Awaiting confirmation";
    case "cancelled":
      return "Booking cancelled";
    default:
      return "";
  }
}

export default function StatusBadge({
  status,
  paymentStatus,
  className = "",
}: StatusBadgeProps) {
  const finalStatus = paymentStatus
    ? getBookingStatus({ paymentStatus, status })
    : getBookingStatus({ status });

  const label = getStatusLabel(finalStatus);
  const description = getStatusDescription(finalStatus);

  const baseClasses = "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold";
  
  const statusClasses = {
    confirmed: "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30",
    "on-hold": "bg-sb-coral/20 text-sb-coral border border-sb-coral/30",
    pending: "bg-sb-lagoon/20 text-sb-lagoon border border-sb-lagoon/30",
    cancelled: "bg-red-400/20 text-red-400 border border-red-400/30",
  };

  const statusClass = statusClasses[finalStatus as keyof typeof statusClasses] || statusClasses["on-hold"];

  return (
    <div className={`${baseClasses} ${statusClass} ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      <span>{label}</span>
      {description && (
        <span className="ml-1 text-[10px] opacity-75">({description})</span>
      )}
    </div>
  );
}





