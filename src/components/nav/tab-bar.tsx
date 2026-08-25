"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TabBar({ tabs }: { tabs: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 border-b border-lp-line">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`border-b-2 px-4 py-2 text-sm transition-colors ${
              active
                ? "border-lp-pink text-lp-ink"
                : "border-transparent text-lp-muted hover:text-lp-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
