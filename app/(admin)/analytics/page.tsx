import Link from "next/link";
import type { ReactNode } from "react";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { AnalyticsRefreshProvider } from "@/components/AnalyticsRefreshProvider";
import { EventHistoryPanel } from "@/components/EventHistoryPanel";
import { RefreshButton } from "@/components/RefreshButton";
import { SuspendedSection } from "@/components/SuspendedSection";
import { ChartIcon } from "@/components/icons";
import { getAnalyticsOverview, getEventHistory } from "@/lib/analytics-queries";

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  return (
    <AnalyticsRefreshProvider>
      <div className="space-y-6">
        <AdminPageHeader
          title="Analytics"
          description="Live data from the mobile app. Use pagination below to browse past events."
          actions={<RefreshButton />}
          icon={ChartIcon}
        />
        <SuspendedSection fallbackLabel="Loading analytics…">
          <AnalyticsBody />
        </SuspendedSection>
      </div>
    </AnalyticsRefreshProvider>
  );
}

async function AnalyticsBody() {
  try {
    const [overview, history] = await Promise.all([
      getAnalyticsOverview(),
      getEventHistory(),
    ]);

    return (
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total events (30d)" value={overview.totalEvents} />
          <StatCard label="Unique devices" value={overview.uniqueDevices} />
          <StatCard
            label="Calculator opens"
            value={
              overview.eventsByType.find((e) => e.event === "calculator_opened")
                ?.count ?? 0
            }
          />
          <StatCard
            label="Calculations"
            value={
              overview.eventsByType.find(
                (e) => e.event === "calculator_calculation",
              )?.count ?? 0
            }
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Panel title="Devices">
            {overview.devices.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="space-y-2">
                {overview.devices.map((device) => (
                  <li
                    key={device.deviceId}
                    className="rounded-lg bg-(--admin-inset) px-3 py-2 text-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-(--admin-text)">
                        {device.label}
                      </span>
                      <span className="text-(--admin-accent-text)">
                        {device.eventCount} events
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-(--admin-text-muted)">
                      Android {device.osVersion ?? "?"} ·{" "}
                      {device.deviceId.slice(0, 8)}…
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Opens by calculator">
            {overview.opensByCalculator.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="space-y-2">
                {overview.opensByCalculator.map((row) => (
                  <li
                    key={row.calculatorId}
                    className="flex items-center justify-between rounded-lg bg-(--admin-inset) px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-(--admin-text)">
                      {row.calculatorId}
                    </span>
                    <span className="text-(--admin-accent-text)">{row.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </section>

        <Panel title="Event history">
          <EventHistoryPanel
            initialData={{
              events: history.events,
              pagination: history.pagination,
            }}
          />
        </Panel>
      </div>
    );
  } catch (error) {
    console.error("Dashboard failed to load analytics:", error);
    return <DatabaseUnavailableInline />;
  }
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-panel rounded-2xl p-4 transition hover:border-(--admin-border-strong)">
      <p className="text-xs font-medium tracking-wide text-(--admin-text-muted) uppercase">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-(--admin-text)">
        {value}
      </p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="glass-panel rounded-2xl p-5">
      <h2 className="mb-4 text-sm font-semibold tracking-tight text-(--admin-text)">
        {title}
      </h2>
      {children}
    </section>
  );
}

function EmptyState() {
  return (
    <p className="text-sm text-(--admin-text-muted)">
      No events yet. Open Calculators in the app, tap Calculate, then refresh
      this page.
    </p>
  );
}

function DatabaseUnavailableInline() {
  return (
    <section className="glass-panel rounded-2xl border-rose-500/30 p-5 text-sm text-(--admin-text-secondary)">
      <p className="font-medium text-rose-600">Could not load analytics</p>
      <p className="mt-2 text-(--admin-text-muted)">
        The dashboard could not connect to Supabase. VPN and pool timeouts are
        the usual cause locally.
      </p>
      <Link
        href="/api/health"
        className="mt-4 inline-block text-(--admin-accent-text) hover:underline"
      >
        Check API health →
      </Link>
    </section>
  );
}
