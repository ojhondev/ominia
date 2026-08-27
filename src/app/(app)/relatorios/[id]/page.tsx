import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth/require-session";
import { getRelatorioDetalhado } from "@/lib/queries/relatorios";
import { getSiteUrl } from "@/lib/site-url";
import { atualizarRascunho, excluirRascunho } from "../actions";
import { ConsentWizard } from "@/components/relatorios/consent-wizard";
import { PrintButton } from "@/components/ui/print-button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { ActionButton } from "@/components/ui/action-button";
import { ConfirmForm } from "@/components/ui/confirm-form";
import { StatusBadge } from "@/components/ui/status-badge";
import { FormError } from "@/components/ui/form-error";

export default async function RelatorioDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const session = await requireAdmin();
  const { id } = await params;
  const { erro } = await searchParams;

  const relatorio = await getRelatorioDetalhado(id, session.empresaId);
  if (!relatorio) notFound();

  const publicado = relatorio.status === "publicado";
  const urlPublica = `${getSiteUrl()}/registro/${relatorio.slugPublico}`;

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/relatorios" className="text-sm text-lp-muted hover:text-lp-ink">
            ← Registro de Integridade
          </Link>
          <h1 className="mt-1 text-2xl font-medium tracking-tight text-lp-ink">{relatorio.titulo}</h1>
        </div>
        {publicado ? <StatusBadge label="Publicado" tone="positive" /> : <StatusBadge label="Rascunho" tone="neutral" />}
      </div>

      <div className="no-print">
        <FormError code={erro} />
      </div>

      {!publicado && (
        <form action={atualizarRascunho} className="no-print flex flex-col gap-4 rounded-2xl border border-lp-line bg-white p-6">
          <input type="hidden" name="id" value={relatorio.id} />
          <Field label="Título" htmlFor="titulo">
            <Input id="titulo" name="titulo" defaultValue={relatorio.titulo} required />
          </Field>
          <Field label="Notas (opcional — aparecem no relatório público)" htmlFor="notas">
            <Textarea
              id="notas"
              name="notas"
              defaultValue={relatorio.notas ?? ""}
              rows={4}
              placeholder="Contexto adicional para quem consultar este relatório..."
            />
          </Field>
          <div>
            <SubmitButton pendingLabel="Salvando...">Salvar rascunho</SubmitButton>
          </div>
        </form>
      )}

      <article className="flex flex-col gap-6 rounded-2xl border border-lp-line bg-white p-8 print:rounded-none print:border-0 print:p-0">
        <div className="flex items-center justify-between border-b border-lp-line pb-4">
          <div>
            <p className="font-mono text-xs tracking-wide text-lp-muted uppercase">Ominia — Registro de Integridade</p>
            <h2 className="mt-1 text-xl font-medium text-lp-ink">{relatorio.titulo}</h2>
          </div>
          <Image src="/brand/ominia-wordmark-dark.png" alt="Ominia" width={104} height={19} className="h-5 w-auto" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="font-mono text-[11px] tracking-wide text-lp-muted uppercase">Empresa</p>
            <p className="mt-0.5 text-lp-ink">{relatorio.empresaNome}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-wide text-lp-muted uppercase">Usina</p>
            <p className="mt-0.5 text-lp-ink">{relatorio.usinaNome ?? "—"}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-wide text-lp-muted uppercase">Safra</p>
            <p className="mt-0.5 text-lp-ink">{relatorio.safraNome ?? "—"}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-wide text-lp-muted uppercase">Metodologia</p>
            <p className="mt-0.5 text-lp-ink">
              {relatorio.metodologiaNome} · v{relatorio.versao}
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-wide text-lp-muted uppercase">Indicador</p>
            <p className="mt-0.5 text-lp-ink">{relatorio.indicadorNome}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-wide text-lp-muted uppercase">Calculado em</p>
            <p className="mt-0.5 text-lp-ink">{new Date(relatorio.calculoEm).toLocaleString("pt-BR")}</p>
          </div>
        </div>

        <div className="rounded-xl bg-lp-paper-soft p-5 print:border print:border-lp-line print:bg-white">
          <p className="font-mono text-[11px] tracking-wide text-lp-muted uppercase">Resultado</p>
          <p className="mt-1 text-2xl font-medium text-lp-ink">
            {Number(relatorio.calculoResultado).toLocaleString("pt-BR", { maximumFractionDigits: 4 })}{" "}
            {relatorio.calculoUnidade}
          </p>
        </div>

        {relatorio.notas && (
          <div>
            <p className="font-mono text-[11px] tracking-wide text-lp-muted uppercase">Notas</p>
            <p className="mt-1 text-sm whitespace-pre-line text-lp-ink">{relatorio.notas}</p>
          </div>
        )}

        {publicado ? (
          <div className="flex flex-col gap-4 border-t border-lp-line pt-6 sm:flex-row sm:items-center">
            {relatorio.seloUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={relatorio.seloUrl}
                alt="Selo de verificação Ominia"
                className="h-40 w-auto rounded-xl border border-lp-line"
              />
            )}
            <div className="text-sm">
              <p className="text-lp-muted">
                Publicado em {relatorio.publicadoEm && new Date(relatorio.publicadoEm).toLocaleString("pt-BR")}
              </p>
              <p className="mt-1 font-mono text-xs break-all text-lp-muted">Hash: {relatorio.hashConteudo}</p>
              <a href={urlPublica} target="_blank" rel="noreferrer" className="mt-2 inline-block text-lp-pink-deep hover:underline">
                {urlPublica}
              </a>
            </div>
          </div>
        ) : (
          <p className="border-t border-lp-line pt-6 text-xs text-lp-muted print:hidden">
            Rascunho — este relatório ainda não é público. Publique para gerar o selo de verificação e o link
            público.
          </p>
        )}
      </article>

      <div className="no-print flex flex-wrap items-center gap-3">
        {publicado ? (
          <PrintButton />
        ) : (
          <>
            <ConsentWizard relatorioId={relatorio.id} />
            <ConfirmForm action={excluirRascunho} confirmMessage="Excluir este rascunho de relatório?">
              <input type="hidden" name="id" value={relatorio.id} />
              <ActionButton type="submit" variant="danger" pendingLabel="Excluindo...">
                Excluir rascunho
              </ActionButton>
            </ConfirmForm>
          </>
        )}
      </div>
    </div>
  );
}
