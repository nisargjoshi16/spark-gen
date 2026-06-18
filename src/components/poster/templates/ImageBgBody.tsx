import { FormattedQuote } from "@/components/poster/FormattedQuote";
import { getTextBoxGradient, imageBgQuoteFontSize } from "@/lib/image-bg";
import { stripFormatting } from "@/lib/format-text";
import type {
  BackgroundImageState,
  Format,
  Palette,
  PosterInput,
  TextPlacement,
} from "@/types/poster";

interface ImageBgBodyProps {
  input: PosterInput;
  palette: Palette;
  format: Format;
  backgroundImage: BackgroundImageState | null;
  textPlacement: TextPlacement;
}

export function ImageBgBody({
  input,
  palette,
  format,
  backgroundImage,
  textPlacement,
}: ImageBgBodyProps) {
  const scale = format.height / 1350;
  const quote = input.quote.trim();
  const ref = input.ref.trim() || input.author.trim();
  const quoteSize = imageBgQuoteFontSize(
    stripFormatting(quote).length,
    format.height,
  );
  const refSize = Math.max(Math.round(18 * scale), Math.round(quoteSize * 0.52));

  return (
    <div
      className="relative flex flex-1 flex-col overflow-hidden"
      style={{
        justifyContent: textPlacement === "top" ? "flex-start" : "flex-end",
      }}
    >
      {!backgroundImage && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: palette.bg2 }}
        >
          <span
            className="text-center font-medium"
            style={{
              color: palette.text,
              fontSize: 28 * scale,
              opacity: 0.45,
              padding: `${40 * scale}px`,
            }}
          >
            Upload a photo to use this template
          </span>
        </div>
      )}

      <div
        className="flex w-full flex-col justify-center overflow-hidden"
        style={{
          background: getTextBoxGradient(palette.bg, textPlacement),
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          padding: `${16 * scale}px ${28 * scale}px`,
          maxHeight: "72%",
        }}
      >
        <FormattedQuote
          text={quote}
          accent={palette.accent}
          className="text-center font-bold"
          style={{
            color: palette.text,
            fontSize: quoteSize,
            lineHeight: quoteSize > 60 * scale ? 1.4 : 1.35,
            wordWrap: "break-word",
            textShadow: "1px 1px 6px rgba(0,0,0,0.4)",
          }}
        />
        {ref && (
          <p
            className="text-center"
            style={{
              color: palette.accent,
              fontSize: refSize,
              opacity: 0.85,
              marginTop: 20 * scale,
              whiteSpace: "pre-wrap",
            }}
          >
            — {ref}
          </p>
        )}
      </div>
    </div>
  );
}