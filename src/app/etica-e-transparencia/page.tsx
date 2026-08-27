import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { NewsletterCta } from "@/components/marketing/newsletter-cta";
import { Reveal } from "@/components/marketing/reveal";

const compromissos = [
  "Toda fórmula usada dentro da plataforma é pública, na página de Relações com o Mercado",
  "Toda mudança de metodologia fica registrada com data e fonte oficial — nada é atualizado em silêncio",
  "Nenhum número é estimado ou arredondado a favor do cliente — só o que o dado sustenta",
  "Qualquer cálculo pode ser reconstruído por um auditor externo a partir do registro guardado",
];

const principios = [
  {
    titulo: "Isolamento entre empresas",
    texto: "O dado de uma usina nunca é lido, calculado ou exibido para outra empresa — testado de forma adversarial, não só assumido.",
  },
  {
    titulo: "Fonte oficial sempre citada",
    texto: "ANP, Bonsucro e GHG Protocol — cada fórmula aponta para o documento de origem, não para uma interpretação nossa.",
  },
  {
    titulo: "Privacidade e LGPD",
    texto: "Dado pessoal de usuário é tratado com a mesma seriedade do dado de compliance — coleta mínima, uso declarado.",
  },
];

export default async function EticaETransparenciaPage({
  searchParams,
}: {
  searchParams: Promise<{ inscrito?: string; erro?: string }>;
}) {
  const sp = await searchParams;
  const inscrito = sp.inscrito === "1";
  const erro = sp.erro === "email_invalido";
  const status = inscrito ? "inscrito" : erro ? "erro" : undefined;

  return (
    <div className="min-h-screen bg-lp-paper">
      <SiteHeader />

      <section className="px-4 pt-16 pb-10 text-center sm:px-6 sm:pt-20 lg:px-10">
        <Reveal>
          <p className="text-sm text-lp-muted">Ética e Transparência</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mx-auto mt-3 max-w-3xl text-3xl leading-tight font-medium tracking-tight text-lp-ink sm:text-5xl">
            Transparência não é um selo, é um processo
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-xl text-base text-lp-muted sm:text-lg">
            Preferimos mostrar como cada número é calculado a pedir para acreditar na palavra da Ominia.
          </p>
        </Reveal>
      </section>

      <div className="px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-lp-purple text-sm text-white/60 sm:aspect-[21/9] sm:max-h-80">
            Imagem
          </div>
        </Reveal>
      </div>

      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="text-2xl font-medium tracking-tight text-lp-ink sm:text-3xl">O que isso garante</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {compromissos.map((c, i) => (
            <Reveal key={c} delay={i * 80}>
              <div
                className={`flex h-56 flex-col justify-between rounded-2xl p-6 ${
                  i % 2 === 0 ? "bg-lp-purple" : "bg-lp-maroon-deep"
                }`}
              >
                <p className="text-base leading-snug font-medium text-white">{c}</p>
                <span className="flex size-9 items-center justify-center rounded-full bg-lp-pink text-white">
                  <ArrowRight className="size-4" strokeWidth={2} />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-10">
        {principios.map((p, i) => (
          <div key={p.titulo} className={i > 0 ? "border-t border-lp-line" : undefined}>
            <Reveal delay={i * 60}>
              <div className="flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
                <h3 className="text-2xl font-medium text-lp-ink sm:w-64 sm:shrink-0">{p.titulo}</h3>
                <div className="sm:max-w-md">
                  <p className="text-sm text-lp-muted">{p.texto}</p>
                  <Link
                    href="/relacao-mercado"
                    className="mt-4 inline-block rounded-full bg-lp-pink px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    Ver registro completo
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        ))}
      </section>

      <NewsletterCta status={status} redirectTo="/etica-e-transparencia" />
      <SiteFooter />
    </div>
  );
}
