import QRCode from "qrcode";
import sharp from "sharp";

/**
 * Gera o "selo" do Registro de Integridade e Rastreabilidade Ominia: um QR code
 * apontando para a página pública de verificação, com legenda embaixo, como um único PNG.
 */
export async function gerarSeloPng(urlPublica: string, slug: string): Promise<Buffer> {
  const qrPngBuffer = await QRCode.toBuffer(urlPublica, {
    type: "png",
    width: 520,
    margin: 1,
    color: { dark: "#150f26", light: "#ffffff" },
  });
  const qrDataUri = `data:image/png;base64,${qrPngBuffer.toString("base64")}`;

  const largura = 600;
  const altura = 720;
  const svg = `
    <svg width="${largura}" height="${altura}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${largura}" height="${altura}" fill="#ffffff" />
      <rect x="0.5" y="0.5" width="${largura - 1}" height="${altura - 1}" fill="none" stroke="#e7e4ee" stroke-width="1" />
      <image x="40" y="40" width="520" height="520" href="${qrDataUri}" />
      <text x="${largura / 2}" y="598" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="700" fill="#18033e">Registro de Integridade</text>
      <text x="${largura / 2}" y="626" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="700" fill="#18033e">e Rastreabilidade Ominia</text>
      <text x="${largura / 2}" y="662" text-anchor="middle" font-family="Consolas, Menlo, monospace" font-size="13" fill="#6b6875">${escapeXml(slug)}</text>
      <text x="${largura / 2}" y="684" text-anchor="middle" font-family="Consolas, Menlo, monospace" font-size="12" fill="#6b6875">${escapeXml(urlPublica.replace(/^https?:\/\//, ""))}</text>
    </svg>
  `.trim();

  return sharp(Buffer.from(svg)).png().toBuffer();
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
