import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { NewsletterCta } from "@/components/marketing/newsletter-cta";
import { Reveal } from "@/components/marketing/reveal";

const motores = [
  "Motor GHG Protocol: Emissão = Dado de atividade × Fator de emissão, com banco de fatores de emissão versionado",
  "Motor RenovaBio/CBIO com as fórmulas oficiais da ANP — NEEA, fator de emissão de CBIO e quantidade de CBIO",
  "Motor Bonsucro com os 9 sub-indicadores do Production Standard e score de conformidade calculado automaticamente",
  "Todo cálculo grava a versão de metodologia usada — se a norma mudar, resultados antigos não mudam retroativamente",
];

const organizacao = [
  "Estrutura multi-usina, multi-fazenda e multi-safra por empresa",
  "Isolamento de dado entre empresas, testado de forma adversarial — não apenas assumido",
  "Data Hub para registro de atividade agrícola, industrial, logística, social e econômica",
  "Evidence Hub com upload real de documento, vínculo a usina/fazenda/safra e fluxo de aprovação/rejeição",
];

const compliance = [
  "Trilha de Auditoria: toda criação, cálculo e aprovação fica registrada com autor e data",
  "Alertas: monitoramento automático de documento vencendo, evidência parada e requisito fora de conformidade",
  "Dossiê de auditoria em 1 clique: compliance, evidências, cálculos e registros públicos de uma usina em um documento só",
  "Registro de Integridade: relatório público verificável por cálculo, com selo/QR code, hash e consentimento em 5 etapas",
];

function Grupo({ titulo, itens, offset = 0 }: { titulo: string; itens: string[]; offset?: number }) {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-10">
      <Reveal>
        <h2 className="text-2xl font-medium tracking-tight text-lp-ink sm:text-3xl">{titulo}</h2>
      </Reveal>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {itens.map((item, i) => (
          <Reveal key={item} delay={i * 80}>
            <div
              className={`flex h-56 flex-col justify-between rounded-2xl p-6 ${
                (i + offset) % 2 === 0 ? "bg-lp-purple" : "bg-lp-maroon-deep"
              }`}
            >
              <p className="text-base leading-snug font-medium text-white">{item}</p>
              <span className="flex size-9 items-center justify-center rounded-full bg-lp-pink text-white">
                <ArrowRight className="size-4" strokeWidth={2} />
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default async function FuncionalidadesPage({
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

      <section className="px-4 pt-16 pb-6 sm:px-6 sm:pt-20 lg:px-10">
        <Reveal>
          <p className="text-sm text-lp-muted">Funcionalidades</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mx-auto mt-3 max-w-2xl text-3xl leading-tight font-medium tracking-tight text-lp-ink sm:text-5xl">
            Tudo o que a Ominia já faz hoje
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-xl text-base text-lp-muted sm:text-lg">
            Não é uma calculadora envelopada — é uma plataforma multi-tenant com dado real do início ao fim,
            cobrindo três motores de cálculo oficiais e uma camada de compliance transversal a eles.
          </p>
        </Reveal>
      </section>

      <Grupo titulo="Motores de cálculo, com fórmula oficial e versionada" itens={motores} offset={0} />
      <Grupo titulo="Organização e dado operacional" itens={organizacao} offset={1} />
      <Grupo titulo="Compliance, transparência e vigilância" itens={compliance} offset={0} />

      <NewsletterCta status={status} redirectTo="/funcionalidades" />
      <SiteFooter />
    </div>
  );
}
