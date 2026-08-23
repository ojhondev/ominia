"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OminiaMark } from "@/components/brand/ominia-mark";
import { mainNavItems, bottomNavItems, type NavItem } from "./nav-items";

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-ui px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-graphite text-whiteout"
          : "text-ash hover:bg-graphite hover:text-whiteout"
      }`}
    >
      <Icon className="size-4.5" strokeWidth={2} />
      {item.label}
    </Link>
  );
}

export function Sidebar({ empresaNome }: { empresaNome?: string }) {
  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-graphite-light bg-depth px-4 py-6">
      <div className="mb-8 px-2">
        <OminiaMark height={20} />
        {empresaNome && (
          <p className="mt-1 truncate font-mono text-xs text-ash">{empresaNome}</p>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {mainNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-graphite-light pt-4">
        {bottomNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>
    </aside>
  );
}
