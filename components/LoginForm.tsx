"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useNavigationLoading } from "@/components/NavigationLoadingProvider";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm text-slate-300">
          Username
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm text-slate-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
          required
        />
      </div>

      {error ? (
        <p className="text-sm text-rose-300" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
