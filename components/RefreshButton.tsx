"use client";

import { useAnalyticsRefresh } from "@/components/AnalyticsRefreshProvider";
import { RefreshIcon } from "@/components/icons";

export function RefreshButton() {
  const { refreshDashboard, isRefreshing } = useAnalyticsRefresh();

  return (
    <button
      type="button"
      onClick={refreshDashboard}
      disabled={isRefreshing}
      className="inline-flex items-center gap-2 rounded-xl border border-(--admin-border) px-4 py-2 text-sm font-medium text-(--admin-text-secondary) transition hover:bg-(--admin-btn-secondary-hover) hover:text-(--admin-text) disabled:cursor-not-allowed disabled:opacity-50"
    >
      <RefreshIcon
        className={`h-4 w-4 shrink-0 ${isRefreshing ? "animate-spin" : ""}`}
      />
      <span>{isRefreshing ? "Refreshing…" : "Refresh"}</span>
    </button>
  );
}
