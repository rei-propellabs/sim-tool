export function buildQueryString(params: Record<string, unknown>): string {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value != null && value !== "")
  );

  return new URLSearchParams(filteredParams as Record<string, string>).toString();
}