"use client";

import type { ReactNode } from "react";

/** Remounts on every route change so the login-style rise always plays. */
export function PageEnter({
  pathname,
  children,
}: {
  pathname: string;
  children: ReactNode;
}) {
  return (
    <div key={pathname} className="login-panel-enter">
      {children}
    </div>
  );
}
