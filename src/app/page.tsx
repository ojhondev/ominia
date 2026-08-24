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

      <section className="px-4 pt-3 sm:px-6 lg:px-10">
        <div className="rounded-2xl bg-lp-purple p-1.5 sm:rounded-[32px] sm:p-3">
          <Hero status={status} />
        </div>
      </section>

      <PartnersStrip />
      <AudienceGrid />
      <ValueBlock />
      <SolutionsRow />
      <NewsletterCta status={status} />
      <SiteFooter />
    </div>
  );
}
