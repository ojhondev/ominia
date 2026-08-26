import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { NewsletterCta } from "@/components/marketing/newsletter-cta";
import { EmailCaptureForm } from "@/components/marketing/email-capture-form";
import { SolutionLinkCard } from "@/components/marketing/solution-link-card";
import { Reveal } from "@/components/marketing/reveal";
import { FieldLines } from "@/components/marketing/field-lines";
import { solucoes, getSolucao } from "@/lib/solucoes";

const segmentos = ["Sucroenergético", "Grãos", "Proteína Animal", "Bioenergia"] as const;

export function generateStaticParams() {
  return solucoes.map((s) => ({ slug: s.slug }));
}

export default async function SolucaoPage({
  params,
  searchParams,
}: PageProps<"/solucoes/[slug]">) {
  const { slug } = await params;
  const solucao = getSolucao(slug);
  if (!solucao) notFound();

  const sp = await searchParams;
  const inscrito = sp.inscrito === "1";
  const erro = sp.erro === "email_invalido";
  const status = inscrito ? "inscrito" : erro ? "erro" : undefined;

  const redirectTo = `/solucoes/${slug}`;
  const outras = solucoes.filter((s) => s.slug !== slug);

  return (
    <div className="min-h-screen bg-lp-paper">
      <SiteHeader />

      <section className="px-4 pt-16 pb-10 text-center sm:px-6 sm:pt-20 lg:px-10">
        <Reveal>
          <p className="text-sm text-lp-muted">{solucao.titulo}</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mx-auto mt-3 max-w-3xl text-3xl leading-tight font-medium tracking-tight text-lp-ink sm:text-5xl">
            Use nossa tecnologia para {solucao.titulo}
          </h1>
        </Reveal>
        <Reveal delay={160} className="mt-8 flex justify-center">
          <EmailCaptureForm
            origem={`solucao-${slug}`}
            redirectTo={redirectTo}
            ctaLabel="Vamos além?"
            successMessage={status === "inscrito" ? "Cadastro recebido — em breve entramos em contato." : undefined}
            errorMessage={status === "erro" ? "Digite um e-mail válido." : undefined}
          />
        </Reveal>
      </section>

      <div className="px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl sm:aspect-[21/9] sm:max-h-80">
            <Image src={solucao.imagem} alt={solucao.titulo} fill className="object-cover" priority />
            <FieldLines />
          </div>
        </Reveal>
      </div>

      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="text-2xl font-medium tracking-tight text-lp-ink sm:text-3xl">
            Algumas funcionalidades
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {solucao.funcionalidades.map((f, i) => (
            <Reveal key={f} delay={i * 80}>
              <div
                className={`flex h-56 flex-col justify-between rounded-2xl p-6 ${
                  i % 2 === 0 ? "bg-lp-purple" : "bg-lp-maroon-deep"
                }`}
              >
                <p className="text-base leading-snug font-medium text-white">{f}</p>
                <span className="flex size-9 items-center justify-center rounded-full bg-lp-pink text-white">
                  <ArrowRight className="size-4" strokeWidth={2} />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-10">
        {segmentos.map((segmento, i) => (
          <div key={segmento} className={i > 0 ? "border-t border-lp-line" : undefined}>
            <Reveal delay={i * 60}>
              <div className="flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
                <h3 className="text-2xl font-medium text-lp-ink">{segmento}</h3>
                <div className="sm:max-w-md">
                  <p className="text-sm text-lp-muted">{solucao.porSegmento[segmento]}</p>
                  <Link
                    href="/relacao-mercado"
                    className="mt-4 inline-block rounded-full bg-lp-pink px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    Saiba mais
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        ))}
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="max-w-2xl text-2xl leading-tight font-medium tracking-tight text-lp-ink sm:text-3xl">
            Aproveite e conheça mais sobre as outras soluções da Ominia
          </h2>
        </Reveal>
        <div className="mt-10 flex gap-4 overflow-x-auto pb-2">
          {outras.map((s, i) => (
            <SolutionLinkCard key={s.slug} solucao={s} dark={i % 2 === 0} />
          ))}
        </div>
      </section>

      <NewsletterCta status={status} redirectTo={redirectTo} />
      <SiteFooter />
    </div>
  );
}
