"use client";

import { useState } from "react";
import { useAnalyticsRefresh } from "@/components/AnalyticsRefreshProvider";

export function RefreshButton() {
  const { refreshDashboard } = useAnalyticsRefresh();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      refreshDashboard();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900 disabled:opacity-50"
    >
      {isRefreshing ? "Refreshing…" : "Refresh"}
    </button>
  );
}
