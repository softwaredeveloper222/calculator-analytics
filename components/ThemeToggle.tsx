"use client";

import { useTheme } from "@/components/ThemeProvider";
import { MoonIcon, SunIcon } from "@/components/icons";

export function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={
        className ||
        "inline-flex h-9 items-center gap-2 rounded-xl border border-(--admin-border) px-3 text-sm text-(--admin-text-secondary) transition hover:bg-(--admin-btn-secondary-hover) hover:text-(--admin-text)"
      }
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
    >
      {isDark ? (
        <SunIcon className="h-4 w-4 shrink-0" />
      ) : (
        <MoonIcon className="h-4 w-4 shrink-0" />
      )}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
