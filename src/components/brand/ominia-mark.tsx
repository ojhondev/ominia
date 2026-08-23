import Image from "next/image";

export function OminiaMark({ height = 22 }: { height?: number }) {
  const width = Math.round(height * (797 / 169));

  return (
    <Image
      src="/brand/ominia-logo.png"
      alt="Ominia"
      height={height}
      width={width}
      priority
      className="h-auto"
      style={{ height, width: "auto" }}
    />
  );
}

export function OminiaIcon({ size = 24 }: { size?: number }) {
  return (
    <Image
      src="/brand/ominia-icon.png"
      alt="Ominia"
      height={size}
      width={size}
      className="h-auto"
      style={{ height: size, width: size }}
    />
  );
}
