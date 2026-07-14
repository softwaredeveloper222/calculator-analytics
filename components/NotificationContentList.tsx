"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { NotificationListItem } from "@/lib/notifications";
import type { PaginationMeta } from "@/lib/pagination";
import { AdminToolbarActions } from "@/components/AdminToolbar";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useNavigationLoading } from "@/components/NavigationLoadingProvider";
import { Pagination } from "@/components/Pagination";
import {
  btnDangerSm,
  btnPrimary,
  btnPrimarySm,
  btnSecondarySm,
  btnSegmentActive,
  btnSegmentIdle,
} from "@/lib/button-styles";
import {
  PencilIcon,
  PlusIcon,
  SendIcon,
  TrashIcon,
} from "@/components/icons";

type ListData = {
  pages: NotificationListItem[];
  pagination: PaginationMeta;
};

type NotificationContentListProps = {
  initialData: ListData;
};

const PAGE_SIZES = [10, 25, 50] as const;

function byMostRecentlyEdited(items: NotificationListItem[]) {
  return [...items].sort((a, b) => {
    const byUpdated =
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    if (byUpdated !== 0) return byUpdated;
    return b.id.localeCompare(a.id);
  });
}

export function NotificationContentList({
  initialData,
}: NotificationContentListProps) {
  const router = useRouter();
  const navigation = useNavigationLoading();
  const beginProgress = navigation?.beginProgress;
  const endProgress = navigation?.endProgress;
  const [pages, setPages] = useState(() =>
    byMostRecentlyEdited(initialData.pages),
  );
  const [pagination, setPagination] = useState(initialData.pagination);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const applyListData = useCallback((data: ListData) => {
    setPages(byMostRecentlyEdited(data.pages));
    setPagination(data.pagination);
  }, []);

  const loadPage = useCallback(
    async (page: number, pageSize: number) => {
      setLoading(true);
      beginProgress?.();
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
        });
        const response = await fetch(`/api/notifications/pages?${params}`);
        const data = (await response.json().catch(() => null)) as ListData | null;
        if (!response.ok || !data?.pages || !data.pagination) return;

        applyListData(data);
      } finally {
        endProgress?.();
        setLoading(false);
      }
    },
    [applyListData, beginProgress, endProgress],
  );

  const handleCreate = useCallback(async () => {
    if (creating || leaving) return;

    setCreating(true);
    setError(null);
    setStatus(null);
    beginProgress?.();

    try {
      const response = await fetch("/api/notifications/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.id) {
        endProgress?.();
        setError(data?.error ?? "Failed to create content");
        setCreating(false);
        return;
      }

      const href = `/notifications/${data.id}`;
      setLeaving(true);
      navigation?.startNavigation();
      router.prefetch(href);

      // Brief exit beat so the editor rise feels continuous.
      await new Promise((resolve) => window.setTimeout(resolve, 220));
      router.push(href);
    } catch {
      endProgress?.();
      setLeaving(false);
      setError("Unable to reach the server");
      setCreating(false);
    }
  }, [router, creating, leaving, beginProgress, endProgress, navigation]);

  const handleDelete = async (id: string) => {
    setBusyId(id);
    setError(null);
    setStatus(null);
    setPendingDeleteId(null);
    try {
      const response = await fetch(`/api/notifications/pages/${id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? "Failed to delete content");
        return;
      }

      await loadPage(pagination.page, pagination.pageSize);
      setStatus("Content deleted.");
      router.refresh();
    } catch {
      setError("Unable to reach the server");
    } finally {
      setBusyId(null);
    }
  };

  const handleNotify = async (id: string) => {
    setBusyId(id);
    setError(null);
    setStatus(null);
    try {
      const response = await fetch(`/api/notifications/pages/${id}/notify`, {
        method: "POST",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? "Failed to notify");
        return;
      }
      // Notify bumps updatedAt — jump to page 1 so it appears first.
      await loadPage(1, pagination.pageSize);
      setStatus(data?.message ?? "Notification published.");
      if (data?.warning) setError(data.warning);
      router.refresh();
    } catch {
      setError("Unable to reach the server");
    } finally {
      setBusyId(null);
    }
  };

  const busy = loading || creating || leaving || busyId !== null;
  const total = pagination.totalEvents;
  const empty = total === 0 && pages.length === 0 && !loading;

  return (
    <div className={`space-y-4 ${leaving ? "page-exit" : ""}`}>
      <AdminToolbarActions>
        <button
          type="button"
          onClick={() => void handleCreate()}
          disabled={creating || leaving}
          className={btnPrimary}
        >
          <PlusIcon className="h-4 w-4 shrink-0" />
          {creating || leaving ? "Creating…" : "Create content"}
        </button>
      </AdminToolbarActions>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-(--admin-text-muted)">
          {total} content{total === 1 ? "" : "s"}
        </p>

        {!empty ? (
          <div className="flex flex-wrap items-center gap-2 text-sm text-(--admin-text-muted)">
            <span>Rows per page:</span>
            {PAGE_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                disabled={busy}
                onClick={() => void loadPage(1, size)}
                className={
                  pagination.pageSize === size
                    ? btnSegmentActive
                    : btnSegmentIdle
                }
              >
                {size}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {status ? <p className="text-sm text-emerald-600">{status}</p> : null}
      {error ? (
        <p className="text-sm text-rose-600" role="alert">
          {error}
        </p>
      ) : null}

      {empty ? (
        <div className="rounded-2xl border-2 border-(--admin-border-strong) bg-(--admin-panel) p-8 text-center shadow-sm">
          <p className="text-sm text-(--admin-text-muted)">
            No notification content yet. Create your first page to get started.
          </p>
        </div>
      ) : (
        <>
          <ul className="space-y-3" aria-busy={loading}>
            {pages.map((page) => {
              const rowBusy = busyId === page.id;
              return (
                <li
                  key={page.id}
                  className="flex flex-col gap-4 rounded-2xl border-2 border-(--admin-border-strong) bg-(--admin-panel) p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <h2 className="truncate text-base font-semibold text-(--admin-text)">
                      {page.title}
                    </h2>
                    <p className="truncate text-sm text-(--admin-text-muted)">
                      {[page.eventName, page.dateLabel]
                        .filter(Boolean)
                        .join(" · ") ||
                        page.subtitle ||
                        "No event details yet"}
                    </p>
                    <p className="text-xs text-(--admin-text-muted)">
                      v{page.version}
                      {page.publishedAt
                        ? ` · Published ${new Date(page.publishedAt).toUTCString()}`
                        : " · Draft"}
                      {` · ${page.imageCount} image${page.imageCount === 1 ? "" : "s"}`}
                      {` · Updated ${new Date(page.updatedAt).toUTCString()}`}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/notifications/${page.id}`}
                      className={btnSecondarySm}
                    >
                      <PencilIcon className="h-3.5 w-3.5 shrink-0" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      disabled={rowBusy || loading}
                      onClick={() => handleNotify(page.id)}
                      className={btnPrimarySm}
                    >
                      <SendIcon className="h-3.5 w-3.5 shrink-0" />
                      {rowBusy ? "Working…" : "Notify"}
                    </button>
                    <button
                      type="button"
                      disabled={rowBusy || loading}
                      onClick={() => setPendingDeleteId(page.id)}
                      className={btnDangerSm}
                    >
                      <TrashIcon className="h-3.5 w-3.5 shrink-0" />
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <Pagination
            pagination={pagination}
            disabled={busy}
            itemLabel="contents"
            onPageChange={(page) => void loadPage(page, pagination.pageSize)}
          />
        </>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete this content?"
        description="This removes the page from the CMS. This cannot be undone."
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId !== null) void handleDelete(pendingDeleteId);
        }}
      />
    </div>
  );
}
