"use client";

import { useAnalyticsRefresh } from "@/components/AnalyticsRefreshProvider";

export function RefreshButton() {
  const { refreshDashboard, isRefreshing } = useAnalyticsRefresh();

  return (
    <button
      type="button"
      onClick={refreshDashboard}
      disabled={isRefreshing}
      className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Refresh
    </button>
  );
}
