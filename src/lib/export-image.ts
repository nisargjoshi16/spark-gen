import { toPng } from "html-to-image";
import type { Format } from "@/types/quote";

export async function exportCardAsPng(
  element: HTMLElement,
  format: Format,
  filename: string,
): Promise<void> {
  const previousWidth = element.style.width;
  const previousHeight = element.style.height;
  const previousMaxWidth = element.style.maxWidth;

  element.style.width = `${format.width}px`;
  element.style.height = `${format.height}px`;
  element.style.maxWidth = "none";

  await document.fonts.ready;

  try {
    const dataUrl = await toPng(element, {
      width: format.width,
      height: format.height,
      pixelRatio: 1,
      cacheBust: true,
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } finally {
    element.style.width = previousWidth;
    element.style.height = previousHeight;
    element.style.maxWidth = previousMaxWidth;
  }
}