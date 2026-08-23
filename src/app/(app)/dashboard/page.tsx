import { StatCard } from "@/components/ui/stat-card";
import { requireSession } from "@/lib/auth/require-session";
import { getDashboardKpis } from "@/lib/queries/dashboard";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function DashboardPage() {
  const session = await requireSession();
  const kpis = await getDashboardKpis(session.empresaId);

  const cards: { label: string; value: string; sublabel?: string }[] = [
    { label: "Unidades cadastradas", value: String(kpis.unidades) },
    { label: "Fornecedores cadastrados", value: String(kpis.fornecedores) },
    {
      label: "Indicadores no catálogo",
      value: String(kpis.indicadoresCatalogo),
      sublabel: "catálogo global, Pilar Dados",
    },
    { label: "Riscos mapeados", value: String(kpis.riscosMapeados), sublabel: "Pilar Compliance" },
    {
      label: "Valor financeiro registrado",
      value: currency.format(kpis.valorFinanceiroRegistrado),
      sublabel: "soma de valor_eventos em BRL, Pilar Valor",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-whiteout">Dashboard</h1>
        <p className="mt-1 text-ash">Dados → Compliance → Valor, em um só lugar.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            sublabel={card.sublabel}
          />
        ))}
      </div>
    </div>
  );
}
