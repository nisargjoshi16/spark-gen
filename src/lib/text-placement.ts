import type { TextPlacement } from "@/types/poster";

function zoneStdDev(
  pixels: Uint8ClampedArray,
  width: number,
  yStart: number,
  yEnd: number,
): number {
  let sum = 0;
  let sumSq = 0;
  let count = 0;

  for (let y = yStart; y < yEnd; y++) {
    for (let x = 0; x < width; x++) {
      const value = pixels[y * width + x];
      sum += value;
      sumSq += value * value;
      count++;
    }
  }

  if (count === 0) return 0;
  const mean = sum / count;
  return Math.sqrt(sumSq / count - mean * mean);
}

function analyzePlacement(imageData: ImageData): TextPlacement {
  const { width, height, data } = imageData;

  const grayscale = new Uint8ClampedArray(width * height);
  for (let i = 0; i < width * height; i++) {
    const offset = i * 4;
    grayscale[i] = Math.round(
      0.299 * data[offset] +
        0.587 * data[offset + 1] +
        0.114 * data[offset + 2],
    );
  }

  const headerRows = Math.round(height * (44 / 338));
  const footerRows = Math.round(height * (34 / 338));
  const contentHeight = height - headerRows - footerRows;
  const mid = Math.floor(contentHeight / 2);

  const topScore = zoneStdDev(grayscale, width, headerRows, headerRows + mid);
  const bottomScore = zoneStdDev(
    grayscale,
    width,
    headerRows + mid,
    height - footerRows,
  );

  return topScore <= bottomScore ? "top" : "bottom";
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

/** Pick top or bottom overlay based on image complexity (ported from legacy). */
export async function findBestTextPlacement(file: File): Promise<TextPlacement> {
  try {
    const img = await loadImageElement(file);
    const canvas = document.createElement("canvas");
    canvas.width = 270;
    canvas.height = 338;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "bottom";

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return analyzePlacement(imageData);
  } catch {
    return "bottom";
  }
}