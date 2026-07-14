/** Shared admin button styles — use these everywhere for consistent CTAs. */

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

export const btnPrimary = `${base} bg-(--admin-accent) px-4 py-2 text-white shadow-sm hover:brightness-110`;

export const btnSecondary = `${base} border border-(--admin-border) px-4 py-2 text-(--admin-text-secondary) hover:bg-(--admin-btn-secondary-hover) hover:text-(--admin-text)`;

export const btnDanger = `${base} bg-rose-600 px-4 py-2 text-white shadow-sm hover:bg-rose-500`;

export const btnPrimarySm = `${base} bg-(--admin-accent) px-3 py-1.5 text-white shadow-sm hover:brightness-110`;

export const btnSecondarySm = `${base} border border-(--admin-border) px-3 py-1.5 text-(--admin-text-secondary) hover:bg-(--admin-btn-secondary-hover) hover:text-(--admin-text)`;

export const btnDangerSm = `${base} bg-rose-600 px-3 py-1.5 text-white shadow-sm hover:bg-rose-500`;

export const btnPrimaryBlock = `${btnPrimary} w-full`;

export const btnSecondaryBlock = `${btnSecondary} w-full`;

export const btnDangerBlock = `${btnDanger} w-full`;

/** Square / chrome controls in the shell (icon toggle, menu, theme). */
export const btnChrome = `${base} h-9 border border-(--admin-border) px-3 text-(--admin-text-secondary) hover:bg-(--admin-btn-secondary-hover) hover:text-(--admin-text)`;

export const btnChromeIcon = `${base} h-9 w-9 border border-(--admin-border) p-0 text-(--admin-text-secondary) hover:bg-(--admin-btn-secondary-hover) hover:text-(--admin-text)`;

/** Segmented / pager selected state. */
export const btnSegmentActive = `${base} bg-(--admin-accent) px-3 py-2 text-white shadow-sm`;

export const btnSegmentIdle = `${base} border border-(--admin-border) px-3 py-2 text-(--admin-text-secondary) hover:bg-(--admin-btn-secondary-hover)`;
