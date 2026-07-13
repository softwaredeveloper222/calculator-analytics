import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { getServerSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/hub");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">
            GCAP Admin
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-slate-400">
            Manage Safety Days notifications and calculator analytics.
          </p>
        </div>

        <Suspense fallback={<p className="text-sm text-slate-400">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
