const slots = [1, 2, 3, 4, 5];
const track = [...slots, ...slots];

export function PartnersStrip() {
  return (
    <section className="py-16">
      <div className="flex flex-col gap-6 px-4 sm:flex-row sm:items-center sm:gap-10 sm:px-6 lg:px-10">
        <p className="shrink-0 text-sm text-lp-muted">Alguns dos nossos parceiros</p>
        <div className="overflow-hidden">
          <div className="marquee-track flex w-max items-center gap-6">
            {track.map((slot, i) => (
              <div
                key={`${slot}-${i}`}
                aria-hidden={i >= slots.length}
                className="flex h-12 w-32 shrink-0 items-center justify-center rounded-xl border border-dashed border-lp-line text-xs text-lp-muted"
              >
                Logo
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
