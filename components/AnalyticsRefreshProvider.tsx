"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type AnalyticsRefreshContextValue = {
  registerTableRefresh: (refresh: () => void | Promise<void>) => () => void;
  refreshDashboard: () => void;
  isRefreshing: boolean;
};

const AnalyticsRefreshContext =
  createContext<AnalyticsRefreshContextValue | null>(null);

export function AnalyticsRefreshProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const tableRefreshRef = useRef<(() => void | Promise<void>) | null>(null);
  const [isTableRefreshing, setIsTableRefreshing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const registerTableRefresh = useCallback(
    (refresh: () => void | Promise<void>) => {
      tableRefreshRef.current = refresh;
      return () => {
        if (tableRefreshRef.current === refresh) {
          tableRefreshRef.current = null;
        }
      };
    },
    [],
  );

  const refreshDashboard = useCallback(() => {
    setIsTableRefreshing(true);

    Promise.resolve(tableRefreshRef.current?.())
      .catch(() => undefined)
      .finally(() => {
        setIsTableRefreshing(false);
      });

    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  const isRefreshing = isPending || isTableRefreshing;

  return (
    <AnalyticsRefreshContext.Provider
      value={{ registerTableRefresh, refreshDashboard, isRefreshing }}
    >
      {children}
      {isRefreshing ? <ScreenLoadingOverlay /> : null}
    </AnalyticsRefreshContext.Provider>
  );
}

export function useAnalyticsRefresh() {
  const context = useContext(AnalyticsRefreshContext);
  if (!context) {
    throw new Error(
      "useAnalyticsRefresh must be used within AnalyticsRefreshProvider",
    );
  }
  return context;
}

function ScreenLoadingOverlay() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--admin-overlay) backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Refreshing dashboard"
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-(--admin-border) bg-(--admin-panel) px-8 py-6 text-(--admin-text) shadow-2xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          className="h-8 w-8 animate-spin text-(--admin-accent)"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="2.5"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-sm text-(--admin-text-secondary)">Refreshing…</p>
      </div>
    </div>
  );
}
