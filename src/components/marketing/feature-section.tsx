import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function FeatureSection({
  id,
  eyebrow,
  title,
  description,
  bullets,
  visual,
  reverse = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  visual: ReactNode;
  reverse?: boolean;
}) {
  return (
    <section id={id} className="border-b border-graphite-light py-24 sm:py-32">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        <div
          className={`grid grid-cols-1 items-center gap-16 lg:grid-cols-2 ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <Reveal>
            <span className="font-mono text-xs uppercase tracking-widest text-neon-glow">
              {eyebrow}
            </span>
            <h2 className="mt-4 max-w-lg text-3xl font-medium tracking-tight text-whiteout sm:text-4xl">
              {title}
            </h2>
            <p className="mt-5 max-w-lg text-base text-ash">{description}</p>
            <ul className="mt-8 flex flex-col gap-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-sm text-cloud">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-glow"
                    aria-hidden
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>{visual}</Reveal>
        </div>
      </div>
    </section>
  );
}
