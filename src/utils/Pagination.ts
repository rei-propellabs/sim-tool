export type PaginationParams = {
  limit?: number;
  offset?: number;
  orderBy?: "ASC" | "DESC";
  order?: string;
};

export function buildQueryParams(params: Record<string, any>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}