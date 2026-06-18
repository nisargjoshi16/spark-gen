export function initialQuoteFontSize(textLength: number, formatHeight: number): number {
  const scale = formatHeight / 1350;
  const base =
    textLength < 25
      ? 130
      : textLength < 50
        ? 112
        : textLength < 90
          ? 95
          : textLength < 160
            ? 78
            : textLength < 260
              ? 64
              : textLength < 380
                ? 52
                : 42;
  return Math.round(base * scale);
}

export function fitFontSize(
  textLength: number,
  maxWidth: number,
  maxHeight: number,
  formatHeight: number,
  minSize = 28,
): number {
  const scale = formatHeight / 1350;
  let size = initialQuoteFontSize(textLength, formatHeight);
  const min = Math.round(minSize * scale);

  while (size > min) {
    const estimatedLines = Math.ceil(
      (textLength * size * 0.55) / Math.max(maxWidth, 1),
    );
    const estimatedHeight = estimatedLines * size * 1.5;
    if (estimatedHeight <= maxHeight) break;
    size -= Math.round(2 * scale);
  }

  return Math.max(size, min);
}

export function fitTitleFontSize(
  titleLength: number,
  maxWidth: number,
  formatHeight: number,
): number {
  const scale = formatHeight / 1350;
  let size = Math.round(60 * scale);
  const min = Math.round(24 * scale);
  const estimatedWidth = titleLength * size * 0.6;

  while (size > min && estimatedWidth > maxWidth) {
    size -= Math.round(2 * scale);
  }

  return size;
}