import type { Format, Palette } from "@/types/poster";

interface PosterFooterProps {
  footer: string;
  palette: Palette;
  format: Format;
}

export function PosterFooter({ footer, palette, format }: PosterFooterProps) {
  const scale = format.height / 1350;

  return (
    <div
      className="flex shrink-0 items-center justify-center px-10"
      style={{
        height: 140 * scale,
        backgroundColor: palette.bar,
      }}
    >
      <span
        style={{
          fontSize: 42 * scale,
          color: palette.barText,
        }}
      >
        {footer}
      </span>
    </div>
  );
}