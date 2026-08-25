import {
  LayoutDashboard,
  Building2,
  Database,
  FileStack,
  Flame,
  Leaf,
  Sprout,
  ClipboardCheck,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const mainNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/organizacao", label: "Organização", icon: Building2 },
  { href: "/data-hub", label: "Data Hub", icon: Database },
  { href: "/evidencias", label: "Evidence Hub", icon: FileStack },
  { href: "/ghg", label: "Motor GHG", icon: Flame },
  { href: "/renovabio", label: "RenovaBio / CBIO", icon: Leaf },
  { href: "/bonsucro", label: "Bonsucro", icon: Sprout },
  { href: "/auditoria", label: "Auditoria", icon: ClipboardCheck },
];

export const bottomNavItems: NavItem[] = [
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];
