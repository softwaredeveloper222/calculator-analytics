export function PageLoadingSpinner({
  label = "Loading…",
  fullScreen = true,
}: {
  label?: string;
  fullScreen?: boolean;
}) {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-[100] flex items-center justify-center bg-(--admin-overlay) backdrop-blur-sm"
          : "flex min-h-48 w-full flex-col items-center justify-center gap-3 p-10"
      }
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div
        className={
          fullScreen
            ? "flex flex-col items-center gap-3 rounded-2xl border border-(--admin-border) bg-(--admin-panel) px-8 py-6 text-(--admin-text) shadow-2xl"
            : "flex flex-col items-center gap-3 text-(--admin-text)"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          className="h-8 w-8 animate-spin text-(--admin-accent)"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="2.5"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-sm text-(--admin-text-secondary)">{label}</p>
      </div>
    </div>
  );
}
