import { toPng } from "html-to-image";

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

export async function exportCardAsPng(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  await document.fonts.ready;
  await waitForPaint();

  const dataUrl = await toPng(element, {
    pixelRatio: 1,
    cacheBust: true,
    skipAutoScale: true,
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}