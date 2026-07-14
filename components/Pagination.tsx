"use client";

import type { PaginationMeta } from "@/lib/pagination";
import {
  btnChromeIcon,
  btnSegmentActive,
  btnSegmentIdle,
} from "@/lib/button-styles";

type PaginationProps = {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  itemLabel?: string;
};

export function Pagination({
  pagination,
  onPageChange,
  disabled = false,
  itemLabel = "events",
}: PaginationProps) {
  const { page, totalPages, totalEvents, hasPrevious, hasNext } = pagination;

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col gap-4 border-t border-(--admin-border) pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-(--admin-text-muted)">
        Page {page} of {totalPages} · {totalEvents} total {itemLabel}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <PageButton
          disabled={disabled || !hasPrevious}
          direction="previous"
          onClick={() => onPageChange(page - 1)}
        />

        {pageNumbers.map((pageNumber, index) =>
          pageNumber === "…" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-(--admin-text-muted)"
            >
              …
            </span>
          ) : (
            <button
              key={pageNumber}
              type="button"
              disabled={disabled}
              onClick={() => onPageChange(pageNumber)}
              className={`min-w-9 ${
                pageNumber === page ? btnSegmentActive : btnSegmentIdle
              }`}
            >
              {pageNumber}
            </button>
          ),
        )}

        <PageButton
          disabled={disabled || !hasNext}
          direction="next"
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </div>
  );
}

function PageButton({
  disabled,
  direction,
  onClick,
}: {
  disabled: boolean;
  direction: "previous" | "next";
  onClick: () => void;
}) {
  const label = direction === "previous" ? "Previous page" : "Next page";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      title={label}
      className={btnChromeIcon}
    >
      <ChevronIcon direction={direction} />
    </button>
  );
}

function ChevronIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      {direction === "previous" ? (
        <path
          fillRule="evenodd"
          d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
          clipRule="evenodd"
        />
      ) : (
        <path
          fillRule="evenodd"
          d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
          clipRule="evenodd"
        />
      )}
    </svg>
  );
}

function getPageNumbers(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: Array<number | "…"> = [1];

  if (current > 3) pages.push("…");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (current < total - 2) pages.push("…");

  pages.push(total);
  return pages;
}
