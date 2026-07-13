"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useNavigationLoading } from "@/components/NavigationLoadingProvider";

export function LogoutButton() {
  const router = useRouter();
  const navigation = useNavigationLoading();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      navigation?.startNavigation();
      router.replace("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-900 disabled:opacity-50"
    >
      {isLoggingOut ? "Signing out…" : "Sign out"}
    </button>
  );
}
