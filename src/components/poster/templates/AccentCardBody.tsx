import { resolveQuoteSize } from "@/lib/auto-font-size";
import { stripFormatting } from "@/lib/format-text";
import { hexToRgba } from "@/lib/image-bg";
import { FormattedQuote } from "@/components/poster/FormattedQuote";
import type { Format, Palette, PosterInput } from "@/types/poster";

interface AccentCardBodyProps {
  input: PosterInput;
  palette: Palette;
  format: Format;
  contentFontFamily: string;
  quoteColor: string;
  quoteScale: number;
}

export function AccentCardBody({
  input,
  palette,
  format,
  contentFontFamily,
  quoteColor,
  quoteScale,
}: AccentCardBodyProps) {
  const scale = format.height / 1350;
  const quote = input.quote.trim();
  const ref = input.ref.trim() || input.author.trim();
  const quoteSize = resolveQuoteSize(
    stripFormatting(quote).length,
    format.width - 280 * scale,
    format.height * 0.38,
    format.height,
    quoteScale,
  );

  return (
    <div
      className="body relative flex flex-1 items-center justify-center overflow-hidden"
      style={{ backgroundColor: palette.bg }}
    >
      <div
        className="relative z-10 flex flex-col items-center gap-5 text-center"
        style={{
          maxWidth: "86%",
          padding: `${56 * scale}px ${64 * scale}px`,
          backgroundColor: hexToRgba(palette.bg2, 0.72),
          border: `${3 * scale}px solid ${palette.accent}`,
          boxShadow: `0 ${12 * scale}px ${40 * scale}px rgba(0,0,0,0.14)`,
        }}
      >
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
              borderTop: `${2 * scale}px solid ${palette.accent}`,
              paddingTop: 20 * scale,
              width: "100%",
            }}
          >
            — {ref}
          </p>
        )}
      </div>
    </div>
  );
}