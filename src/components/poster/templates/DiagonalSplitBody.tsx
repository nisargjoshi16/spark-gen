import { resolveQuoteSize } from "@/lib/auto-font-size";
import { stripFormatting } from "@/lib/format-text";
import { FormattedQuote } from "@/components/poster/FormattedQuote";
import type { Format, Palette, PosterInput } from "@/types/poster";

interface DiagonalSplitBodyProps {
  input: PosterInput;
  palette: Palette;
  format: Format;
  contentFontFamily: string;
  quoteColor: string;
  quoteScale: number;
}

export function DiagonalSplitBody({
  input,
  palette,
  format,
  contentFontFamily,
  quoteColor,
  quoteScale,
}: DiagonalSplitBodyProps) {
  const scale = format.height / 1350;
  const quote = input.quote.trim();
  const ref = input.ref.trim() || input.author.trim();
  const quoteSize = resolveQuoteSize(
    stripFormatting(quote).length,
    format.width - 180 * scale,
    format.height * 0.5,
    format.height,
    quoteScale,
  );

  return (
    <div
      className="body relative flex flex-1 items-center justify-center overflow-hidden"
      style={{ backgroundColor: palette.bg }}
    >
      <div
        className="absolute bottom-0 right-0"
        style={{
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: `0 0 ${1090 * scale}px ${1080 * scale}px`,
          borderColor: `transparent transparent ${palette.bg2} transparent`,
          opacity: 0.55,
        }}
      />
      <div
        className="relative z-10 flex flex-col items-center gap-5 text-center"
        style={{
          padding: `${60 * scale}px ${90 * scale}px`,
          maxWidth: "90%",
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
            }}
          >
            — {ref}
          </p>
        )}
      </div>
    </div>
  );
}