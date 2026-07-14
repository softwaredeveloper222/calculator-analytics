"use client";

import { useEffect, useState, type ReactNode } from "react";

const POST_LOGIN_FLAG = "gcap-post-login-enter";

export function markPostLoginEnter() {
  try {
    sessionStorage.setItem(POST_LOGIN_FLAG, "1");
  } catch {
    // sessionStorage can throw in private modes — enter animation is optional.
  }
}

/** After login, reuses the same rise/fade as the login panel. */
export function PostLoginEnter({ children }: { children: ReactNode }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(POST_LOGIN_FLAG) === "1") {
        sessionStorage.removeItem(POST_LOGIN_FLAG);
        setAnimate(true);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className={animate ? "post-login-enter login-panel-enter" : undefined}>
      {children}
    </div>
  );
}
