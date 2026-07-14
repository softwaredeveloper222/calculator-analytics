"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type AdminToolbarContextValue = {
  slot: HTMLElement | null;
  setSlot: (el: HTMLElement | null) => void;
};

const AdminToolbarContext = createContext<AdminToolbarContextValue | null>(
  null,
);

export function AdminToolbarProvider({ children }: { children: ReactNode }) {
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  return (
    <AdminToolbarContext.Provider value={{ slot, setSlot }}>
      {children}
    </AdminToolbarContext.Provider>
  );
}

/** Target element in the menubar where page actions render. */
export function AdminToolbarSlot() {
  const context = useContext(AdminToolbarContext);
  if (!context) return null;
  return (
    <div
      ref={context.setSlot}
      className="flex shrink-0 flex-wrap items-center justify-end gap-2"
    />
  );
}

/** Portal page actions into the top menubar slot. */
export function AdminToolbarActions({ children }: { children: ReactNode }) {
  const context = useContext(AdminToolbarContext);
  if (!context?.slot) return null;
  return createPortal(children, context.slot);
}
