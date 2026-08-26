import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";

const segmentos = [
  {
    nome: "Sucroenergético",
    imagem: "/marketing/audience-sucroenergetico.png",
    subtexto: "Cana-de-açúcar, etanol e bioeletricidade — CBIOs e Bonsucro em um só lugar.",
  },
  {
    nome: "Grãos",
    imagem: "/marketing/audience-graos.png",
    subtexto: "Soja e milho com rastreabilidade de origem para biocombustíveis.",
  },
  {
    nome: "Proteína Animal",
    imagem: "/marketing/audience-proteina-animal.png",
    subtexto: "Biogás e créditos de carbono a partir de dejetos na pecuária e avicultura.",
  },
  {
    nome: "Bioenergia",
    imagem: "/marketing/audience-bioenergia.png",
    subtexto: "Biomassa e biometano com inventário de GEE pronto para auditoria.",
  },
];

export function AudienceGrid() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <Reveal>
        <h2 className="max-w-2xl text-3xl leading-tight font-medium tracking-tight text-lp-ink sm:text-4xl">
          Para usinas, indústrias e cooperativas de todo o agronegócio brasileiro
        </h2>
      </Reveal>

      <div className="mt-10 flex flex-col sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {segmentos.map((segmento, i) => (
          <div
            key={segmento.nome}
            className="sticky top-20 pb-4 sm:static sm:pb-0"
            style={{ zIndex: i + 1 }}
          >
            <div className="group relative flex aspect-[3/4] flex-col overflow-hidden rounded-2xl border border-lp-line p-5 shadow-[0px_16px_32px_rgba(21,15,38,0.12)] sm:shadow-none">
              <Image
                src={segmento.imagem}
                alt={segmento.nome}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-colors duration-300 group-hover:from-black/85 group-hover:via-black/40" />

              <span className="relative text-sm font-medium text-white">{segmento.nome}</span>

              <div className="relative mt-auto flex flex-col gap-3">
                <p className="text-xs leading-relaxed text-white/85">{segmento.subtexto}</p>
                <span className="flex size-9 items-center justify-center self-end rounded-full bg-lp-pink text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowRight className="size-4" strokeWidth={2} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
