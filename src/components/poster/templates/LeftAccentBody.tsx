import { fitFontSize } from "@/lib/auto-font-size";
import { stripFormatting } from "@/lib/format-text";
import { FormattedQuote } from "@/components/poster/FormattedQuote";
import type { Format, Palette, PosterInput } from "@/types/poster";

interface LeftAccentBodyProps {
  input: PosterInput;
  palette: Palette;
  format: Format;
  contentFontFamily: string;
}

export function LeftAccentBody({
  input,
  palette,
  format,
  contentFontFamily,
}: LeftAccentBodyProps) {
  const scale = format.height / 1350;
  const quote = input.quote.trim();
  const ref = input.ref.trim() || input.author.trim();
  const quoteSize = fitFontSize(
    stripFormatting(quote).length,
    format.width - 200 * scale,
    format.height * 0.48,
    format.height,
  );

  return (
    <div
      className="body flex flex-1 items-center overflow-hidden"
      style={{
        backgroundColor: palette.bg,
        padding: `${60 * scale}px ${100 * scale}px ${60 * scale}px 0`,
      }}
    >
      <div
        className="shrink-0 self-center"
        style={{
          width: 10 * scale,
          minHeight: 200 * scale,
          backgroundColor: palette.accent,
          borderRadius: `0 ${6 * scale}px ${6 * scale}px 0`,
          marginRight: 60 * scale,
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <FormattedQuote
          text={quote}
          accent={palette.accent}
          className="font-bold text-left"
          style={{
            color: palette.text,
            fontSize: quoteSize,
            lineHeight: 1.5,
            fontFamily: contentFontFamily,
          }}
        />
        {ref && (
          <p
            className="text-left"
            style={{
              color: palette.accent,
              fontSize: 38 * scale,
              opacity: 0.85,
              marginTop: 16 * scale,
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