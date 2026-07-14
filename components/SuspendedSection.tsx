import { Suspense, type ReactNode } from "react";
import { PageLoadingSpinner } from "@/components/PageLoadingSpinner";

export function PageLoadingFallback({ label }: { label: string }) {
  return (
    <div className="relative min-h-64 overflow-hidden rounded-xl border border-(--admin-border) bg-(--admin-panel)">
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
