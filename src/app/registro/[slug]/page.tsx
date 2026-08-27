import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Reveal } from "@/components/marketing/reveal";
import { getRelatorioPublicoPorSlug } from "@/lib/queries/relatorios";

export default async function RegistroPublicoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const relatorio = await getRelatorioPublicoPorSlug(slug);
  if (!relatorio) notFound();

  return (
    <div className="min-h-screen bg-lp-paper">
      <SiteHeader />

      <section className="px-4 pt-16 pb-10 sm:px-6 sm:pt-20 lg:px-10">
        <Reveal>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-[11px] tracking-wide text-emerald-700 uppercase">
            <ShieldCheck className="size-3.5" strokeWidth={2} />
            Registro verificado
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 max-w-2xl text-3xl leading-tight font-medium tracking-tight text-lp-ink sm:text-5xl">
            {relatorio.titulo}
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-4 max-w-xl text-base text-lp-muted sm:text-lg">
            Publicado por {relatorio.empresaNome} em{" "}
            {relatorio.publicadoEm && new Date(relatorio.publicadoEm).toLocaleDateString("pt-BR")}.
          </p>
        </Reveal>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-10">
        <Reveal>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto]">
            <div className="flex flex-col gap-6 rounded-2xl border border-lp-line bg-white p-8">
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
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
                  <p className="font-mono text-[11px] tracking-wide text-lp-muted uppercase">Fonte da metodologia</p>
                  <p className="mt-0.5 text-lp-ink">{relatorio.fonte ?? "—"}</p>
                </div>
                <div>
                  <p className="font-mono text-[11px] tracking-wide text-lp-muted uppercase">Calculado em</p>
                  <p className="mt-0.5 text-lp-ink">{new Date(relatorio.calculoEm).toLocaleString("pt-BR")}</p>
                </div>
              </div>

              <div className="rounded-xl bg-lp-paper-soft p-5">
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

              <div className="border-t border-lp-line pt-4">
                <p className="font-mono text-[11px] tracking-wide text-lp-muted uppercase">Hash de integridade</p>
                <p className="mt-1 font-mono text-xs break-all text-lp-ink">{relatorio.hashConteudo}</p>
              </div>
            </div>

            {relatorio.seloUrl && (
              <div className="flex items-start justify-center lg:justify-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={relatorio.seloUrl}
                  alt="Selo de Registro de Integridade e Rastreabilidade Ominia"
                  className="w-full max-w-[280px] rounded-2xl border border-lp-line"
                />
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
            <p className="font-medium">O que este registro atesta — e o que não atesta</p>
            <p className="mt-2">
              Este registro confirma que os dados acima não foram alterados desde a publicação e qual metodologia
              foi usada no cálculo. <strong>Não é uma certificação de conformidade</strong> RenovaBio (ANP) ou
              Bonsucro — essas exigem auditoria por um organismo acreditado. A Ominia não verifica a veracidade dos
              dados de origem informados pela empresa.
            </p>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
