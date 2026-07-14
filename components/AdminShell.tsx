"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { LogoutButton } from "@/components/LogoutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  AdminToolbarProvider,
  AdminToolbarSlot,
} from "@/components/AdminToolbar";
import { PageEnter } from "@/components/PageEnter";
import { PostLoginEnter } from "@/components/PostLoginEnter";
import { useNavigationLoading } from "@/components/NavigationLoadingProvider";
import {
  BellIcon,
  ChartIcon,
  HubIcon,
  MenuIcon,
  PanelIcon,
} from "@/components/icons";
import { btnChrome, btnChromeIcon, btnSecondary } from "@/lib/button-styles";

const SIDEBAR_STORAGE_KEY = "gcap-admin-sidebar-expanded";

const NAV_ITEMS = [
  {
    href: "/hub",
    label: "Dashboard",
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
  label,
}: {
  expanded: boolean;
  onToggle: () => void;
  compact?: boolean;
  label?: string;
}) {
  const text =
    label ?? (expanded ? "Collapse" : "Expand");
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={text}
      aria-expanded={expanded}
      title={text}
      className={compact ? btnChromeIcon : `${btnSecondary} h-9 w-full text-xs`}
    >
      <PanelIcon className="h-4 w-4 shrink-0" />
      {!compact ? <span>{text}</span> : null}
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

function SidebarBrand({
  expanded,
  onToggleExpand,
  toggleLabel,
}: {
  expanded: boolean;
  onToggleExpand: () => void;
  toggleLabel?: string;
}) {
  return (
    <div className="border-b border-(--admin-border)">
      <div className="px-3 pt-3 pb-2">
        <SidebarToggleControl
          expanded={expanded}
          onToggle={onToggleExpand}
          compact={!expanded}
          label={toggleLabel}
        />
      </div>
      <div className={expanded ? "px-4 pb-4" : "flex justify-center px-3 pb-3"}>
        {expanded ? (
          <p className="flex items-baseline gap-2.5">
            <span className="text-xs font-semibold tracking-[0.28em] text-(--admin-accent-text) uppercase">
              GCAP
            </span>
            <span className="text-lg font-semibold tracking-tight text-(--admin-text)">
              Admin
            </span>
          </p>
        ) : (
          <p className="text-xs font-semibold tracking-[0.28em] text-(--admin-accent-text) uppercase">
            GCAP
          </p>
        )}
      </div>
    </div>
  );
}

function SidebarFooter({ expanded }: { expanded: boolean }) {
  return (
    <div className="space-y-2 border-t border-(--admin-border) p-3">
      <ThemeToggle
        compact={!expanded}
        className={expanded ? `${btnSecondary} h-9 w-full` : btnChromeIcon}
      />
      <LogoutButton
        compact={!expanded}
        className={expanded ? `${btnSecondary} h-9 w-full` : btnChromeIcon}
      />
    </div>
  );
}

function SidebarPanel({
  pathname,
  expanded,
  onToggleExpand,
  onNavigate,
  toggleLabel,
}: {
  pathname: string;
  expanded: boolean;
  onToggleExpand: () => void;
  onNavigate?: () => void;
  toggleLabel?: string;
}) {
  return (
    <div
      className={
        expanded
          ? "flex h-full w-64 flex-col"
          : "flex h-full w-16 flex-col"
      }
    >
      <SidebarBrand
        expanded={expanded}
        onToggleExpand={onToggleExpand}
        toggleLabel={toggleLabel}
      />
      <SidebarNav
        pathname={pathname}
        expanded={expanded}
        onNavigate={onNavigate}
      />
      <SidebarFooter expanded={expanded} />
    </div>
  );
}

function AdminShellFrame({ children }: { children: ReactNode }) {
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
            toggleLabel="Close"
          />
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass-menubar sticky top-0 z-30 border-b border-(--admin-border)">
          <div className="relative flex min-h-14 w-full items-center py-2">
            <div className="z-10 flex min-w-0 items-center gap-3 pl-3 sm:pl-4">
              <button
                type="button"
                className={`${btnChrome} lg:hidden`}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((open) => !open)}
              >
                <MenuIcon className="h-4 w-4 shrink-0" />
                <span>Menu</span>
              </button>
              <p className="flex min-w-0 items-center gap-3 truncate text-left text-2xl font-semibold tracking-tight text-(--admin-text)">
                <section.icon className="h-7 w-7 shrink-0 text-(--admin-accent-text)" />
                <span className="truncate">{section.label}</span>
              </p>
            </div>

            {/* Match main content right edge: max-w + horizontal padding */}
            <div className="pointer-events-none absolute inset-0 mx-auto flex w-full max-w-[1600px] items-center justify-end px-4 sm:px-6 lg:px-8">
              <div className="pointer-events-auto">
                <AdminToolbarSlot />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-7 sm:px-6 lg:px-8">
          <PostLoginEnter>
            <PageEnter pathname={pathname}>{children}</PageEnter>
          </PostLoginEnter>
        </main>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminToolbarProvider>
      <AdminShellFrame>{children}</AdminShellFrame>
    </AdminToolbarProvider>
  );
}
