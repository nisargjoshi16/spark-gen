import type { Format, FormatId } from "@/types/poster";

const PREVIEW_WIDTHS: Record<FormatId, number> = {
  portrait: 520,
  square: 520,
  story: 400,
  twitter: 600,
};

export function getPreviewScale(format: Format): {
  scale: number;
  width: number;
  height: number;
} {
  const previewWidth = PREVIEW_WIDTHS[format.id];
  const scale = previewWidth / format.width;

  return {
    scale,
    width: previewWidth,
    height: Math.round(format.height * scale),
  };
}