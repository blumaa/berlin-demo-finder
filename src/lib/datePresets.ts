function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function getToday(ref: Date = new Date()): string {
  return formatDate(ref);
}

export function getWeekRange(ref: Date = new Date()): { from: string; to: string } {
  const day = ref.getDay(); // 0=Sun, 1=Mon, ...
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(ref);
  monday.setDate(ref.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { from: formatDate(monday), to: formatDate(sunday) };
}
