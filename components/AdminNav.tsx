import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

const PAGE_TITLES = {
  hub: "Hub",
  analytics: "Calculator Analytics",
  notifications: "Notification",
} as const;

export function AdminNav({
  current = "hub",
  showBackToHub = current !== "hub",
}: {
  current?: keyof typeof PAGE_TITLES;
  showBackToHub?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {showBackToHub ? (
          <Link
            href="/hub"
            className="text-sm text-slate-400 hover:text-slate-200"
          >
            ← Hub
          </Link>
        ) : null}
        <p className="text-sm font-medium text-slate-200">
          {PAGE_TITLES[current]}
        </p>
      </div>
      <LogoutButton />
    </div>
  );
}
