"use client";

import { AdminToolbarActions } from "@/components/AdminToolbar";
import { RefreshButton } from "@/components/RefreshButton";

/** Puts Analytics refresh controls into the top menubar. */
export function AnalyticsToolbar() {
  return (
    <AdminToolbarActions>
      <RefreshButton />
    </AdminToolbarActions>
  );
}
