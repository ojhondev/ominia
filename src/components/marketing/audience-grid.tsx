import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";

const segmentos = ["Sucroenergético", "Grãos", "Proteína Animal", "Bioenergia"];

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
            key={segmento}
            className="sticky top-20 pb-4 sm:static sm:pb-0"
            style={{ zIndex: i + 1 }}
          >
            <div className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-2xl border border-lp-line bg-lp-paper-soft p-5 shadow-[0px_16px_32px_rgba(21,15,38,0.12)] sm:shadow-none">
              <span className="text-sm font-medium text-lp-ink">{segmento}</span>
              <div className="absolute inset-x-5 top-14 bottom-16 flex items-center justify-center rounded-xl border border-dashed border-lp-line/80 text-xs text-lp-muted">
                Imagem
              </div>
              <span className="flex size-9 items-center justify-center self-end rounded-full bg-lp-pink text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowRight className="size-4" strokeWidth={2} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
