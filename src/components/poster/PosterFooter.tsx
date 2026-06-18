import type { Format, Org, Palette } from "@/types/poster";

interface PosterFooterProps {
  org: Org;
  palette: Palette;
  format: Format;
  contentFontFamily: string;
}

export function PosterFooter({
  org,
  palette,
  format,
  contentFontFamily,
}: PosterFooterProps) {
  const scale = format.height / 1350;

  return (
    <div
      className="flex shrink-0 items-center justify-center gap-6 overflow-visible px-10"
      style={{
        height: 140 * scale,
        backgroundColor: palette.bar,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={org.logoPath}
        alt=""
        className="w-auto object-contain"
        style={{
          height: 145 * scale,
          marginTop: -40 * scale,
          mixBlendMode: "screen",
        }}
      />
      <span
        style={{
          fontSize: 42 * scale,
          color: palette.barText,
          fontFamily: contentFontFamily,
        }}
      >
        {org.footer}
      </span>
    </div>
  );
}