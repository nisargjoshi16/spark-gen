import { fitFontSize } from "@/lib/auto-font-size";
import { stripFormatting } from "@/lib/format-text";
import { FormattedQuote } from "@/components/poster/FormattedQuote";
import type { Format, Palette, PosterInput } from "@/types/poster";

interface ShlokaBodyProps {
  input: PosterInput;
  palette: Palette;
  format: Format;
  contentFontFamily: string;
}

export function ShlokaBody({
  input,
  palette,
  format,
  contentFontFamily,
}: ShlokaBodyProps) {
  const scale = format.height / 1350;
  const quote = input.quote.trim();
  const ref = input.ref.trim() || input.author.trim();
  const quoteSize = fitFontSize(
    stripFormatting(quote).length,
    format.width - 140 * scale,
    format.height * 0.45,
    format.height,
  );

  return (
    <div
      className="relative flex flex-1 items-center justify-center overflow-hidden"
      style={{
        backgroundColor: palette.bg,
        padding: `${70 * scale}px ${80 * scale}px`,
      }}
    >
      <div
        className="absolute rounded-sm"
        style={{
          top: 24 * scale,
          left: 24 * scale,
          right: 24 * scale,
          bottom: 24 * scale,
          border: `${2 * scale}px solid ${palette.accent}`,
          opacity: 0.45,
        }}
      />
      <div
        className="absolute rounded-sm"
        style={{
          top: 36 * scale,
          left: 36 * scale,
          right: 36 * scale,
          bottom: 36 * scale,
          border: `${1 * scale}px solid ${palette.accent}`,
          opacity: 0.25,
        }}
      />

      {(["tl", "tr", "bl", "br"] as const).map((corner) => (
        <div
          key={corner}
          className="absolute"
          style={{
            width: 28 * scale,
            height: 28 * scale,
            top: corner.startsWith("t") ? 18 * scale : undefined,
            bottom: corner.startsWith("b") ? 18 * scale : undefined,
            left: corner.endsWith("l") ? 18 * scale : undefined,
            right: corner.endsWith("r") ? 18 * scale : undefined,
            borderTop: corner.startsWith("t")
              ? `${3 * scale}px solid ${palette.accent}`
              : undefined,
            borderBottom: corner.startsWith("b")
              ? `${3 * scale}px solid ${palette.accent}`
              : undefined,
            borderLeft: corner.endsWith("l")
              ? `${3 * scale}px solid ${palette.accent}`
              : undefined,
            borderRight: corner.endsWith("r")
              ? `${3 * scale}px solid ${palette.accent}`
              : undefined,
          }}
        />
      ))}

      <div
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
        style={{
          top: 52 * scale,
          color: palette.accent,
          fontSize: 28 * scale,
          opacity: 0.65,
          letterSpacing: 20 * scale,
        }}
      >
        ॐ ✦ ✦ ✦
      </div>

      <div
        className="relative z-10 flex flex-col items-center gap-5 text-center"
        style={{ maxWidth: "90%" }}
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

      <div
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
        style={{
          bottom: 52 * scale,
          color: palette.accent,
          fontSize: 22 * scale,
          opacity: 0.55,
          letterSpacing: 28 * scale,
        }}
      >
        ✦ ✦ ✦
      </div>
    </div>
  );
}