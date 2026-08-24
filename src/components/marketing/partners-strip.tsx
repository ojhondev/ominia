import { Reveal } from "./reveal";

const slots = [1, 2, 3, 4, 5];

export function PartnersStrip() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-10">
      <Reveal>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
          <p className="shrink-0 text-sm text-lp-muted">Alguns dos nossos parceiros</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start sm:gap-6">
            {slots.map((slot) => (
              <div
                key={slot}
                className="flex h-12 w-32 items-center justify-center rounded-xl border border-dashed border-lp-line text-xs text-lp-muted"
              >
                Logo
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
