/**
 * Formats a date string (YYYY-MM-DD or ISO) to a human-readable format
 * Example: "2025-12-14" -> "14 Dec 2025"
 */
export function formatDateLabel(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If parsing fails, try to parse as YYYY-MM-DD
      const parts = dateString.split("-");
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const day = parseInt(parts[2], 10);
        const dateObj = new Date(year, month, day);
        if (!isNaN(dateObj.getTime())) {
          return formatDate(dateObj);
        }
      }
      return dateString; // Return original if we can't parse it
    }
    return formatDate(date);
  } catch {
    return dateString; // Return original on error
  }
}

function formatDate(date: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

