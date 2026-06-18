import type { Format, FormatId } from "@/types/poster";

const PREVIEW_WIDTHS: Record<FormatId, number> = {
  portrait: 520,
  square: 520,
  story: 400,
  twitter: 600,
};

export function getPreviewScale(
  format: Format,
  bounds?: { maxHeight?: number; maxWidth?: number },
): {
  scale: number;
  width: number;
  height: number;
} {
  let scale = PREVIEW_WIDTHS[format.id] / format.width;

  if (bounds?.maxHeight) {
    const heightAtScale = format.height * scale;
    if (heightAtScale > bounds.maxHeight) {
      scale = Math.min(scale, bounds.maxHeight / format.height);
    }
  }

  if (bounds?.maxWidth) {
    const widthAtScale = format.width * scale;
    if (widthAtScale > bounds.maxWidth) {
      scale = Math.min(scale, bounds.maxWidth / format.width);
    }
  }

  const width = Math.round(format.width * scale);
  const height = Math.round(format.height * scale);

  return { scale, width, height };
}