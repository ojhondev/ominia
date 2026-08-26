import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { usinas, fazendas, safras } from "@/db/schema";

export async function listUsinas(empresaId: string) {
  return db.select().from(usinas).where(eq(usinas.empresaId, empresaId)).orderBy(desc(usinas.criadoEm));
}

export async function listFazendas(empresaId: string) {
  return db
    .select({
      id: fazendas.id,
      produtor: fazendas.produtor,
      propriedade: fazendas.propriedade,
      municipio: fazendas.municipio,
      estado: fazendas.estado,
      car: fazendas.car,
      areaHectares: fazendas.areaHectares,
      areaPreservadaHectares: fazendas.areaPreservadaHectares,
      tipoFornecedor: fazendas.tipoFornecedor,
      usinaId: fazendas.usinaId,
      usinaNome: usinas.nome,
      criadoEm: fazendas.criadoEm,
    })
    .from(fazendas)
    .leftJoin(usinas, eq(fazendas.usinaId, usinas.id))
    .where(eq(fazendas.empresaId, empresaId))
    .orderBy(desc(fazendas.criadoEm));
}

export async function listSafras(empresaId: string) {
  return db
    .select({
      id: safras.id,
      nome: safras.nome,
      dataInicio: safras.dataInicio,
      dataFim: safras.dataFim,
      areaColhidaHectares: safras.areaColhidaHectares,
      producaoToneladas: safras.producaoToneladas,
      encerrada: safras.encerrada,
      usinaId: safras.usinaId,
      usinaNome: usinas.nome,
      criadoEm: safras.criadoEm,
    })
    .from(safras)
    .leftJoin(usinas, eq(safras.usinaId, usinas.id))
    .where(eq(safras.empresaId, empresaId))
    .orderBy(desc(safras.criadoEm));
}
