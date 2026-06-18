import type { TextPlacement } from "@/types/poster";

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function getTextBoxGradient(
  bgColor: string,
  placement: TextPlacement,
): string {
  const solid = hexToRgba(bgColor, 0.82);
  const fade = hexToRgba(bgColor, 0);
  return placement === "top"
    ? `linear-gradient(to bottom, ${solid} 70%, ${fade} 100%)`
    : `linear-gradient(to top, ${solid} 70%, ${fade} 100%)`;
}

export function imageBgQuoteFontSize(
  textLength: number,
  formatHeight: number,
): number {
  const scale = formatHeight / 1350;
  const base =
    textLength < 25
      ? 120
      : textLength < 50
        ? 100
        : textLength < 90
          ? 82
          : textLength < 160
            ? 66
            : textLength < 280
              ? 52
              : textLength < 420
                ? 40
                : 32;
  return Math.round(base * scale);
}

export function parseDataUrl(dataUrl: string): {
  mimeType: string;
  base64: string;
} {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid image data URL");
  }
  return { mimeType: match[1], base64: match[2] };
}