import { resolveTitleSize } from "@/lib/auto-font-size";
import type { Format, HeaderInfo, Palette } from "@/types/poster";

interface PosterHeaderProps {
  title: string;
  header: HeaderInfo;
  palette: Palette;
  format: Format;
  titleFontFamily: string;
  titleColor: string;
  titleScale?: number;
}

export function PosterHeader({
  title,
  header,
  palette,
  format,
  titleFontFamily,
  titleColor,
  titleScale = 1,
}: PosterHeaderProps) {
  const scale = format.height / 1350;
  const titleSize = resolveTitleSize(
    title.length,
    340 * scale,
    format.height,
    titleScale,
  );
  const hasPanchang = Boolean(header.paksha || header.tithi || header.nakshatra);

  return (
    <div
      className="grid shrink-0 items-center gap-2 overflow-hidden px-10"
      style={{
        height: 180 * scale,
        backgroundColor: palette.bar,
        gridTemplateColumns: "1fr auto 1fr",
      }}
    >
      <div className="flex min-w-0 flex-col items-start gap-1">
        <span
          style={{
            fontSize: 28 * scale,
            fontWeight: 700,
            color: palette.barText,
          }}
        >
          {header.gregDate}
        </span>
        {header.vsMonth && (
          <span
            style={{
              fontSize: 26 * scale,
              color: palette.barText,
              opacity: 0.7,
            }}
          >
            {header.vsMonth} {header.vsYear}
          </span>
        )}
        {header.nakshatra && (
          <span
            style={{
              fontSize: 20 * scale,
              fontWeight: 700,
              color: palette.barText,
              opacity: 0.85,
            }}
          >
            {header.nakshatra}
          </span>
        )}
      </div>

      <div className="max-w-[340px] min-w-0 overflow-hidden text-center">
        <span
          className="block truncate font-black"
          style={{
            fontSize: titleSize,
            color: titleColor,
            fontFamily: titleFontFamily,
          }}
        >
          {title || "प्रचोदयात्"}
        </span>
      </div>

      <div className="flex min-w-0 flex-col items-end gap-1 text-right">
        {hasPanchang ? (
          <>
            <span
              style={{
                fontSize: 26 * scale,
                fontWeight: 700,
                color: palette.barText,
              }}
            >
              {header.paksha} {header.tithi}
            </span>
            <span
              style={{
                fontSize: 22 * scale,
                color: palette.barText,
                opacity: 0.7,
              }}
            >
              {header.vaar}
            </span>
            {(header.yoga || header.karana) && (
              <span
                style={{
                  fontSize: 18 * scale,
                  fontWeight: 700,
                  color: palette.barText,
                  opacity: 0.85,
                }}
              >
                {header.yoga} {header.yoga && header.karana ? "|" : ""}{" "}
                {header.karana}
              </span>
            )}
          </>
        ) : (
          <span
            style={{
              fontSize: 26 * scale,
              fontWeight: 700,
              color: palette.barText,
            }}
          >
            {header.vaar}
          </span>
        )}
      </div>
    </div>
  );
}