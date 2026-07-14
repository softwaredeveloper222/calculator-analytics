"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useNavigationLoading } from "@/components/NavigationLoadingProvider";

type AnalyticsRefreshContextValue = {
  registerTableRefresh: (refresh: () => void | Promise<void>) => () => void;
  refreshDashboard: () => void;
  isRefreshing: boolean;
};

const AnalyticsRefreshContext =
  createContext<AnalyticsRefreshContextValue | null>(null);

export function AnalyticsRefreshProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const navigation = useNavigationLoading();
  const beginProgress = navigation?.beginProgress;
  const endProgress = navigation?.endProgress;
  const tableRefreshRef = useRef<(() => void | Promise<void>) | null>(null);
  const [isTableRefreshing, setIsTableRefreshing] = useState(false);
  const [cycleActive, setCycleActive] = useState(false);
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
    if (cycleActive) return;

    setCycleActive(true);
    setIsTableRefreshing(true);
    beginProgress?.();

    Promise.resolve(tableRefreshRef.current?.())
      .catch(() => undefined)
      .finally(() => {
        setIsTableRefreshing(false);
      });

    startTransition(() => {
      router.refresh();
    });
  }, [router, beginProgress, cycleActive]);

  // Hold the shared top progress bar until table fetch + router.refresh both settle.
  useEffect(() => {
    if (!cycleActive) return;
    if (isPending || isTableRefreshing) return;

    setCycleActive(false);
    endProgress?.();
  }, [cycleActive, isPending, isTableRefreshing, endProgress]);

  const isRefreshing = cycleActive || isPending || isTableRefreshing;

  return (
    <AnalyticsRefreshContext.Provider
      value={{ registerTableRefresh, refreshDashboard, isRefreshing }}
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
