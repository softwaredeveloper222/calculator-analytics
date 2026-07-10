"use client";

import { useTransition } from "react";
import { useAnalyticsRefresh } from "@/components/AnalyticsRefreshProvider";

export function RefreshButton() {
  const { refreshDashboard } = useAnalyticsRefresh();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      refreshDashboard();
    });
  };

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={isPending}
      aria-busy={isPending}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <SpinnerIcon spinning={isPending} />
      {isPending ? "Refreshing…" : "Refresh"}
    </button>
  );
}

function SpinnerIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      className={`h-4 w-4 ${spinning ? "animate-spin" : ""}`}
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
