import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { documentos, evidencias, versoesMetodologia, metodologias } from "@/db/schema";
import { listUsinas } from "./organizacao";
import { listRequisitosComStatus } from "./bonsucro";

export type Alerta = {
  id: string;
  severidade: "critico" | "atencao" | "info";
  titulo: string;
  descricao: string;
  href: string;
};

const ORDEM_SEVERIDADE = { critico: 0, atencao: 1, info: 2 } as const;
const DIA_MS = 24 * 60 * 60 * 1000;

/**
 * Alertas computados na hora a partir do que já existe no banco — sem tabela própria.
 * Cobre: documento vencido/vencendo, evidência pendente há muito tempo, requisito
 * Bonsucro fora de conformidade e metodologia em revisão.
 */
export async function listAlertas(empresaId: string): Promise<Alerta[]> {
  const alertas: Alerta[] = [];
  const agora = Date.now();
  const em30dias = new Date(agora + 30 * DIA_MS);

  const docs = await db.select().from(documentos).where(eq(documentos.empresaId, empresaId));
  for (const doc of docs) {
    if (!doc.validoAte) continue;
    const validade = new Date(doc.validoAte);
    if (validade.getTime() < agora) {
      alertas.push({
        id: `doc-vencido-${doc.id}`,
        severidade: "critico",
        titulo: `Documento vencido: ${doc.nome}`,
        descricao: `Validade expirou em ${validade.toLocaleDateString("pt-BR")}.`,
        href: "/evidencias",
      });
    } else if (validade <= em30dias) {
      alertas.push({
        id: `doc-vencendo-${doc.id}`,
        severidade: "atencao",
        titulo: `Documento vence em breve: ${doc.nome}`,
        descricao: `Validade até ${validade.toLocaleDateString("pt-BR")}.`,
        href: "/evidencias",
      });
    }
  }

  const evidenciasPendentes = await db
    .select()
    .from(evidencias)
    .where(and(eq(evidencias.empresaId, empresaId), eq(evidencias.status, "pendente")));
  const seteDiasAtras = agora - 7 * DIA_MS;
  for (const ev of evidenciasPendentes) {
    if (new Date(ev.criadoEm).getTime() < seteDiasAtras) {
      alertas.push({
        id: `evidencia-pendente-${ev.id}`,
        severidade: "atencao",
        titulo: "Evidência pendente de revisão há mais de 7 dias",
        descricao: `Vinculada a ${ev.entidadeTipo}, responsável: ${ev.responsavel ?? "não informado"}.`,
        href: "/evidencias",
      });
    }
  }

  const usinasList = await listUsinas(empresaId);
  for (const usina of usinasList) {
    const reqs = await listRequisitosComStatus(empresaId, usina.id);
    const naoConformes = reqs.filter((r) => r.status === "nao_conforme");
    const emAtencao = reqs.filter((r) => r.status === "atencao");

    if (naoConformes.length > 0) {
      alertas.push({
        id: `compliance-nc-${usina.id}`,
        severidade: "critico",
        titulo: `${usina.nome}: ${naoConformes.length} requisito(s) Bonsucro não conforme(s)`,
        descricao: naoConformes.map((r) => r.requisito.nome).join(", "),
        href: `/bonsucro?usinaId=${usina.id}`,
      });
    }
    if (emAtencao.length > 0) {
      alertas.push({
        id: `compliance-atencao-${usina.id}`,
        severidade: "atencao",
        titulo: `${usina.nome}: ${emAtencao.length} requisito(s) Bonsucro em atenção`,
        descricao: emAtencao.map((r) => r.requisito.nome).join(", "),
        href: `/bonsucro?usinaId=${usina.id}`,
      });
    }
  }

  const versoesRevisao = await db
    .select({ versao: versoesMetodologia.versao, nome: metodologias.nome, metodologiaId: versoesMetodologia.metodologiaId })
    .from(versoesMetodologia)
    .innerJoin(metodologias, eq(versoesMetodologia.metodologiaId, metodologias.id))
    .where(eq(versoesMetodologia.status, "em_revisao"));
  for (const v of versoesRevisao) {
    alertas.push({
      id: `metodologia-revisao-${v.metodologiaId}`,
      severidade: "info",
      titulo: `Metodologia ${v.nome} (v${v.versao}) está em revisão`,
      descricao: "Cálculos feitos com essa versão continuam válidos — fique atento quando a nova versão for publicada.",
      href: v.nome === "RenovaBio" ? "/renovabio" : "/bonsucro",
    });
  }

  return alertas.sort((a, b) => ORDEM_SEVERIDADE[a.severidade] - ORDEM_SEVERIDADE[b.severidade]);
}
