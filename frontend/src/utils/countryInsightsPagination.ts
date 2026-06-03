export const COUNTRIES_LIST_PAGE_SIZE = 8;

export function paginatedCountryInsights<T>(items: T[], page: number, pageSize = COUNTRIES_LIST_PAGE_SIZE): T[] {
  const start = page * pageSize;
  return items.slice(start, start + pageSize);
}
