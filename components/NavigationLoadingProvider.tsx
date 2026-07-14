"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

type NavigationLoadingContextValue = {
  startNavigation: () => void;
  beginProgress: () => void;
  endProgress: () => void;
};

const NavigationLoadingContext =
  createContext<NavigationLoadingContextValue | null>(null);

export function useNavigationLoading() {
  return useContext(NavigationLoadingContext);
}

export function NavigationLoadingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const clearTimerRef = useRef<number | null>(null);
  const progressCountRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (clearTimerRef.current !== null) {
      window.clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
  }, []);

  const clearNavigating = useCallback(() => {
    progressCountRef.current = 0;
    setIsNavigating(false);
    clearTimer();
  }, [clearTimer]);

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
    clearTimer();
    // Keep feedback brief; route segments stream their own data loaders.
    clearTimerRef.current = window.setTimeout(() => {
      if (progressCountRef.current === 0) {
        setIsNavigating(false);
      }
      clearTimerRef.current = null;
    }, 1200);
  }, [clearTimer]);

  const beginProgress = useCallback(() => {
    clearTimer();
    progressCountRef.current += 1;
    setIsNavigating(true);
  }, [clearTimer]);

  const endProgress = useCallback(() => {
    progressCountRef.current = Math.max(0, progressCountRef.current - 1);
    if (progressCountRef.current === 0) {
      setIsNavigating(false);
    }
  }, []);

  useEffect(() => {
    clearNavigating();
  }, [pathname, searchParams, clearNavigating]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;

        const nextPath = `${url.pathname}${url.search}`;
        const currentPath = `${window.location.pathname}${window.location.search}`;
        if (nextPath === currentPath) return;

        startNavigation();
      } catch {
        // Ignore invalid URLs.
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [startNavigation]);

  const value = useMemo(
    () => ({ startNavigation, beginProgress, endProgress }),
    [startNavigation, beginProgress, endProgress],
  );

  return (
    <NavigationLoadingContext.Provider value={value}>
      {children}
      {isNavigating ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 z-100 h-0.5 overflow-hidden bg-(--admin-border)"
        >
          <div className="nav-progress-bar h-full w-1/3 bg-(--admin-accent)" />
        </div>
      ) : null}
    </NavigationLoadingContext.Provider>
  );
}
