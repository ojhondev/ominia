"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SidebarContent } from "./sidebar";

export function MobileNav({ empresaNome, isAdmin }: { empresaNome?: string; isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Abrir menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex items-center justify-center rounded-full p-2 text-lp-ink transition-colors hover:bg-lp-paper-soft"
      >
        <Menu className="size-5" strokeWidth={2} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="relative flex h-full w-64 flex-col bg-lp-purple px-4 py-6 shadow-xl">
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() => setOpen(false)}
              className="absolute top-5 right-4 flex items-center justify-center rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <X className="size-5" strokeWidth={2} />
            </button>
            <SidebarContent empresaNome={empresaNome} isAdmin={isAdmin} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </div>
  );
}
