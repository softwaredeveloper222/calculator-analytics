import Link from "next/link";
import type { ReactNode } from "react";
import {
  AdminPageShell,
  SuspendedSection,
} from "@/components/AdminPageShell";
import { AnalyticsRefreshProvider } from "@/components/AnalyticsRefreshProvider";
import { EventHistoryPanel } from "@/components/EventHistoryPanel";
import { RefreshButton } from "@/components/RefreshButton";
import { getAnalyticsOverview, getEventHistory } from "@/lib/analytics-queries";

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  return (
    <AnalyticsRefreshProvider>
      <AdminPageShell
        current="analytics"
        eyebrow="GCAP Calculator Analytics"
        title="Usage Dashboard"
        description="Live data from the mobile app. Use pagination below to browse past events."
        actions={<RefreshButton />}
      >
        <SuspendedSection fallbackLabel="Loading analytics…">
          <AnalyticsBody />
        </SuspendedSection>
      </AdminPageShell>
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
      <>
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
                    className="rounded-lg bg-slate-950 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-slate-200">
                        {device.label}
                      </span>
                      <span className="text-indigo-300">
                        {device.eventCount} events
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
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
                    className="flex items-center justify-between rounded-lg bg-slate-950 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-slate-200">
                      {row.calculatorId}
                    </span>
                    <span className="text-indigo-300">{row.count}</span>
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
      </>
    );
  } catch (error) {
    console.error("Dashboard failed to load analytics:", error);
    return <DatabaseUnavailableInline />;
  }
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
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
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function EmptyState() {
  return (
    <p className="text-sm text-slate-500">
      No events yet. Open Calculators in the app, tap Calculate, then refresh
      this page.
    </p>
  );
}

function DatabaseUnavailableInline() {
  return (
    <section className="rounded-2xl border border-rose-500/30 bg-slate-900 p-6 text-sm text-slate-300">
      <p className="font-medium text-rose-300">Could not load analytics</p>
      <p className="mt-2 text-slate-400">
        The dashboard could not connect to Supabase. VPN and pool timeouts are
        the usual cause locally.
      </p>
      <Link
        href="/api/health"
        className="mt-4 inline-block text-indigo-300 hover:underline"
      >
        Check API health →
      </Link>
    </section>
  );
}
