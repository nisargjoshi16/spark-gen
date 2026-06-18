import { fitFontSize } from "@/lib/auto-font-size";
import type { Format, Palette, PosterInput } from "@/types/poster";

interface QuoteBoxBodyProps {
  input: PosterInput;
  palette: Palette;
  format: Format;
}

export function QuoteBoxBody({ input, palette, format }: QuoteBoxBodyProps) {
  const scale = format.height / 1350;
  const quote = input.quote.trim();
  const ref = input.ref.trim() || input.author.trim();
  const quoteSize = fitFontSize(
    quote.length,
    format.width - 180 * scale,
    format.height * 0.42,
    format.height,
  );

  return (
    <div
      className="relative flex flex-1 items-center justify-center overflow-hidden"
      style={{
        backgroundColor: palette.bg,
        padding: `${80 * scale}px ${90 * scale}px`,
      }}
    >
      <span
        className="absolute select-none font-black"
        style={{
          top: 30 * scale,
          left: 50 * scale,
          fontSize: 240 * scale,
          color: palette.accent,
          opacity: 0.13,
          fontFamily: "Georgia, serif",
          lineHeight: 1,
        }}
      >
        &ldquo;
      </span>
      <span
        className="absolute select-none font-black"
        style={{
          bottom: -30 * scale,
          right: 50 * scale,
          fontSize: 240 * scale,
          color: palette.accent,
          opacity: 0.13,
          fontFamily: "Georgia, serif",
          lineHeight: 1,
        }}
      >
        &rdquo;
      </span>

      <div
        className="relative z-10 flex flex-col items-center gap-6 text-center"
        style={{ maxWidth: "88%" }}
      >
        <p
          className="font-bold"
          style={{
            color: palette.text,
            fontSize: quoteSize,
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
          }}
        >
          {quote || "Your quote will appear here"}
        </p>
        {ref && (
          <p
            style={{
              color: palette.accent,
              fontSize: 38 * scale,
              opacity: 0.85,
            }}
          >
            — {ref}
          </p>
        )}
      </div>
    </div>
  );
}