"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { LogoutButton } from "@/components/LogoutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigationLoading } from "@/components/NavigationLoadingProvider";
import {
  BellIcon,
  ChartIcon,
  HubIcon,
  MenuIcon,
  PanelIcon,
} from "@/components/icons";

const SIDEBAR_STORAGE_KEY = "gcap-admin-sidebar-expanded";

const NAV_ITEMS = [
  {
    href: "/hub",
    label: "Hub",
    description: "Overview",
    icon: HubIcon,
  },
  {
    href: "/notifications",
    label: "Notification",
    description: "Content and push notification",
    icon: BellIcon,
  },
  {
    href: "/analytics",
    label: "Analytics",
    description: "Calculator usage",
    icon: ChartIcon,
  },
] as const;

function sectionMeta(pathname: string) {
  const match = NAV_ITEMS.find(
    (item) =>
      pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return (
    match ?? {
      label: "Admin",
      description: "GCAP Admin",
      icon: HubIcon,
    }
  );
}
function SidebarToggleControl({
  expanded,
  onToggle,
  compact,
}: {
  expanded: boolean;
  onToggle: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      aria-expanded={expanded}
      title={expanded ? "Collapse sidebar" : "Expand sidebar"}
      className={
        compact
          ? "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-(--admin-border) text-(--admin-text-secondary) transition hover:bg-(--admin-btn-secondary-hover) hover:text-(--admin-text)"
          : "inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-(--admin-border) px-3 text-xs font-medium text-(--admin-text-secondary) transition hover:bg-(--admin-btn-secondary-hover) hover:text-(--admin-text)"
      }
    >
      <PanelIcon className="h-4 w-4 shrink-0" />
      {!compact ? (
        <span>{expanded ? "Collapse" : "Expand"}</span>
      ) : null}
    </button>
  );
}

function SidebarNav({
  pathname,
  onNavigate,
  expanded,
}: {
  pathname: string;
  onNavigate?: () => void;
  expanded: boolean;
}) {
  const navigation = useNavigationLoading();

  return (
    <nav className="flex flex-1 flex-col gap-1.5 px-3 py-4" aria-label="Admin">
      {NAV_ITEMS.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            onClick={() => {
              if (!active) navigation?.startNavigation();
              onNavigate?.();
            }}
            className={
              active
                ? "flex items-center gap-3 rounded-xl bg-(--admin-accent-soft) px-3 py-2.5 text-sm text-(--admin-accent-text) ring-1 ring-(--admin-accent)/25 transition"
                : "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-(--admin-text-muted) transition hover:bg-(--admin-btn-secondary-hover) hover:text-(--admin-text)"
            }
          >
            <Icon
              className={
                active
                  ? "h-6 w-6 shrink-0 text-(--admin-accent-text)"
                  : "h-6 w-6 shrink-0 text-(--admin-text-muted)"
              }
            />
            {expanded ? (
              <span className="min-w-0 overflow-hidden">
                <span className="block truncate font-medium">{item.label}</span>
                <span className="mt-0.5 block truncate text-xs text-(--admin-text-muted)">
                  {item.description}
                </span>
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBrand({ expanded }: { expanded: boolean }) {
  return (
    <div className="border-b border-(--admin-border) px-4 py-5">
      <p className="text-[11px] font-semibold tracking-[0.28em] text-(--admin-accent-text) uppercase">
        GCAP
      </p>
      {expanded ? (
        <p className="mt-1.5 text-base font-semibold tracking-tight text-(--admin-text)">
          Admin
        </p>
      ) : null}
    </div>
  );
}

function SidebarPanel({
  pathname,
  expanded,
  onToggleExpand,
  onNavigate,
}: {
  pathname: string;
  expanded: boolean;
  onToggleExpand: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div
      className={
        expanded
          ? "flex h-full w-64 flex-col"
          : "flex h-full w-16 flex-col"
      }
    >
      <SidebarBrand expanded={expanded} />
      <SidebarNav
        pathname={pathname}
        expanded={expanded}
        onNavigate={onNavigate}
      />
      <div className="border-t border-(--admin-border) p-3">
        <SidebarToggleControl
          expanded={expanded}
          onToggle={onToggleExpand}
          compact={!expanded}
        />
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/hub";
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const section = sectionMeta(pathname);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (stored === "0") setExpanded(false);
      if (stored === "1") setExpanded(true);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const toggleExpanded = () => {
    setExpanded((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className="app-atmosphere flex min-h-screen text-(--admin-text)">
      <aside
        className={
          expanded
            ? "glass-sidebar sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-(--admin-border) transition-[width] duration-200 ease-out lg:flex"
            : "glass-sidebar sticky top-0 hidden h-screen w-16 shrink-0 flex-col overflow-hidden border-r border-(--admin-border) transition-[width] duration-200 ease-out lg:flex"
        }
      >
        <SidebarPanel
          pathname={pathname}
          expanded={expanded}
          onToggleExpand={toggleExpanded}
        />
      </aside>

      <div
        className={
          mobileOpen
            ? "fixed inset-0 z-40 lg:hidden"
            : "pointer-events-none fixed inset-0 z-40 lg:hidden"
        }
      >
        <button
          type="button"
          aria-label="Close menu"
          className={
            mobileOpen
              ? "absolute inset-0 bg-(--admin-overlay) backdrop-blur-[2px] transition-opacity"
              : "absolute inset-0 bg-transparent opacity-0"
          }
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={
            mobileOpen
              ? "glass-sidebar absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-(--admin-border) shadow-2xl transition-transform duration-200"
              : "glass-sidebar absolute inset-y-0 left-0 flex w-72 max-w-[85vw] -translate-x-full flex-col border-r border-(--admin-border) transition-transform duration-200"
          }
        >
          <SidebarPanel
            pathname={pathname}
            expanded
            onToggleExpand={() => setMobileOpen(false)}
            onNavigate={() => setMobileOpen(false)}
          />
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass-menubar sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-(--admin-border) px-4 sm:px-6">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-(--admin-border) px-3 text-sm text-(--admin-text-secondary) transition hover:bg-(--admin-btn-secondary-hover) hover:text-(--admin-text) lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <MenuIcon className="h-4 w-4 shrink-0" />
            <span>Menu</span>
          </button>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 truncate text-sm font-semibold tracking-tight text-(--admin-text)">
              <section.icon className="h-4 w-4 shrink-0 text-(--admin-accent-text)" />
              <span className="truncate">{section.label}</span>
            </p>
            <p className="truncate text-xs text-(--admin-text-muted)">
              {section.description}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-7 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
