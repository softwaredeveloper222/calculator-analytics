"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useNavigationLoading } from "@/components/NavigationLoadingProvider";
import { LogoutIcon } from "@/components/icons";
import { btnSecondarySm } from "@/lib/button-styles";

export function LogoutButton({
  className,
}: {
  className?: string;
}) {
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
      className={className || btnSecondarySm}
    >
      <LogoutIcon className="h-4 w-4 shrink-0" />
      <span>{isLoggingOut ? "Signing out…" : "Sign out"}</span>
    </button>
  );
}
