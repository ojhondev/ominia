import {
  LayoutDashboard,
  Factory,
  Truck,
  Gauge,
  ShieldCheck,
  TrendingUp,
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
  { href: "/dados/unidades", label: "Unidades", icon: Factory },
  { href: "/dados/fornecedores", label: "Fornecedores", icon: Truck },
  { href: "/dados/indicadores", label: "Indicadores", icon: Gauge },
  { href: "/compliance", label: "Compliance", icon: ShieldCheck },
  { href: "/valor", label: "Valor", icon: TrendingUp },
];

export const bottomNavItems: NavItem[] = [
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];
