"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

type NavigationLoadingContextValue = {
  startNavigation: () => void;
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

  const clearNavigating = useCallback(() => {
    setIsNavigating(false);
    if (clearTimerRef.current !== null) {
      window.clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
  }, []);

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
    if (clearTimerRef.current !== null) {
      window.clearTimeout(clearTimerRef.current);
    }
    // Keep feedback brief; route segments stream their own data loaders.
    clearTimerRef.current = window.setTimeout(() => {
      setIsNavigating(false);
      clearTimerRef.current = null;
    }, 1200);
  }, []);

  useEffect(() => {
    clearNavigating();
  }, [pathname, searchParams, clearNavigating]);

  useEffect(() => {
    return () => {
      if (clearTimerRef.current !== null) {
        window.clearTimeout(clearTimerRef.current);
      }
    };
  }, []);

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

  return (
    <NavigationLoadingContext.Provider value={{ startNavigation }}>
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
