"use client";

import { useAnalyticsRefresh } from "@/components/AnalyticsRefreshProvider";
import { RefreshIcon } from "@/components/icons";
import { btnPrimary } from "@/lib/button-styles";

export function RefreshButton() {
  const { refreshDashboard, isRefreshing } = useAnalyticsRefresh();

  return (
    <button
      type="button"
      onClick={refreshDashboard}
      disabled={isRefreshing}
      className={btnPrimary}
    >
      <RefreshIcon
        className={`h-4 w-4 shrink-0 ${isRefreshing ? "animate-spin" : ""}`}
      />
      <span>{isRefreshing ? "Refreshing…" : "Refresh"}</span>
    </button>
  );
}
