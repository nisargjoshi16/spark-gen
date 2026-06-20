import { resolveQuoteSize } from "@/lib/auto-font-size";
import { stripFormatting } from "@/lib/format-text";
import { FormattedQuote } from "@/components/poster/FormattedQuote";
import type { Format, Palette, PosterInput } from "@/types/poster";

interface SunriseWaveBodyProps {
  input: PosterInput;
  palette: Palette;
  format: Format;
  contentFontFamily: string;
  quoteColor: string;
  quoteScale: number;
}

function WaveTop({ color, scale }: { color: string; scale: number }) {
  return (
    <svg
      className="block w-full shrink-0"
      viewBox="0 0 1080 80"
      preserveAspectRatio="none"
      style={{ height: 80 * scale, marginBottom: -2 * scale }}
    >
      <path
        d="M0,0 L1080,0 L1080,40 Q810,80 540,50 Q270,20 0,60 Z"
        fill={color}
        opacity={0.6}
      />
      <path
        d="M0,0 L1080,0 L1080,25 Q810,60 540,35 Q270,10 0,45 Z"
        fill={color}
        opacity={0.35}
      />
    </svg>
  );
}

function WaveBottom({ color, scale }: { color: string; scale: number }) {
  return (
    <svg
      className="block w-full shrink-0"
      viewBox="0 0 1080 80"
      preserveAspectRatio="none"
      style={{ height: 80 * scale, marginTop: -2 * scale }}
    >
      <path
        d="M0,80 L1080,80 L1080,40 Q810,0 540,30 Q270,60 0,20 Z"
        fill={color}
        opacity={0.6}
      />
      <path
        d="M0,80 L1080,80 L1080,55 Q810,20 540,45 Q270,70 0,35 Z"
        fill={color}
        opacity={0.35}
      />
    </svg>
  );
}

export function SunriseWaveBody({
  input,
  palette,
  format,
  contentFontFamily,
  quoteColor,
  quoteScale,
}: SunriseWaveBodyProps) {
  const scale = format.height / 1350;
  const quote = input.quote.trim();
  const ref = input.ref.trim() || input.author.trim();
  const waveColor = palette.wave || palette.bar;
  const quoteSize = resolveQuoteSize(
    stripFormatting(quote).length,
    format.width - 180 * scale,
    format.height * 0.4,
    format.height,
    quoteScale,
  );

  return (
    <div
      className="body flex flex-1 flex-col overflow-hidden"
      style={{ backgroundColor: palette.bg }}
    >
      <WaveTop color={waveColor} scale={scale} />
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden"
        style={{ padding: `${40 * scale}px ${90 * scale}px` }}
      >
        <div className="relative z-10 flex flex-col items-center gap-5 text-center">
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
      <WaveBottom color={waveColor} scale={scale} />
    </div>
  );
}