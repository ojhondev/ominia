import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import {
  calculos,
  relatoriosEmissao,
  indicadores,
  versoesMetodologia,
  metodologias,
  usinas,
  safras,
  empresas,
} from "@/db/schema";

export async function listRelatorios(empresaId: string) {
  return db
    .select({
      id: relatoriosEmissao.id,
      titulo: relatoriosEmissao.titulo,
      status: relatoriosEmissao.status,
      slugPublico: relatoriosEmissao.slugPublico,
      publicadoEm: relatoriosEmissao.publicadoEm,
      criadoEm: relatoriosEmissao.criadoEm,
      indicadorNome: indicadores.nome,
      metodologiaNome: metodologias.nome,
      usinaNome: usinas.nome,
      resultado: calculos.resultado,
      unidadeResultado: calculos.unidadeResultado,
    })
    .from(relatoriosEmissao)
    .innerJoin(calculos, eq(relatoriosEmissao.calculoId, calculos.id))
    .innerJoin(indicadores, eq(calculos.indicadorId, indicadores.id))
    .innerJoin(versoesMetodologia, eq(calculos.versaoMetodologiaId, versoesMetodologia.id))
    .innerJoin(metodologias, eq(versoesMetodologia.metodologiaId, metodologias.id))
    .leftJoin(usinas, eq(calculos.usinaId, usinas.id))
    .where(eq(relatoriosEmissao.empresaId, empresaId))
    .orderBy(desc(relatoriosEmissao.criadoEm));
}

export async function listCalculosSemRelatorio(empresaId: string) {
  return db
    .select({
      id: calculos.id,
      resultado: calculos.resultado,
      unidadeResultado: calculos.unidadeResultado,
      calculadoEm: calculos.calculadoEm,
      indicadorNome: indicadores.nome,
      metodologiaNome: metodologias.nome,
      usinaNome: usinas.nome,
      safraNome: safras.nome,
    })
    .from(calculos)
    .innerJoin(indicadores, eq(calculos.indicadorId, indicadores.id))
    .innerJoin(versoesMetodologia, eq(calculos.versaoMetodologiaId, versoesMetodologia.id))
    .innerJoin(metodologias, eq(versoesMetodologia.metodologiaId, metodologias.id))
    .leftJoin(usinas, eq(calculos.usinaId, usinas.id))
    .leftJoin(safras, eq(calculos.safraId, safras.id))
    .leftJoin(relatoriosEmissao, eq(relatoriosEmissao.calculoId, calculos.id))
    .where(and(eq(calculos.empresaId, empresaId), isNull(relatoriosEmissao.id)))
    .orderBy(desc(calculos.calculadoEm))
    .limit(50);
}

export async function getRelatorioDetalhado(id: string, empresaId: string) {
  const [row] = await db
    .select({
      id: relatoriosEmissao.id,
      titulo: relatoriosEmissao.titulo,
      notas: relatoriosEmissao.notas,
      status: relatoriosEmissao.status,
      slugPublico: relatoriosEmissao.slugPublico,
      hashConteudo: relatoriosEmissao.hashConteudo,
      seloUrl: relatoriosEmissao.seloUrl,
      consentimentos: relatoriosEmissao.consentimentos,
      publicadoEm: relatoriosEmissao.publicadoEm,
      criadoEm: relatoriosEmissao.criadoEm,
      calculoResultado: calculos.resultado,
      calculoUnidade: calculos.unidadeResultado,
      calculoInputs: calculos.inputs,
      calculoEm: calculos.calculadoEm,
      indicadorNome: indicadores.nome,
      indicadorFormula: indicadores.formula,
      metodologiaNome: metodologias.nome,
      versao: versoesMetodologia.versao,
      fonte: versoesMetodologia.fonte,
      usinaNome: usinas.nome,
      safraNome: safras.nome,
      empresaNome: empresas.nome,
      empresaCnpj: empresas.cnpj,
    })
    .from(relatoriosEmissao)
    .innerJoin(calculos, eq(relatoriosEmissao.calculoId, calculos.id))
    .innerJoin(indicadores, eq(calculos.indicadorId, indicadores.id))
    .innerJoin(versoesMetodologia, eq(calculos.versaoMetodologiaId, versoesMetodologia.id))
    .innerJoin(metodologias, eq(versoesMetodologia.metodologiaId, metodologias.id))
    .leftJoin(usinas, eq(calculos.usinaId, usinas.id))
    .leftJoin(safras, eq(calculos.safraId, safras.id))
    .innerJoin(empresas, eq(relatoriosEmissao.empresaId, empresas.id))
    .where(and(eq(relatoriosEmissao.id, id), eq(relatoriosEmissao.empresaId, empresaId)))
    .limit(1);
  return row ?? null;
}

export async function getRelatorioPublicoPorSlug(slug: string) {
  const [row] = await db
    .select({
      id: relatoriosEmissao.id,
      titulo: relatoriosEmissao.titulo,
      notas: relatoriosEmissao.notas,
      slugPublico: relatoriosEmissao.slugPublico,
      hashConteudo: relatoriosEmissao.hashConteudo,
      seloUrl: relatoriosEmissao.seloUrl,
      publicadoEm: relatoriosEmissao.publicadoEm,
      calculoResultado: calculos.resultado,
      calculoUnidade: calculos.unidadeResultado,
      calculoInputs: calculos.inputs,
      calculoEm: calculos.calculadoEm,
      indicadorNome: indicadores.nome,
      indicadorFormula: indicadores.formula,
      metodologiaNome: metodologias.nome,
      versao: versoesMetodologia.versao,
      fonte: versoesMetodologia.fonte,
      usinaNome: usinas.nome,
      safraNome: safras.nome,
      empresaNome: empresas.nome,
    })
    .from(relatoriosEmissao)
    .innerJoin(calculos, eq(relatoriosEmissao.calculoId, calculos.id))
    .innerJoin(indicadores, eq(calculos.indicadorId, indicadores.id))
    .innerJoin(versoesMetodologia, eq(calculos.versaoMetodologiaId, versoesMetodologia.id))
    .innerJoin(metodologias, eq(versoesMetodologia.metodologiaId, metodologias.id))
    .leftJoin(usinas, eq(calculos.usinaId, usinas.id))
    .leftJoin(safras, eq(calculos.safraId, safras.id))
    .innerJoin(empresas, eq(relatoriosEmissao.empresaId, empresas.id))
    .where(and(eq(relatoriosEmissao.slugPublico, slug), eq(relatoriosEmissao.status, "publicado")))
    .limit(1);
  return row ?? null;
}
