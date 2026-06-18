import { fitFontSize } from "@/lib/auto-font-size";
import { stripFormatting } from "@/lib/format-text";
import { FormattedQuote } from "@/components/poster/FormattedQuote";
import type { Format, Palette, PosterInput } from "@/types/poster";

interface HorizonSplitBodyProps {
  input: PosterInput;
  palette: Palette;
  format: Format;
  contentFontFamily: string;
}

export function HorizonSplitBody({
  input,
  palette,
  format,
  contentFontFamily,
}: HorizonSplitBodyProps) {
  const scale = format.height / 1350;
  const quote = input.quote.trim();
  const ref = input.ref.trim() || input.author.trim();
  const quoteSize = fitFontSize(
    stripFormatting(quote).length,
    format.width - 180 * scale,
    format.height * 0.45,
    format.height,
  );
  const splitAt = "55%";

  return (
    <div className="body relative flex flex-1 items-center justify-center overflow-hidden">
      <div
        className="absolute inset-x-0 top-0"
        style={{ height: splitAt, backgroundColor: palette.bg }}
      />
      <div
        className="absolute inset-x-0 bottom-0"
        style={{ height: "45%", backgroundColor: palette.bg2 }}
      />
      <div
        className="absolute inset-x-0"
        style={{
          top: splitAt,
          height: 3 * scale,
          backgroundColor: palette.accent,
          opacity: 0.35,
          transform: "translateY(-50%)",
        }}
      />
      <div
        className="relative z-10 flex flex-col items-center gap-5 text-center"
        style={{ maxWidth: "88%", padding: `${50 * scale}px ${80 * scale}px` }}
      >
        <FormattedQuote
          text={quote}
          accent={palette.accent}
          className="font-bold"
          style={{
            color: palette.text,
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