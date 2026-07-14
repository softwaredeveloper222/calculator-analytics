"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type FixedPreviewAnchorProps = {
  children: ReactNode;
};

type PreviewBox = {
  top: number;
  left: number;
  width: number;
};

/**
 * Pins the mobile preview under the admin menubar on large screens.
 * Portals to document.body so page-transition / post-login transforms
 * cannot turn position:fixed into a relative-to-ancestor trap.
 */
export function FixedPreviewAnchor({ children }: FixedPreviewAnchorProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<PreviewBox | null>(null);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;

    const sync = () => {
      if (!window.matchMedia("(min-width: 1024px)").matches) {
        setBox(null);
        return;
      }

      const rect = slot.getBoundingClientRect();
      const header = document.querySelector<HTMLElement>("header.glass-menubar");
      const headerBottom = header
        ? header.getBoundingClientRect().bottom
        : 56;
      // Match main top padding (py-7 ≈ 1.75rem) under the menubar.
      const top = headerBottom + 28;

      setBox({
        top,
        left: rect.left,
        width: rect.width,
      });
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(slot);
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync);
    };
  }, []);

  const frameHeight = box
    ? `calc(100dvh - ${box.top}px - 2.75rem)`
    : "calc(100dvh - 10.25rem)";
  const columnHeight = box
    ? `calc(100dvh - ${box.top}px - 1rem)`
    : "calc(100dvh - 8.5rem)";

  const previewStyle = {
    "--preview-frame-height": frameHeight,
  } as CSSProperties;

  const preview = <div style={previewStyle}>{children}</div>;

  return (
    <div className="order-1 self-start lg:order-2">
      <div ref={slotRef} className="mx-auto w-full max-w-[390px]">
        {/* In-flow sticky until desktop measures (and always on < lg). */}
        {!box ? (
          <div className="sticky top-20 z-20">{preview}</div>
        ) : (
          <div
            className="pointer-events-none invisible hidden lg:block"
            style={{ height: columnHeight }}
            aria-hidden
          />
        )}
      </div>

      {mounted && box
        ? createPortal(
            <div
              className="z-20"
              style={{
                position: "fixed",
                top: box.top,
                left: box.left,
                width: box.width,
                ...previewStyle,
              }}
            >
              {children}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
