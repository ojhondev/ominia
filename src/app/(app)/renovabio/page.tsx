import { requireSession } from "@/lib/auth/require-session";
import { listUsinas, listSafras } from "@/lib/queries/organizacao";
import { listCalculosCbio } from "@/lib/queries/renovabio";
import { ensureRenovaBioVersao } from "@/lib/seed/metodologias";
import { calcularCbio } from "./actions";
import { Field, Input, Select } from "@/components/ui/field";
import { Table, THead, Th, Tr, Td } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";

const CODIGO_LABEL: Record<string, string> = {
  NEEA: "NEEA",
  CBIO_FATOR: "Fator de emissão de CBIO",
  CBIO_QTD: "Quantidade de CBIO",
};

export default async function RenovaBioPage() {
  const session = await requireSession();
  const [usinasList, safrasList, historico, versao] = await Promise.all([
    listUsinas(session.empresaId),
    listSafras(session.empresaId),
    listCalculosCbio(session.empresaId),
    ensureRenovaBioVersao(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-lp-ink">RenovaBio / CBIO</h1>
        <p className="mt-1 text-lp-muted">
          A RenovaCalc calcula a intensidade de carbono e determina a NEEA, comparando a intensidade do
          biocombustível com a do combustível fóssil substituto.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <StatusBadge label={`Metodologia ${versao.versao} — ${versao.status === "em_revisao" ? "em revisão" : versao.status}`} tone="warning" />
        <span>
          A RenovaCalc está em revisão (Resolução ANP nº 984/2025). Todo cálculo abaixo fica gravado com a versão
          de metodologia vigente no momento — se a ANP publicar uma nova versão, os cálculos antigos não mudam.
        </span>
      </div>

      <div className="rounded-2xl border border-lp-line bg-white p-6">
        <p className="mb-4 font-mono text-xs uppercase tracking-wide text-lp-muted">
          Fórmulas oficiais — ANP, Informe Técnico nº 02/SBQ
        </p>
        <pre className="overflow-x-auto rounded-xl bg-lp-ink p-4 font-mono text-xs leading-relaxed text-white/85">
{`NEEA  = CI(fóssil substituto) − CI(biocombustível)
f     = NEEA × (f_elegível ÷ 100) × ρ × PCI × 10⁻⁶
CBIO  = Volume comercializado × f`}
        </pre>
        <p className="mt-3 max-w-2xl text-xs text-lp-muted">
          CI via ACV (CBIO-05) e a fração elegível a partir da cadeia de custódia (CBIO-01/02) ainda não têm um
          motor de cálculo automático — insira os valores apurados manualmente até esses submódulos serem
          implementados.
        </p>
      </div>

      {usinasList.length === 0 ? (
        <EmptyState title="Cadastre uma usina primeiro" description="Vá em Organização → Usinas." />
      ) : (
        <form
          action={calcularCbio}
          className="grid grid-cols-2 gap-4 rounded-2xl border border-lp-line bg-white p-6 md:grid-cols-4"
        >
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
          <Field label="CI biocombustível (gCO2eq/MJ)" htmlFor="ciBiocombustivel">
            <Input id="ciBiocombustivel" name="ciBiocombustivel" type="number" step="any" required placeholder="19.8" />
          </Field>
          <Field label="CI fóssil substituto (gCO2eq/MJ)" htmlFor="ciFossil">
            <Input id="ciFossil" name="ciFossil" type="number" step="any" required placeholder="82.2" />
          </Field>
          <Field label="Fração elegível (%)" htmlFor="elegibilidade">
            <Input id="elegibilidade" name="elegibilidade" type="number" step="any" required placeholder="90" />
          </Field>
          <Field label="Massa específica ρ (t/m³)" htmlFor="massaEspecifica">
            <Input id="massaEspecifica" name="massaEspecifica" type="number" step="any" required placeholder="0.79" />
          </Field>
          <Field label="PCI (MJ/kg)" htmlFor="pci">
            <Input id="pci" name="pci" type="number" step="any" required placeholder="26.8" />
          </Field>
          <Field label="Volume comercializado (m³)" htmlFor="volume">
            <Input id="volume" name="volume" type="number" step="any" required placeholder="10000" />
          </Field>
          <div className="col-span-2 flex items-end md:col-span-4">
            <button
              type="submit"
              className="rounded-full bg-lp-pink px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Calcular NEEA, fator e CBIO
            </button>
          </div>
        </form>
      )}

      {historico.length === 0 ? (
        <EmptyState title="Nenhum cálculo ainda" description="Os resultados de NEEA, fator de emissão e quantidade de CBIO aparecem aqui." />
      ) : (
        <Table>
          <THead>
            <Th>Indicador</Th>
            <Th>Resultado</Th>
            <Th>Usina</Th>
            <Th>Safra</Th>
            <Th>Calculado em</Th>
          </THead>
          <tbody>
            {historico.map((c) => (
              <Tr key={c.id}>
                <Td className="font-medium text-lp-ink">{CODIGO_LABEL[c.codigo] ?? c.codigo}</Td>
                <Td>
                  {Number(c.resultado).toLocaleString("pt-BR", { maximumFractionDigits: 4 })} {c.unidadeResultado}
                </Td>
                <Td>{c.usinaNome ?? "—"}</Td>
                <Td>{c.safraNome ?? "—"}</Td>
                <Td>{new Date(c.calculadoEm).toLocaleString("pt-BR")}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
