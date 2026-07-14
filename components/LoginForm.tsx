"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useNavigationLoading } from "@/components/NavigationLoadingProvider";
import { LoginIcon } from "@/components/icons";
import { btnPrimaryBlock } from "@/lib/button-styles";

const fieldClass =
  "w-full rounded-lg border border-(--admin-border) bg-(--admin-input-bg) px-3.5 py-3 text-sm text-(--admin-text) outline-none transition placeholder:text-(--admin-text-muted) focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/20";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const navigation = useNavigationLoading();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(data?.error ?? "Login failed");
        return;
      }

      const next = searchParams.get("next");
      navigation?.startNavigation();
      router.replace(next && next.startsWith("/") ? next : "/hub");
      router.refresh();
    } catch {
      setError("Unable to reach the server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="block text-xs font-medium tracking-wide text-(--admin-text-muted) uppercase"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className={fieldClass}
          placeholder="Admin username"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-xs font-medium tracking-wide text-(--admin-text-muted) uppercase"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={fieldClass}
          placeholder="••••••••"
          required
        />
      </div>

      {error ? (
        <div
          className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-700"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`group relative overflow-hidden ${btnPrimaryBlock} py-3 font-semibold`}
      >
        <span className="relative z-10 inline-flex items-center gap-2">
          <LoginIcon className="h-4 w-4 shrink-0" />
          {isSubmitting ? "Signing in…" : "Sign in"}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition duration-700 group-hover:translate-x-full"
        />
      </button>
    </form>
  );
}
