"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

type FixedPreviewAnchorProps = {
  children: ReactNode;
};

/**
 * Pins the mobile preview under the admin menubar.
 * On large screens uses position:fixed so returning to the top of the page
 * does not re-flow the preview (sticky would jump under the page header).
 */
export function FixedPreviewAnchor({ children }: FixedPreviewAnchorProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;

    const sync = () => {
      if (!window.matchMedia("(min-width: 1024px)").matches) {
        setBox(null);
        return;
      }
      const rect = slot.getBoundingClientRect();
      setBox({ left: rect.left, width: rect.width });
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(slot);
    window.addEventListener("resize", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  return (
    <div className="order-1 self-start lg:order-2">
      <div ref={slotRef} className="mx-auto w-full max-w-[390px]">
        {/* Reserve right-column height on desktop while preview is taken out of flow. */}
        <div
          className="pointer-events-none invisible hidden lg:block"
          style={{ height: "calc(100dvh - 8.5rem)" }}
          aria-hidden
        />

        <div
          className="sticky top-20 z-20 lg:fixed lg:top-20"
          style={
            box
              ? {
                  left: box.left,
                  width: box.width,
                }
              : undefined
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
