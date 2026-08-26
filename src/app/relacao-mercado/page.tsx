import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Reveal } from "@/components/marketing/reveal";
import { modulosMercado } from "@/lib/relacao-mercado";

export default function RelacaoMercadoPage() {
  return (
    <div className="min-h-screen bg-lp-paper">
      <SiteHeader />

      <section className="px-4 pt-16 pb-10 sm:px-6 sm:pt-20 lg:px-10">
        <Reveal>
          <h1 className="text-4xl leading-tight font-medium tracking-tight text-lp-purple sm:text-6xl">
            Relações com o Mercado
          </h1>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-4 max-w-xl text-base text-lp-muted sm:text-lg">
            Cada módulo da Ominia expõe aqui sua própria metodologia, fontes oficiais e histórico de mudanças —
            clique em qualquer card para ver os detalhes.
          </p>
        </Reveal>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modulosMercado.map((modulo, i) => (
            <Reveal key={modulo.slug} delay={i * 60}>
              <Link
                href={`/relacao-mercado/${modulo.slug}`}
                className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-lp-line bg-white p-6 transition-colors hover:border-lp-pink"
              >
                <span className="text-base font-medium text-lp-ink">{modulo.titulo}</span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-lp-pink text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="size-4" strokeWidth={2} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
