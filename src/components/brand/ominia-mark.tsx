export function OminiaMark({ height = 22 }: { height?: number }) {
  return (
    <span
      className="inline-flex items-center gap-2 font-sans font-medium tracking-tight text-whiteout"
      style={{ fontSize: height }}
    >
      Ominia
      <span className="h-1.5 w-1.5 rounded-full bg-neon-glow" aria-hidden />
    </span>
  );
}
