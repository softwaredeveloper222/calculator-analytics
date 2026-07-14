"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { NotificationListItem } from "@/lib/notifications";
import { AdminToolbarActions } from "@/components/AdminToolbar";
import {
  btnDangerSm,
  btnPrimary,
  btnPrimarySm,
  btnSecondarySm,
} from "@/lib/button-styles";
import {
  PencilIcon,
  PlusIcon,
  SendIcon,
  TrashIcon,
} from "@/components/icons";

type NotificationContentListProps = {
  initialPages: NotificationListItem[];
};

export function NotificationContentList({
  initialPages,
}: NotificationContentListProps) {
  const router = useRouter();
  const [pages, setPages] = useState(initialPages);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const refresh = async () => {
    const response = await fetch("/api/notifications/pages");
    const data = await response.json().catch(() => null);
    if (response.ok && Array.isArray(data?.pages)) {
      setPages(data.pages);
    }
  };

  const handleCreate = useCallback(async () => {
    setCreating(true);
    setError(null);
    setStatus(null);
    try {
      const response = await fetch("/api/notifications/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled notification", bullets: [] }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? "Failed to create content");
        return;
      }
      router.push(`/notifications/${data.id}`);
      router.refresh();
    } catch {
      setError("Unable to reach the server");
    } finally {
      setCreating(false);
    }
  }, [router]);

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
      setPages((current) => current.filter((page) => page.id !== id));
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
      await refresh();
      setStatus(data?.message ?? "Notification published.");
      if (data?.warning) setError(data.warning);
      router.refresh();
    } catch {
      setError("Unable to reach the server");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <AdminToolbarActions>
        <button
          type="button"
          onClick={handleCreate}
          disabled={creating}
          className={btnPrimary}
        >
          <PlusIcon className="h-4 w-4 shrink-0" />
          {creating ? "Creating…" : "Create content"}
        </button>
      </AdminToolbarActions>

      <p className="text-sm text-(--admin-text-muted)">
        {pages.length} content{pages.length === 1 ? "" : "s"}
      </p>

      {status ? <p className="text-sm text-emerald-600">{status}</p> : null}
      {error ? (
        <p className="text-sm text-rose-600" role="alert">
          {error}
        </p>
      ) : null}

      {pages.length === 0 ? (
        <div className="rounded-2xl border-2 border-(--admin-border-strong) bg-(--admin-panel) p-8 text-center shadow-sm">
          <p className="text-sm text-(--admin-text-muted)">
            No notification content yet. Create your first page to get started.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {pages.map((page) => {
            const busy = busyId === page.id;
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
                    {[page.eventName, page.dateLabel].filter(Boolean).join(" · ") ||
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
                    disabled={busy}
                    onClick={() => handleNotify(page.id)}
                    className={btnPrimarySm}
                  >
                    <SendIcon className="h-3.5 w-3.5 shrink-0" />
                    {busy ? "Working…" : "Notify"}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
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
      )}

      {pendingDeleteId !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onClick={() => setPendingDeleteId(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-content-title"
            className="w-full max-w-sm rounded-xl border border-(--admin-border) bg-(--admin-panel) p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p
              id="delete-content-title"
              className="text-base font-medium text-(--admin-text)"
            >
              Delete this content?
            </p>
            <p className="mt-2 text-sm text-(--admin-text-muted)">
              This removes the page from the CMS. This cannot be undone.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPendingDeleteId(null)}
                className={btnSecondarySm + " w-full justify-center"}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => handleDelete(pendingDeleteId)}
                className={btnDangerSm + " w-full justify-center"}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
