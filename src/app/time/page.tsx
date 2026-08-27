import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { NewsletterCta } from "@/components/marketing/newsletter-cta";
import { Reveal } from "@/components/marketing/reveal";
import { FieldLines } from "@/components/marketing/field-lines";

const frentes = [
  "Produto e metodologia, traduzindo cada norma oficial em fórmula dentro da plataforma",
  "Engenharia, responsável por isolamento de dado entre empresas e trilha de auditoria",
  "Compliance e certificação, acompanhando de perto RenovaBio e Bonsucro",
  "Sucesso do cliente, ao lado da usina desde a implantação até a primeira auditoria",
];

const areas = [
  { nome: "Produto & Metodologia", descricao: "Norma oficial primeiro, tela depois." },
  { nome: "Engenharia", descricao: "Isolamento de dado e trilha de auditoria." },
  { nome: "Compliance & Certificação", descricao: "RenovaBio e Bonsucro de perto." },
  { nome: "Sucesso do Cliente", descricao: "Da implantação à primeira auditoria." },
];

export default async function TimePage({
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
          <p className="text-sm text-lp-muted">Time</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mx-auto mt-3 max-w-3xl text-3xl leading-tight font-medium tracking-tight text-lp-ink sm:text-5xl">
            Um time que já viveu o problema que resolve
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-xl text-base text-lp-muted sm:text-lg">
            Gente de metodologia, engenharia e certificação construindo junto com usinas reais, não atrás de uma
            planilha isolada.
          </p>
        </Reveal>
      </section>

      <div className="px-4 sm:px-6 lg:px-10">
        <Reveal>
          <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-lp-purple text-sm text-white/60 sm:aspect-[21/9] sm:max-h-80">
            <FieldLines />
            <span className="relative z-10">Imagem</span>
          </div>
        </Reveal>
      </div>

      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="text-2xl font-medium tracking-tight text-lp-ink sm:text-3xl">O que cada frente cuida</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {frentes.map((f, i) => (
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

      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <Reveal>
          <h2 className="text-2xl font-medium tracking-tight text-lp-ink sm:text-3xl">O time</h2>
          <p className="mt-2 max-w-xl text-sm text-lp-muted">Fotos e nomes do time chegam em breve por aqui.</p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {areas.map((a, i) => (
            <Reveal key={a.nome} delay={i * 60}>
              <div className="flex flex-col gap-3">
                <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-lp-line bg-lp-paper-soft text-xs text-lp-muted">
                  Foto
                </div>
                <div>
                  <p className="text-sm font-medium text-lp-ink">{a.nome}</p>
                  <p className="mt-0.5 text-xs text-lp-muted">{a.descricao}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <NewsletterCta status={status} redirectTo="/time" />
      <SiteFooter />
    </div>
  );
}
