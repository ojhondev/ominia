import Image from "next/image";

const parceiros = [
  { nome: "Usina Santo Ângelo", src: "/marketing/partner-santo-angelo.png" },
  { nome: "Usina Uberaba", src: "/marketing/partner-uberaba.png" },
  { nome: "Usina Santa Fé", src: "/marketing/partner-santa-fe.png" },
];
const track = [...parceiros, ...parceiros];

export function PartnersStrip() {
  return (
    <section className="py-16">
      <div className="flex flex-col gap-6 px-4 sm:flex-row sm:items-center sm:gap-10 sm:px-6 lg:px-10">
        <p className="shrink-0 text-sm text-lp-muted">Alguns dos nossos parceiros</p>
        <div className="overflow-hidden">
          <div className="marquee-track flex w-max items-center gap-12">
            {track.map((parceiro, i) => (
              <div
                key={`${parceiro.nome}-${i}`}
                aria-hidden={i >= parceiros.length}
                className="relative h-8 w-32 shrink-0"
              >
                <Image
                  src={parceiro.src}
                  alt={parceiro.nome}
                  fill
                  className="object-contain object-left grayscale opacity-40 brightness-125"
                  sizes="128px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
