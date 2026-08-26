"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

const VANISH_X = 500;
const VANISH_Y = -150;
const BASE_Y = 600;
const BASE_XS = [-150, 0, 150, 300, 500, 700, 850, 1000, 1150];

export function FieldLines() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      container.style.setProperty("--field-progress", "1");
      return;
    }

    let frame = 0;
    const update = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw = (vh - rect.top) / (vh + rect.height * 0.6);
      const progress = Math.min(1, Math.max(0, raw));
      container.style.setProperty("--field-progress", progress.toFixed(3));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ "--field-progress": 0 } as CSSProperties}
    >
      <svg viewBox="0 0 1000 600" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
        {BASE_XS.map((x, i) => (
          <path
            key={x}
            d={`M ${VANISH_X} ${VANISH_Y} L ${x} ${BASE_Y}`}
            pathLength={1}
            fill="none"
            stroke="white"
            strokeOpacity={0.16}
            strokeWidth={1.5}
            strokeDasharray="1"
            className="transition-[stroke-dashoffset] duration-500 ease-out"
            style={{
              strokeDashoffset: "calc(1 - var(--field-progress))",
              transitionDelay: `${i * 35}ms`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
