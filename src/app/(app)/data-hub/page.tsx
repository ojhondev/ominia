import { requireSession } from "@/lib/auth/require-session";
import { listRegistros } from "@/lib/queries/data-hub";
import { listUsinas, listFazendas, listSafras } from "@/lib/queries/organizacao";
import { criarRegistro, validarRegistro, excluirRegistro } from "./actions";
import { Field, Input, Select } from "@/components/ui/field";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { FormError } from "@/components/ui/form-error";

const CATEGORIA_LABEL: Record<string, string> = {
  agricola: "Agrícola",
  industrial: "Industrial",
  logistica: "Logística",
  social: "Social",
  economico: "Econômico",
};

const TIPO_SUGESTOES: Record<string, string> = {
  agricola: "diesel_agricola, fertilizante_n, fertilizante_p, fertilizante_k, calcario, gesso, defensivo",
  industrial: "cana_processada, etanol_produzido, acucar_produzido, energia_eletrica, vapor, agua_industrial",
  logistica: "combustivel_transporte, distancia_km, quantidade_transportada",
  social: "funcionarios_total, acidentes_registrados, horas_treinamento",
  economico: "receita_safra, custo_producao",
};

export default async function DataHubPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const session = await requireSession();
  const { erro } = await searchParams;
  const [registros, usinasList, fazendasList, safrasList] = await Promise.all([
    listRegistros(session.empresaId),
    listUsinas(session.empresaId),
    listFazendas(session.empresaId),
    listSafras(session.empresaId),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-lp-ink">Data Hub</h1>
        <p className="mt-1 text-lp-muted">
          Coleta manual de dados agrícolas, industriais, logísticos, sociais e econômicos. Cada registro alimenta
          o Motor GHG e os motores CBIO e Bonsucro — coletar uma vez, reutilizar em várias metodologias.
        </p>
      </div>

      <FormError code={erro} />

      {usinasList.length === 0 ? (
        <EmptyState
          title="Cadastre uma usina primeiro"
          description="Registros de atividade precisam estar vinculados a uma usina. Vá em Organização → Usinas."
        />
      ) : (
        <form
          action={criarRegistro}
          className="grid grid-cols-2 gap-4 rounded-2xl border border-lp-line bg-white p-6 md:grid-cols-4"
        >
          <Field label="Categoria" htmlFor="categoria">
            <Select id="categoria" name="categoria" required defaultValue="agricola">
              <option value="agricola">Agrícola</option>
              <option value="industrial">Industrial</option>
              <option value="logistica">Logística</option>
              <option value="social">Social</option>
              <option value="economico">Econômico</option>
            </Select>
          </Field>
          <Field label="Tipo" htmlFor="tipo">
            <Input id="tipo" name="tipo" required placeholder="diesel_agricola, fertilizante_n..." list="tipo-sugestoes" />
            <datalist id="tipo-sugestoes">
              {Object.values(TIPO_SUGESTOES)
                .join(", ")
                .split(", ")
                .map((t) => (
                  <option key={t} value={t} />
                ))}
            </datalist>
          </Field>
          <Field label="Quantidade" htmlFor="quantidade">
            <Input id="quantidade" name="quantidade" type="number" step="any" min="0" required placeholder="1200" />
          </Field>
          <Field label="Unidade" htmlFor="unidade">
            <Input id="unidade" name="unidade" required placeholder="L, kg, kWh, t, km, pessoas, R$" />
          </Field>
          <Field label="Data de referência" htmlFor="dataReferencia">
            <Input id="dataReferencia" name="dataReferencia" type="date" required />
          </Field>
          <Field label="Usina" htmlFor="usinaId">
            <Select id="usinaId" name="usinaId" required defaultValue="">
              <option value="" disabled>
                Selecione
              </option>
              {usinasList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Fazenda (opcional)" htmlFor="fazendaId">
            <Select id="fazendaId" name="fazendaId" defaultValue="">
              <option value="">—</option>
              {fazendasList.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.propriedade}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Safra (opcional)" htmlFor="safraId">
            <Select id="safraId" name="safraId" defaultValue="">
              <option value="">—</option>
              {safrasList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </Select>
          </Field>
          <div className="col-span-2 md:col-span-4">
            <Field label="Observação (opcional)" htmlFor="observacao">
              <Input id="observacao" name="observacao" placeholder="Nota livre sobre este registro" />
            </Field>
          </div>
          <div className="col-span-2 flex items-end md:col-span-4">
            <button
              type="submit"
              className="rounded-full bg-lp-pink px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Adicionar registro
            </button>
          </div>
        </form>
      )}

      {registros.length === 0 ? (
        <EmptyState
          title="Nenhum registro ainda"
          description="Upload de planilhas/XML/PDF com pipeline de OCR entra na Fase 4 do roadmap — por ora, a coleta é manual."
        />
      ) : (
        <Table>
          <THead>
            <Th>Categoria</Th>
            <Th>Tipo</Th>
            <Th>Quantidade</Th>
            <Th>Data</Th>
            <Th>Usina</Th>
            <Th>Fazenda</Th>
            <Th>Safra</Th>
            <Th>Status</Th>
            <Th />
          </THead>
          <tbody>
            {registros.map((r) => (
              <Tr key={r.id}>
                <Td>{CATEGORIA_LABEL[r.categoria]}</Td>
                <Td className="font-medium text-lp-ink">{r.tipo}</Td>
                <Td>
                  {Number(r.quantidade).toLocaleString("pt-BR")} {r.unidade}
                </Td>
                <Td>{r.dataReferencia}</Td>
                <Td>{r.usinaNome ?? "—"}</Td>
                <Td>{r.fazendaPropriedade ?? "—"}</Td>
                <Td>{r.safraNome ?? "—"}</Td>
                <Td>
                  <StatusBadge
                    label={r.status === "validado" ? "Validado" : "Rascunho"}
                    tone={r.status === "validado" ? "positive" : "neutral"}
                  />
                </Td>
                <Td>
                  <div className="flex gap-3">
                    {r.status === "rascunho" && (
                      <form action={validarRegistro}>
                        <input type="hidden" name="id" value={r.id} />
                        <button type="submit" className="font-mono text-xs text-lp-pink hover:underline">
                          Validar
                        </button>
                      </form>
                    )}
                    <form action={excluirRegistro}>
                      <input type="hidden" name="id" value={r.id} />
                      <button type="submit" className="font-mono text-xs text-rose-600 hover:underline">
                        Excluir
                      </button>
                    </form>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
