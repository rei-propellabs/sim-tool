export function formatDateMMDDYY(date: string | number | Date): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
}

export function daysElapsed(date: string | number | Date): string {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const DAYS_PER_YEAR = 365;
  const now = new Date();
  const inputDate = new Date(date);
  const diffMs = Math.abs(now.getTime() - inputDate.getTime());
  const daysPassed = Math.floor(diffMs / MS_PER_DAY);

  if (daysPassed >= DAYS_PER_YEAR) return `${Math.floor(daysPassed / DAYS_PER_YEAR)}y`;
  return `${daysPassed}d`;
}

export const excelDateToJSDate = (serial: number) => {
  const utcDays = Math.floor(serial - 25569)
  const utcValue = utcDays * 86400 // seconds
  return new Date(utcValue * 1000) // milliseconds
}