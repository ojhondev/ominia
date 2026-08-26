"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { mainNavItems, bottomNavItems, type NavItem } from "./nav-items";

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-full px-3.5 py-2 text-sm transition-colors ${
        active
          ? "bg-white/12 text-white"
          : "text-white/60 hover:bg-white/8 hover:text-white"
      }`}
    >
      <Icon className="size-4.5" strokeWidth={2} />
      {item.label}
    </Link>
  );
}

export function SidebarContent({
  empresaNome,
  isAdmin = true,
  onNavigate,
}: {
  empresaNome?: string;
  isAdmin?: boolean;
  onNavigate?: () => void;
}) {
  const bottomItems = isAdmin ? bottomNavItems : [];

  return (
    <>
      <div className="mb-8 px-3">
        <Image
          src="/brand/ominia-wordmark-white.png"
          alt="Ominia"
          width={104}
          height={19}
          priority
          className="h-[19px] w-auto"
        />
        {empresaNome && (
          <p className="mt-2 truncate font-mono text-xs tracking-wide text-white/50 uppercase">{empresaNome}</p>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {mainNavItems.map((item) => (
          <NavLink key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      {bottomItems.length > 0 && (
        <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
          {bottomItems.map((item) => (
            <NavLink key={item.href} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </>
  );
}

export function Sidebar({ empresaNome, isAdmin }: { empresaNome?: string; isAdmin?: boolean }) {
  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col bg-lp-purple px-4 py-6 md:flex">
      <SidebarContent empresaNome={empresaNome} isAdmin={isAdmin} />
    </aside>
  );
}
