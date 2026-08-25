import type { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-lp-line bg-white shadow-[0px_4px_16px_rgba(21,15,38,0.04)]">
      <table className="w-full min-w-max border-collapse text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-lp-line bg-lp-paper-soft">{children}</tr>
    </thead>
  );
}

export function Th({ children }: { children?: ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-left font-mono text-[11px] tracking-wide text-lp-muted uppercase">
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-lp-ink/85 ${className}`}>{children}</td>;
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr className="border-b border-lp-line last:border-0 hover:bg-lp-paper-soft/60">{children}</tr>;
}
