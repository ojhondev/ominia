/** URL pública estável do site — usada para montar links absolutos (QR code, e-mails). */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://ominia.vercel.app";
}
