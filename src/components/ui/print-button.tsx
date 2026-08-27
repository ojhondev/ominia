"use client";

import type { ReactNode } from "react";

export function PrintButton({ children = "Baixar PDF" }: { children?: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-lp-pink px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      {children}
    </button>
  );
}
