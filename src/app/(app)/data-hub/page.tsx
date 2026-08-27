import { requireSession } from "@/lib/auth/require-session";
import { listRegistros } from "@/lib/queries/data-hub";
import { listUsinas, listFazendas, listSafras } from "@/lib/queries/organizacao";
import { criarRegistro, validarRegistro, excluirRegistro } from "./actions";
import { CategoriaTipoFields } from "@/components/data-hub/categoria-tipo-fields";
import { RegistrosTable } from "@/components/data-hub/registros-table";
import { Field, Input, Select } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/empty-state";
import { FormError } from "@/components/ui/form-error";
import { SubmitButton } from "@/components/ui/submit-button";

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
          <CategoriaTipoFields />
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
            <SubmitButton>Adicionar registro</SubmitButton>
          </div>
        </form>
      )}

      {registros.length === 0 ? (
        <EmptyState
          title="Nenhum registro ainda"
          description="Upload de planilhas/XML/PDF com pipeline de OCR entra na Fase 4 do roadmap — por ora, a coleta é manual."
        />
      ) : (
        <RegistrosTable registros={registros} validarRegistro={validarRegistro} excluirRegistro={excluirRegistro} />
      )}
    </div>
  );
}
