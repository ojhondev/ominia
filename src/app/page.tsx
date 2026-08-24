import { SiteHeader } from "@/components/marketing/site-header";
import { Hero } from "@/components/marketing/hero";
import { PartnersStrip } from "@/components/marketing/partners-strip";
import { AudienceGrid } from "@/components/marketing/audience-grid";
import { ValueBlock } from "@/components/marketing/value-block";
import { SolutionsRow } from "@/components/marketing/solutions-row";
import { NewsletterCta } from "@/components/marketing/newsletter-cta";
import { SiteFooter } from "@/components/marketing/site-footer";

export default async function LandingPage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const inscrito = params.inscrito === "1";
  const erro = params.erro === "email_invalido";
  const status = inscrito ? "inscrito" : erro ? "erro" : undefined;

  return (
    <div className="min-h-screen bg-lp-paper">
      <SiteHeader />
      <Hero status={status} />
      <PartnersStrip />
      <AudienceGrid />
      <ValueBlock />
      <SolutionsRow />
      <NewsletterCta status={status} />
      <SiteFooter />
    </div>
  );
}
