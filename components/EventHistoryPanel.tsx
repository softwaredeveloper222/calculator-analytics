"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAnalyticsRefresh } from "@/components/AnalyticsRefreshProvider";
import {
  EventHistoryTable,
  type EventRow,
} from "@/components/EventHistoryTable";
import { Pagination } from "@/components/Pagination";
import { TrashIcon } from "@/components/icons";
import type { PaginationMeta } from "@/lib/pagination";
import {
  btnDangerSm,
  btnSegmentActive,
  btnSegmentIdle,
} from "@/lib/button-styles";

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
      <p className="text-sm text-(--admin-text-muted)">
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
            className={btnDangerSm}
          >
            <TrashIcon className="h-4 w-4" />
            Delete{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-(--admin-text-muted)">
          <span>Rows per page:</span>
          {PAGE_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              disabled={busy}
              onClick={() => void loadPage(1, size)}
              className={
                pagination.pageSize === size ? btnSegmentActive : btnSegmentIdle
              }
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
            className="absolute inset-0 flex items-center justify-center rounded-lg bg-(--admin-overlay)"
            role="status"
            aria-live="polite"
            aria-label={isDeleting ? "Deleting events" : "Loading events"}
          >
            <div className="flex items-center gap-3 rounded-xl border border-(--admin-border) bg-(--admin-panel) px-4 py-3 text-sm text-(--admin-text) shadow-lg">
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
      className="h-4 w-4 animate-spin text-(--admin-accent)"
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
