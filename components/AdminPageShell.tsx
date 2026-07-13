import { Suspense, type ReactNode } from "react";
import { AdminNav } from "@/components/AdminNav";
import { PageLoadingSpinner } from "@/components/PageLoadingSpinner";

export function AdminPageShell({
  current,
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  current: "hub" | "analytics" | "notifications";
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
        <AdminNav current={current} />
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">
              {eyebrow}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            {description ? (
              <p className="text-sm text-slate-400">{description}</p>
            ) : null}
          </div>
          {actions}
        </header>
        {children}
      </main>
    </div>
  );
}

export function PageLoadingFallback({ label }: { label: string }) {
  return (
    <div className="relative min-h-64 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <PageLoadingSpinner label={label} fullScreen={false} />
    </div>
  );
}

export function SuspendedSection({
  fallbackLabel,
  children,
}: {
  fallbackLabel: string;
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<PageLoadingFallback label={fallbackLabel} />}>
      {children}
    </Suspense>
  );
}
