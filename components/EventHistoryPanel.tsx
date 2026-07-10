"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAnalyticsRefresh } from "@/components/AnalyticsRefreshProvider";
import {
  EventHistoryTable,
  type EventRow,
} from "@/components/EventHistoryTable";
import { Pagination } from "@/components/Pagination";
import type { PaginationMeta } from "@/lib/pagination";

type HistoryData = {
  events: EventRow[];
  pagination: PaginationMeta;
};

type EventHistoryPanelProps = {
  initialData: HistoryData;
};

const PAGE_SIZES = [10, 25, 50] as const;

export function EventHistoryPanel({ initialData }: EventHistoryPanelProps) {
  const router = useRouter();
  const { registerTableRefresh, isRefreshing } = useAnalyticsRefresh();
  const [events, setEvents] = useState(initialData.events);
  const [pagination, setPagination] = useState(initialData.pagination);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPage = useCallback(async (page: number, pageSize: number) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      const response = await fetch(`/api/analytics/events?${params.toString()}`);
      if (!response.ok) return;

      const data: HistoryData = await response.json();
      setEvents(data.events);
      setPagination(data.pagination);
      setSelectedIds(new Set());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    return registerTableRefresh(() =>
      loadPage(pagination.page, pagination.pageSize),
    );
  }, [
    registerTableRefresh,
    loadPage,
    pagination.page,
    pagination.pageSize,
  ]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((current) => {
      const allOnPageSelected =
        events.length > 0 && events.every((event) => current.has(event.id));

      if (allOnPageSelected) {
        const next = new Set(current);
        for (const event of events) {
          next.delete(event.id);
        }
        return next;
      }

      const next = new Set(current);
      for (const event of events) {
        next.add(event.id);
      }
      return next;
    });
  }, [events]);

  const handleDelete = useCallback(async () => {
    if (selectedIds.size === 0) return;

    const confirmed = window.confirm(
      `Delete ${selectedIds.size} selected event${selectedIds.size === 1 ? "" : "s"}? This cannot be undone.`,
    );
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch("/api/analytics/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!response.ok) return;

      setSelectedIds(new Set());

      const params = new URLSearchParams({
        page: String(pagination.page),
        pageSize: String(pagination.pageSize),
      });

      const reload = await fetch(`/api/analytics/events?${params.toString()}`);
      if (reload.ok) {
        const data: HistoryData = await reload.json();

        if (data.events.length === 0 && data.pagination.page > 1) {
          await loadPage(data.pagination.page - 1, data.pagination.pageSize);
        } else {
          setEvents(data.events);
          setPagination(data.pagination);
        }
      }

      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }, [selectedIds, pagination.page, pagination.pageSize, loadPage, router]);

  const busy = isLoading || isDeleting;
  // Full-screen overlay covers refresh; keep table overlay for pagination/delete only.
  const showTableOverlay = busy && !isRefreshing;

  if (initialData.events.length === 0 && events.length === 0 && !busy) {
    return (
      <p className="text-sm text-slate-500">
        No events yet. Open Calculators in the app, tap Calculate, then refresh
        this page.
      </p>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={busy || selectedIds.size === 0}
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-transparent disabled:text-slate-600"
          >
            <TrashIcon />
            Delete{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <span>Rows per page:</span>
          {PAGE_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              disabled={busy}
              onClick={() => void loadPage(1, size)}
              className={`rounded-md px-2 py-1 ${
                pagination.pageSize === size
                  ? "bg-indigo-500 text-white"
                  : "border border-slate-700 text-slate-300 hover:bg-slate-950 disabled:opacity-50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="relative min-h-32">
        <div
          className={
            showTableOverlay
              ? "pointer-events-none opacity-40 transition-opacity"
              : ""
          }
          aria-hidden={showTableOverlay}
        >
          <EventHistoryTable
            events={events}
            selectedIds={selectedIds}
            onToggle={toggleSelection}
            onToggleAll={toggleSelectAll}
          />
        </div>

        {showTableOverlay ? (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-950/50"
            role="status"
            aria-live="polite"
            aria-label={isDeleting ? "Deleting events" : "Loading events"}
          >
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 shadow-lg">
              <SpinnerIcon />
              <span>{isDeleting ? "Deleting…" : "Loading…"}</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <Pagination
          pagination={pagination}
          disabled={busy}
          onPageChange={(page) => void loadPage(page, pagination.pageSize)}
        />
      </div>
    </>
  );
}

function SpinnerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4 animate-spin text-indigo-300"
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r="7"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <path
        d="M17 10a7 7 0 0 0-7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
