import { toBlob } from "html-to-image";
import { downloadImageBlob, type DownloadResult } from "@/lib/download-blob";

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

export async function exportCardAsPng(
  element: HTMLElement,
  filename: string,
): Promise<DownloadResult> {
  await document.fonts.ready;
  await waitForPaint();

  const blob = await toBlob(element, {
    pixelRatio: 1,
    cacheBust: true,
    skipAutoScale: true,
  });

  if (!blob) {
    throw new Error("Could not render poster image");
  }

  return downloadImageBlob(blob, filename);
}