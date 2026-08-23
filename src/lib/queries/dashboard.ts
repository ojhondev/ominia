import { and, count, eq, sum } from "drizzle-orm";
import { db } from "@/db";
import { unidades, fornecedores, indicadores, riscos, valorEventos } from "@/db/schema";

export async function getDashboardKpis(empresaId: string) {
  const [unidadesCount] = await db
    .select({ value: count() })
    .from(unidades)
    .where(eq(unidades.empresaId, empresaId));

  const [fornecedoresCount] = await db
    .select({ value: count() })
    .from(fornecedores)
    .where(eq(fornecedores.empresaId, empresaId));

  const [indicadoresCount] = await db.select({ value: count() }).from(indicadores);

  const [riscosCount] = await db
    .select({ value: count() })
    .from(riscos)
    .where(eq(riscos.empresaId, empresaId));

  const [valorFinanceiro] = await db
    .select({ value: sum(valorEventos.valorNumerico) })
    .from(valorEventos)
    .where(
      and(eq(valorEventos.empresaId, empresaId), eq(valorEventos.unidadeValor, "BRL")),
    );

  return {
    unidades: unidadesCount?.value ?? 0,
    fornecedores: fornecedoresCount?.value ?? 0,
    indicadoresCatalogo: indicadoresCount?.value ?? 0,
    riscosMapeados: riscosCount?.value ?? 0,
    valorFinanceiroRegistrado: Number(valorFinanceiro?.value ?? 0),
  };
}
