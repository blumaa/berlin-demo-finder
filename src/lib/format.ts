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

export function formatLastUpdated(iso: string, locale: string = "en"): string {
  const date = new Date(iso);
  return date.toLocaleString(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
