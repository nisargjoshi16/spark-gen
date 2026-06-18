import { fitFontSize } from "@/lib/auto-font-size";
import { stripFormatting } from "@/lib/format-text";
import { FormattedQuote } from "@/components/poster/FormattedQuote";
import type { Format, Palette, PosterInput } from "@/types/poster";

interface CornerFrameBodyProps {
  input: PosterInput;
  palette: Palette;
  format: Format;
  contentFontFamily: string;
}

function CornerBracket({
  palette,
  scale,
  position,
}: {
  palette: Palette;
  scale: number;
  position: "tl" | "tr" | "bl" | "br";
}) {
  const inset = 56 * scale;
  const arm = 64 * scale;
  const stroke = 4 * scale;
  const color = palette.accent;

  return (
    <div
      className="absolute"
      style={{
        top: position.startsWith("t") ? inset : undefined,
        bottom: position.startsWith("b") ? inset : undefined,
        left: position.endsWith("l") ? inset : undefined,
        right: position.endsWith("r") ? inset : undefined,
        width: arm,
        height: arm,
        borderTop: position.startsWith("t")
          ? `${stroke}px solid ${color}`
          : undefined,
        borderBottom: position.startsWith("b")
          ? `${stroke}px solid ${color}`
          : undefined,
        borderLeft: position.endsWith("l")
          ? `${stroke}px solid ${color}`
          : undefined,
        borderRight: position.endsWith("r")
          ? `${stroke}px solid ${color}`
          : undefined,
        opacity: 0.75,
      }}
    />
  );
}

export function CornerFrameBody({
  input,
  palette,
  format,
  contentFontFamily,
}: CornerFrameBodyProps) {
  const scale = format.height / 1350;
  const quote = input.quote.trim();
  const ref = input.ref.trim() || input.author.trim();
  const quoteSize = fitFontSize(
    stripFormatting(quote).length,
    format.width - 220 * scale,
    format.height * 0.48,
    format.height,
  );

  return (
    <div
      className="body relative flex flex-1 items-center justify-center overflow-hidden"
      style={{ backgroundColor: palette.bg }}
    >
      {(["tl", "tr", "bl", "br"] as const).map((position) => (
        <CornerBracket
          key={position}
          palette={palette}
          scale={scale}
          position={position}
        />
      ))}
      <div
        className="relative z-10 flex flex-col items-center gap-5 text-center"
        style={{ maxWidth: "82%", padding: `${40 * scale}px` }}
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