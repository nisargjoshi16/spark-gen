import { resolveQuoteSize } from "@/lib/auto-font-size";
import { stripFormatting } from "@/lib/format-text";
import { FormattedQuote } from "@/components/poster/FormattedQuote";
import type { Format, Palette, PosterInput } from "@/types/poster";

interface MinimalRuleBodyProps {
  input: PosterInput;
  palette: Palette;
  format: Format;
  contentFontFamily: string;
  quoteColor: string;
  quoteScale: number;
}

export function MinimalRuleBody({
  input,
  palette,
  format,
  contentFontFamily,
  quoteColor,
  quoteScale,
}: MinimalRuleBodyProps) {
  const scale = format.height / 1350;
  const quote = input.quote.trim();
  const ref = input.ref.trim() || input.author.trim();
  const quoteSize = resolveQuoteSize(
    stripFormatting(quote).length,
    format.width - 200 * scale,
    format.height * 0.42,
    format.height,
    quoteScale,
  );

  return (
    <div
      className="body relative flex flex-1 items-center justify-center overflow-hidden"
      style={{ backgroundColor: palette.bg }}
    >
      <div
        className="relative z-10 flex flex-col items-center gap-6 text-center"
        style={{ maxWidth: "84%", padding: `${60 * scale}px` }}
      >
        <div
          className="flex flex-col items-center gap-3"
          style={{ width: "100%" }}
        >
          <div
            style={{
              width: 140 * scale,
              height: 3 * scale,
              backgroundColor: palette.accent,
              opacity: 0.7,
            }}
          />
          <span
            style={{
              color: palette.accent,
              fontSize: 28 * scale,
              opacity: 0.8,
              letterSpacing: 12 * scale,
            }}
          >
            ✦
          </span>
        </div>
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
          <>
            <div
              style={{
                width: 100 * scale,
                height: 2 * scale,
                backgroundColor: palette.accent,
                opacity: 0.45,
              }}
            />
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
          </>
        )}
      </div>
    </div>
  );
}