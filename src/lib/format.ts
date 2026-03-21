export function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function stripSeconds(time: string): string {
  return time.slice(0, 5);
}

export function formatTime(from: string, to: string | null): string {
  const f = stripSeconds(from);
  if (to) return `${f}\u2013${stripSeconds(to)}`;
  return f;
}

const MONTH_NAMES_SHORT: Record<string, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  de: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
};

export function formatLastUpdated(iso: string): string {
  const date = new Date(iso);
  const months = MONTH_NAMES_SHORT["en"];
  const month = months[date.getUTCMonth()];
  const day = date.getUTCDate();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${month} ${day}, ${hours}:${minutes} UTC`;
}
