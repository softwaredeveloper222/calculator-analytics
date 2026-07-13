import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";

export default function HubPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
        <header className="space-y-4">
          <AdminNav current="hub" />
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">
              GCAP Admin
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Choose a workspace
            </h1>
            <p className="text-sm text-slate-400">
              Manage Safety Days notifications or review calculator usage
              analytics.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <Link
            href="/notifications"
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-indigo-400/60 hover:bg-slate-900/80"
          >
            <p className="text-sm uppercase tracking-[0.18em] text-indigo-300">
              Notification
            </p>
            <h2 className="mt-3 text-xl font-semibold">Safety Days CMS</h2>
            <p className="mt-2 text-sm text-slate-400">
              Edit Ammonia Safety Day content and notify the mobile app when
              updates are ready.
            </p>
          </Link>

          <Link
            href="/analytics"
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-indigo-400/60 hover:bg-slate-900/80"
          >
            <p className="text-sm uppercase tracking-[0.18em] text-indigo-300">
              Calculator Analytics
            </p>
            <h2 className="mt-3 text-xl font-semibold">Usage Dashboard</h2>
            <p className="mt-2 text-sm text-slate-400">
              Review calculator opens, devices, and event history from the
              Android app.
            </p>
          </Link>
        </section>
      </main>
    </div>
  );
}
