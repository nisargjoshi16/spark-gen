import { fitFontSize } from "@/lib/auto-font-size";
import type { Format, Palette, PosterInput } from "@/types/poster";

interface TraditionalVibrantBodyProps {
  input: PosterInput;
  palette: Palette;
  format: Format;
}

export function TraditionalVibrantBody({
  input,
  palette,
  format,
}: TraditionalVibrantBodyProps) {
  const scale = format.height / 1350;
  const quote = input.quote.trim();
  const ref = input.ref.trim() || input.author.trim();
  const quoteSize = fitFontSize(
    quote.length,
    format.width - 200 * scale,
    format.height * 0.38,
    format.height,
  );
  const ornament = palette.accent;

  return (
    <div
      className="relative flex flex-1 items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${palette.bar} 0%, ${palette.bg} 100%)`,
        padding: `${100 * scale}px ${80 * scale}px`,
      }}
    >
      <div
        className="pointer-events-none absolute"
        style={{
          top: 30 * scale,
          left: 30 * scale,
          right: 30 * scale,
          bottom: 30 * scale,
          border: `${8 * scale}px solid ${ornament}E6`,
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          top: 50 * scale,
          left: 50 * scale,
          right: 50 * scale,
          bottom: 50 * scale,
          border: `${4 * scale}px solid ${ornament}B3`,
        }}
      />

      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          top: 170 * scale,
          width: 100 * scale,
          height: 100 * scale,
          background: `radial-gradient(circle, ${ornament}E6 15%, transparent 15%)`,
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 font-black"
        style={{
          top: 240 * scale,
          fontSize: 42 * scale,
          color: `${ornament}E6`,
        }}
      >
        ॐ
      </div>

      <div
        className="relative z-10 flex flex-col items-center gap-6 text-center"
        style={{ maxWidth: "82%" }}
      >
        <p
          className="font-bold"
          style={{
            color: palette.text,
            fontSize: quoteSize,
            lineHeight: 1.45,
            whiteSpace: "pre-wrap",
          }}
        >
          {quote || "Your quote will appear here"}
        </p>
        {ref && (
          <p
            style={{
              color: palette.accent,
              fontSize: 36 * scale,
              opacity: 0.9,
              letterSpacing: 2 * scale,
              borderBottom: `${3 * scale}px solid ${palette.accent}`,
              paddingBottom: 8 * scale,
            }}
          >
            {ref}
          </p>
        )}
      </div>

      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          bottom: 170 * scale,
          width: 80 * scale,
          height: 80 * scale,
          background: `radial-gradient(circle, ${ornament}E6 15%, transparent 15%)`,
        }}
      />
    </div>
  );
}