"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type AnalyticsRefreshContextValue = {
  registerTableRefresh: (refresh: () => void) => () => void;
  refreshDashboard: () => void;
};

const AnalyticsRefreshContext =
  createContext<AnalyticsRefreshContextValue | null>(null);

export function AnalyticsRefreshProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const tableRefreshRef = useRef<(() => void) | null>(null);

  const registerTableRefresh = useCallback((refresh: () => void) => {
    tableRefreshRef.current = refresh;
    return () => {
      if (tableRefreshRef.current === refresh) {
        tableRefreshRef.current = null;
      }
    };
  }, []);

  const refreshDashboard = useCallback(() => {
    tableRefreshRef.current?.();
    router.refresh();
  }, [router]);

  return (
    <AnalyticsRefreshContext.Provider
      value={{ registerTableRefresh, refreshDashboard }}
    >
      {children}
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
