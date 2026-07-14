import Link from "next/link";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import {
  ArrowRightIcon,
  BellIcon,
  ChartIcon,
  WorkspaceIcon,
} from "@/components/icons";

export default function HubPage() {
  return (
    <div>
      <AdminPageHeader
        eyebrow="Workspace"
        title="Choose where to work"
        description="Jump into Safety Days publishing or calculator usage analytics."
        icon={WorkspaceIcon}
      />

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href="/notifications"
          className="glass-panel group relative overflow-hidden rounded-2xl p-6 transition duration-200 hover:-translate-y-0.5 hover:border-(--admin-accent)/40"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-(--admin-accent-soft) transition"
          />
          <h2 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-(--admin-text)">
            <BellIcon className="h-7 w-7 shrink-0 text-(--admin-accent-text)" />
            Notification
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-(--admin-text-muted)">
            Edit content and notify the mobile app when updates are ready.
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-(--admin-accent-text) transition group-hover:gap-2.5">
            <ArrowRightIcon className="h-4 w-4" />
            Open
          </span>
        </Link>

        <Link
          href="/analytics"
          className="glass-panel group relative overflow-hidden rounded-2xl p-6 transition duration-200 hover:-translate-y-0.5 hover:border-(--admin-accent)/40"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-cyan-500/10 transition"
          />
          <h2 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-(--admin-text)">
            <ChartIcon className="h-7 w-7 shrink-0 text-(--admin-accent-text)" />
            Analytics
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-(--admin-text-muted)">
            Review calculator opens, devices, and event history from the Android
            app.
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-(--admin-accent-text) transition group-hover:gap-2.5">
            <ArrowRightIcon className="h-4 w-4" />
            Open
          </span>
        </Link>
      </section>
    </div>
  );
}
