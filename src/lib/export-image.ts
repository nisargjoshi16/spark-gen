import { getFontEmbedCSS, toBlob } from "html-to-image";
import { downloadImageBlob, type DownloadResult } from "@/lib/download-blob";

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function stripUnsupportedStyles(root: HTMLElement): () => void {
  const restore: Array<() => void> = [];

  for (const el of root.querySelectorAll<HTMLElement>("*")) {
    const blend = el.style.mixBlendMode;
    if (blend && blend !== "normal") {
      el.style.mixBlendMode = "normal";
      restore.push(() => {
        el.style.mixBlendMode = blend;
      });
    }
  }

  return () => {
    for (const fn of restore) fn();
  };
}

async function renderPosterBlob(element: HTMLElement): Promise<Blob> {
  const width = element.offsetWidth;
  const height = element.offsetHeight;

  if (!width || !height) {
    throw new Error("Preview is not ready");
  }

  const baseOptions = {
    pixelRatio: 1,
    cacheBust: true,
    skipAutoScale: true,
    width,
    height,
    canvasWidth: width,
    canvasHeight: height,
    preferredFontFormat: "woff2" as const,
    fetchRequestInit: { mode: "cors" as RequestMode, credentials: "omit" as RequestCredentials },
  };

  const restoreStyles = stripUnsupportedStyles(element);

  try {
    let fontEmbedCSS: string | undefined;
    try {
      fontEmbedCSS = await getFontEmbedCSS(element);
    } catch {
      // Font inlining often fails on mobile; fall back below.
    }

    let blob = await toBlob(element, { ...baseOptions, fontEmbedCSS });
    if (!blob) {
      blob = await toBlob(element, { ...baseOptions, skipFonts: true });
    }

    if (!blob) {
      throw new Error("Could not render poster image");
    }

    return blob;
  } finally {
    restoreStyles();
  }
}

export async function exportCardAsPng(
  element: HTMLElement,
  filename: string,
): Promise<DownloadResult> {
  await document.fonts.ready;
  await waitForPaint();
  // Give mobile browsers extra time to finish layout and font painting.
  await new Promise((resolve) => window.setTimeout(resolve, 150));

  const blob = await renderPosterBlob(element);
  return downloadImageBlob(blob, filename);
}