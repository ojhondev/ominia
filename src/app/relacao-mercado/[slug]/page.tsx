import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { NewsletterCta } from "@/components/marketing/newsletter-cta";
import { Reveal } from "@/components/marketing/reveal";
import { modulosMercado, getModuloMercado } from "@/lib/relacao-mercado";

export function generateStaticParams() {
  return modulosMercado.map((m) => ({ slug: m.slug }));
}

export default async function ModuloMercadoPage({
  params,
  searchParams,
}: PageProps<"/relacao-mercado/[slug]">) {
  const { slug } = await params;
  const modulo = getModuloMercado(slug);
  if (!modulo) notFound();

  const sp = await searchParams;
  const inscrito = sp.inscrito === "1";
  const erro = sp.erro === "email_invalido";
  const status = inscrito ? "inscrito" : erro ? "erro" : undefined;

  return (
    <div className="min-h-screen bg-lp-paper">
      <SiteHeader />

      <section className="px-4 pt-16 pb-10 sm:px-6 sm:pt-20 lg:px-10">
        <Reveal>
          <Link href="/relacao-mercado" className="inline-flex items-center gap-1.5 text-sm text-lp-muted hover:text-lp-ink">
            <ArrowLeft className="size-3.5" strokeWidth={2} />
            Relações com o Mercado
          </Link>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mx-auto mt-4 max-w-3xl text-3xl leading-tight font-medium tracking-tight text-lp-ink sm:text-5xl">
            {modulo.titulo}
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-4 max-w-2xl text-base text-lp-muted sm:text-lg">{modulo.resumo}</p>
        </Reveal>
      </section>

      <div className="px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-lp-line bg-lp-paper-soft text-sm text-lp-muted sm:aspect-[21/9]">
            Imagem
          </div>
        </Reveal>
      </div>

      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="text-2xl font-medium tracking-tight text-lp-ink sm:text-3xl">O que isso garante</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modulo.destaques.map((d, i) => (
            <Reveal key={d} delay={i * 80}>
              <div
                className={`flex h-44 flex-col justify-between rounded-2xl p-6 ${
                  i % 2 === 0 ? "bg-lp-purple" : "bg-lp-maroon-deep"
                }`}
              >
                <p className="text-base leading-snug font-medium text-white">{d}</p>
                <span className="flex size-9 items-center justify-center rounded-full bg-lp-pink text-white">
                  <ArrowRight className="size-4" strokeWidth={2} />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {modulo.formulas && (
        <section className="px-4 py-16 sm:px-6 lg:px-10">
          <Reveal>
            <h2 className="text-2xl font-medium tracking-tight text-lp-ink sm:text-3xl">Fórmulas utilizadas</h2>
            <p className="mt-2 max-w-2xl text-sm text-lp-muted">
              As mesmas fórmulas que rodam dentro da plataforma — sem versão simplificada para esta página.
            </p>
          </Reveal>
          <div className="mt-8 flex flex-col gap-4">
            {modulo.formulas.map((f, i) => (
              <Reveal key={f.nome} delay={i * 60}>
                <div className="flex flex-col gap-2 rounded-2xl border border-lp-line bg-lp-paper-soft p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                  <div>
                    <p className="text-sm font-medium text-lp-ink">{f.nome}</p>
                    <p className="mt-1 font-mono text-xs text-lp-muted">{f.onde}</p>
                  </div>
                  <code className="rounded-xl bg-lp-ink px-4 py-3 font-mono text-sm text-white/90">
                    {f.expressao}
                  </code>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="text-2xl font-medium tracking-tight text-lp-ink sm:text-3xl">Registro de metodologia</h2>
          <p className="mt-2 max-w-2xl text-sm text-lp-muted">
            O histórico de mudanças deste módulo — fonte oficial sempre citada.
          </p>
        </Reveal>
        <div className="mt-8 flex flex-col">
          {modulo.registro.map((r, i) => (
            <Reveal key={r.evento} delay={i * 60}>
              <div className={`flex flex-col gap-2 py-6 sm:flex-row sm:gap-10 ${i > 0 ? "border-t border-lp-line" : ""}`}>
                <p className="w-full shrink-0 font-mono text-xs tracking-wide text-lp-pink uppercase sm:w-32">
                  {r.data}
                </p>
                <div className="flex-1">
                  <p className="text-sm text-lp-ink">{r.evento}</p>
                  <p className="mt-1 text-xs text-lp-muted">Fonte: {r.fonte}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <NewsletterCta status={status} redirectTo={`/relacao-mercado/${slug}`} />
      <SiteFooter />
    </div>
  );
}
