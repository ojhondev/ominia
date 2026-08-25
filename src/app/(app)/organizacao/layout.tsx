import type { ReactNode } from "react";
import { TabBar } from "@/components/nav/tab-bar";

const TABS = [
  { href: "/organizacao", label: "Usinas" },
  { href: "/organizacao/fazendas", label: "Fazendas" },
  { href: "/organizacao/safras", label: "Safras" },
];

export default function OrganizacaoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-lp-ink">Organização</h1>
        <p className="mt-1 text-lp-muted">
          Empresas, usinas, fazendas fornecedoras, safras e usuários — a base de quem produziu o quê, onde e quando.
        </p>
      </div>

      <TabBar tabs={TABS} />

      {children}
    </div>
  );
}
