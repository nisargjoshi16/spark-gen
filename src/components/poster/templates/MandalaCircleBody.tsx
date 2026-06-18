import { fitFontSize } from "@/lib/auto-font-size";
import { stripFormatting } from "@/lib/format-text";
import { FormattedQuote } from "@/components/poster/FormattedQuote";
import type { Format, Palette, PosterInput } from "@/types/poster";

interface MandalaCircleBodyProps {
  input: PosterInput;
  palette: Palette;
  format: Format;
  contentFontFamily: string;
}

export function MandalaCircleBody({
  input,
  palette,
  format,
  contentFontFamily,
}: MandalaCircleBodyProps) {
  const scale = format.height / 1350;
  const quote = input.quote.trim();
  const ref = input.ref.trim() || input.author.trim();
  const quoteSize = fitFontSize(
    stripFormatting(quote).length,
    680 * scale,
    format.height * 0.42,
    format.height,
  );

  const rings = [
    { size: 860, border: "3px solid", opacity: 0.5 },
    { size: 820, border: "1px dashed", opacity: 0.3 },
    { size: 760, border: "2px solid", opacity: 0.35 },
    { size: 700, border: "1px dotted", opacity: 0.2 },
  ];

  return (
    <div
      className="body relative flex flex-1 items-center justify-center overflow-hidden"
      style={{ backgroundColor: palette.bg }}
    >
      {rings.map((ring) => (
        <div
          key={ring.size}
          className="absolute rounded-full"
          style={{
            width: ring.size * scale,
            height: ring.size * scale,
            border: `${ring.border} ${palette.accent}`,
            opacity: ring.opacity,
          }}
        />
      ))}
      <div
        className="relative z-10 flex flex-col items-center gap-5 text-center"
        style={{ maxWidth: 680 * scale }}
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