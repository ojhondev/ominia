import Image from "next/image";
import { Reveal } from "./reveal";
import { FieldLines } from "./field-lines";

export function ValueBlock() {
  return (
    <section id="sobre" className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="relative overflow-hidden rounded-[32px] bg-lp-maroon px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        <FieldLines />

        <Reveal className="relative z-10">
          <h2 className="mx-auto max-w-2xl text-center text-3xl leading-tight font-medium tracking-tight text-white sm:text-4xl">
            Inovadora, com a proximidade que você busca
          </h2>
        </Reveal>

        <div className="relative z-10 mt-16 flex flex-col gap-16">
          <Reveal delay={80}>
            <div className="flex flex-col items-center gap-8 lg:flex-row">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl lg:w-1/2">
                <Image src="/marketing/value-hub.png" alt="Hub de soluções para inventário de emissões CBio e Bonsucro" fill className="object-cover" />
              </div>
              <div className="w-full lg:w-1/2">
                <h3 className="text-xl font-medium text-white sm:text-2xl">
                  Hub de soluções para inventário de emissões CBio e Bonsucro
                </h3>
                <p className="mt-4 text-sm text-white/75 sm:text-base">
                  Centralizamos o dado da sua operação — energia, resíduos,
                  fornecedores, colheita — e transformamos isso em inventário de
                  GEE auditável, pronto para certificação Bonsucro e para a emissão
                  de CBios dentro do RenovaBio.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="flex flex-col items-center gap-8 lg:flex-row-reverse">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl lg:w-1/2">
                <Image src="/marketing/value-time.png" alt="Time especializado em metodologia e evidência" fill className="object-cover" />
              </div>
              <div className="w-full lg:w-1/2">
                <h3 className="text-xl font-medium text-white sm:text-2xl">
                  Time especializado em metodologia e evidência
                </h3>
                <p className="mt-4 text-sm text-white/75 sm:text-base">
                  Da coleta do dado até o dossiê de auditoria, nossa equipe conhece
                  a fundo as exigências do RenovaBio, da Bonsucro e do GHG
                  Protocol — para que cada número já nasça defensável.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
