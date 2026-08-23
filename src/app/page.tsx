import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { SiteHeader } from "@/components/marketing/site-header";
import { Hero } from "@/components/marketing/hero";
import { PillarBar } from "@/components/marketing/pillar-bar";
import { IndicatorMarquee } from "@/components/marketing/indicator-marquee";
import { FeatureSection } from "@/components/marketing/feature-section";
import { DadosMockup } from "@/components/marketing/mockups/dados-mockup";
import { ComplianceMockup } from "@/components/marketing/mockups/compliance-mockup";
import { ValorMockup } from "@/components/marketing/mockups/valor-mockup";
import { TraceBlock } from "@/components/marketing/trace-block";
import { Comparison } from "@/components/marketing/comparison";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { SiteFooter } from "@/components/marketing/site-footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-blackout">
      <AnnouncementBar />
      <SiteHeader />
      <Hero />
      <PillarBar />
      <IndicatorMarquee />

      <FeatureSection
        id="dados"
        eyebrow="Pilar Dados"
        title="Uma base ESG confiável, não uma planilha a mais"
        description="Centralize unidades, fornecedores e indicadores da sua cadeia produtiva em um catálogo único. Cada dado importado vira um registro rastreável — pronto para virar evidência, não retrabalho."
        bullets={[
          "Importação de planilhas sem reestruturar sua agroindústria",
          "Catálogo global de indicadores, já mapeado para o agronegócio",
          "Um registro por fornecedor da sua cadeia produtiva — não um score que você não controla",
        ]}
        visual={<DadosMockup />}
      />

      <FeatureSection
        id="compliance"
        eyebrow="Pilar Compliance"
        title="Da planilha à trilha de auditoria, sem hiato"
        description="Cada indicador do Pilar Dados gera evidência de conformidade automaticamente — com histórico, responsável e data. Quando o auditor, o banco ou o comprador da sua cadeia produtiva perguntar, a resposta já está pronta."
        bullets={[
          "Trilha de auditoria gerada junto com o dado, não depois",
          "Cobertura para EUDR, CVM 244, GEE Scope 1-3 e mais normas do agronegócio",
          "Evidência exportável — sem montar dossiê na véspera para a agroindústria",
        ]}
        visual={<ComplianceMockup />}
        reverse
      />

      <FeatureSection
        id="valor"
        eyebrow="Pilar Valor"
        title="O que nenhum concorrente entrega: quanto isso vale em reais"
        description="Score de fornecedor, elegibilidade de crédito verde, cenário climático — tudo traduzido em BRL. Não é relatório de conformidade. É o argumento financeiro que abre uma linha de crédito melhor ou fecha um contrato comercial para o seu agronegócio."
        bullets={[
          "Elegibilidade de crédito verde calculada a partir do seu dado",
          "Economia e ganho gerados pelo ESG da sua agroindústria, em R$, por trimestre",
          "Argumento pronto para o banco, o comprador ou o investidor da sua cadeia produtiva",
        ]}
        visual={<ValorMockup />}
      />

      <TraceBlock />
      <Comparison />
      <CtaBanner />
      <SiteFooter />
    </div>
  );
}
