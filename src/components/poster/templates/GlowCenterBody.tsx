import { resolveQuoteSize } from "@/lib/auto-font-size";
import { stripFormatting } from "@/lib/format-text";
import { hexToRgba } from "@/lib/image-bg";
import { FormattedQuote } from "@/components/poster/FormattedQuote";
import type { Format, Palette, PosterInput } from "@/types/poster";

interface GlowCenterBodyProps {
  input: PosterInput;
  palette: Palette;
  format: Format;
  contentFontFamily: string;
  quoteColor: string;
  quoteScale: number;
}

export function GlowCenterBody({
  input,
  palette,
  format,
  contentFontFamily,
  quoteColor,
  quoteScale,
}: GlowCenterBodyProps) {
  const scale = format.height / 1350;
  const quote = input.quote.trim();
  const ref = input.ref.trim() || input.author.trim();
  const quoteSize = resolveQuoteSize(
    stripFormatting(quote).length,
    format.width - 200 * scale,
    format.height * 0.46,
    format.height,
    quoteScale,
  );
  const glow = hexToRgba(palette.accent, 0.22);
  const glowOuter = hexToRgba(palette.accent, 0.08);
  const ringSize = 720 * scale;

  return (
    <div
      className="body relative flex flex-1 items-center justify-center overflow-hidden"
      style={{ backgroundColor: palette.bg }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: ringSize,
          height: ringSize,
          background: `radial-gradient(circle, ${glow} 0%, ${glowOuter} 45%, transparent 72%)`,
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: ringSize * 0.72,
          height: ringSize * 0.72,
          border: `${2 * scale}px solid ${palette.accent}`,
          opacity: 0.18,
        }}
      />
      <div
        className="relative z-10 flex flex-col items-center gap-5 text-center"
        style={{ maxWidth: "80%", padding: `${48 * scale}px` }}
      >
        <span
          style={{
            color: palette.accent,
            fontSize: 32 * scale,
            opacity: 0.65,
            letterSpacing: 16 * scale,
          }}
        >
          ✦ ✦ ✦
        </span>
        <FormattedQuote
          text={quote}
          accent={palette.accent}
          className="font-bold"
          style={{
            color: quoteColor,
            fontSize: quoteSize,
            lineHeight: 1.5,
            fontFamily: contentFontFamily,
          }}
        />
        {ref && (
          <p
            style={{
              color: palette.accent,
              fontSize: 38 * scale,
              opacity: 0.85,
              fontFamily: contentFontFamily,
            }}
          >
            — {ref}
          </p>
        )}
      </div>
    </div>
  );
}