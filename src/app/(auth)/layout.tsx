import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-lp-paper-soft px-4">
      <div className="w-full max-w-sm rounded-3xl border border-lp-line bg-white p-8 shadow-[0px_8px_24px_rgba(21,15,38,0.08)]">
        {children}
      </div>
    </div>
  );
}
