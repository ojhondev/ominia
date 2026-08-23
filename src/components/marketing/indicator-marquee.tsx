const indicators = [
  "EUDR",
  "CVM 244",
  "GEE Scope 1-3",
  "RenovaBio",
  "ISO 14001",
  "Bônus/Selo Social",
  "Rastreabilidade de origem",
  "Crédito rural verde",
  "Mesa Brasileira da Pecuária Sustentável",
  "Água e efluentes",
];

export function IndicatorMarquee() {
  const track = [...indicators, ...indicators];

  return (
    <section className="overflow-hidden border-b border-graphite-light bg-blackout py-8">
      <p className="mb-6 text-center font-mono text-xs uppercase tracking-widest text-pewter">
        Normas e indicadores do agronegócio que a Ominia acompanha
      </p>
      <div className="flex w-max marquee-track">
        {track.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="mx-4 shrink-0 rounded-ui border border-graphite-light bg-graphite-deep px-5 py-2.5 font-mono text-xs text-cloud"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
