import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

function HubBackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AdminNav({
  current = "hub",
  showBackToHub = current !== "hub",
}: {
  current?: "hub" | "analytics" | "notifications";
  showBackToHub?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center">
        {showBackToHub ? (
          <Link
            href="/hub"
            aria-label="Back to Hub"
            title="Back to Hub"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
          >
            <HubBackIcon />
          </Link>
        ) : (
          <span className="h-9" aria-hidden="true" />
        )}
      </div>
      <LogoutButton />
    </div>
  );
}
