export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

export type PaginationParams = {
  page: number;
  pageSize: number;
};

export type PaginationMeta = PaginationParams & {
  totalEvents: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

export function normalizePagination(
  page?: string | number,
  pageSize?: string | number,
): PaginationParams {
  const parsedPage =
    typeof page === "string" ? Number.parseInt(page, 10) : (page ?? 1);
  const parsedPageSize =
    typeof pageSize === "string"
      ? Number.parseInt(pageSize, 10)
      : (pageSize ?? DEFAULT_PAGE_SIZE);

  return {
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
    pageSize:
      Number.isFinite(parsedPageSize) && parsedPageSize > 0
        ? Math.min(parsedPageSize, MAX_PAGE_SIZE)
        : DEFAULT_PAGE_SIZE,
  };
}

export function buildPaginationMeta(
  totalEvents: number,
  { page, pageSize }: PaginationParams,
): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(totalEvents / pageSize));
  const safePage = Math.min(page, totalPages);

  return {
    page: safePage,
    pageSize,
    totalEvents,
    totalPages,
    hasPrevious: safePage > 1,
    hasNext: safePage < totalPages,
  };
}

export function buildPageHref(
  basePath: string,
  page: number,
  pageSize: number,
  extraParams?: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  if (extraParams) {
    for (const [key, value] of Object.entries(extraParams)) {
      if (value) params.set(key, value);
    }
  }

  return `${basePath}?${params.toString()}`;
}
