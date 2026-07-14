import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getServerSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/hub");
  }

  return (
    <div className="app-atmosphere relative flex min-h-screen text-(--admin-text)">
      <div className="app-grid pointer-events-none absolute inset-0" aria-hidden />

      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="login-brand-enter flex flex-col justify-between px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
          <div>
            <p className="text-sm font-medium tracking-[0.28em] text-(--admin-accent-text) uppercase">
              GCAP
            </p>
            <h1 className="mt-5 max-w-md text-4xl font-semibold tracking-tight text-(--admin-text) sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Admin
            </h1>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-(--admin-text-secondary)">
              Safety Days content and calculator analytics in one place.
            </p>
          </div>

          <ul className="mt-12 hidden gap-8 text-sm text-(--admin-text-muted) lg:flex">
            <li className="max-w-[11rem]">
              <span className="block font-medium text-(--admin-text-secondary)">
                Notify
              </span>
              Publish Content updates to mobile
            </li>
            <li className="max-w-[11rem]">
              <span className="block font-medium text-(--admin-text-secondary)">
                Measure
              </span>
              Track calculator opens and devices
            </li>
          </ul>
        </section>

        <section className="flex items-center px-4 pb-10 sm:px-8 lg:px-10 lg:py-16">
          <div className="glass-panel login-panel-enter w-full rounded-2xl p-6 sm:p-8">
            <div className="mb-7 space-y-2">
              <h2 className="text-xl font-semibold tracking-tight text-(--admin-text)">
                Sign in
              </h2>
              <p className="text-sm text-(--admin-text-muted)">
                Use your admin credentials to continue.
              </p>
            </div>

            <Suspense
              fallback={
                <p className="text-sm text-(--admin-text-muted)">Loading form…</p>
              }
            >
              <LoginForm />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
}
