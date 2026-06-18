"use client";

import { forwardRef, useEffect, useState } from "react";
import { PosterFooter } from "@/components/poster/PosterFooter";
import { PosterHeader } from "@/components/poster/PosterHeader";
import { QuoteBoxBody } from "@/components/poster/templates/QuoteBoxBody";
import { ShlokaBody } from "@/components/poster/templates/ShlokaBody";
import { TraditionalVibrantBody } from "@/components/poster/templates/TraditionalVibrantBody";
import { getFontFamily } from "@/lib/fonts";
import { getWatermarkForOrg } from "@/lib/orgs";
import { computePanchang } from "@/lib/panchang";
import { getFallbackHeader } from "@/lib/panchang-fallback";
import type {
  DesignTemplateId,
  Format,
  HeaderInfo,
  Org,
  Palette,
  PosterInput,
  PosterOptions,
} from "@/types/poster";

interface PosterCardProps {
  input: PosterInput;
  templateId: DesignTemplateId;
  palette: Palette;
  format: Format;
  options: PosterOptions;
  org: Org;
  panchangDate?: string;
}

export const PosterCard = forwardRef<HTMLDivElement, PosterCardProps>(
  function PosterCard(
    { input, templateId, palette, format, options, org, panchangDate },
    ref,
  ) {
    const [header, setHeader] = useState<HeaderInfo>(getFallbackHeader());

    useEffect(() => {
      setHeader(computePanchang(panchangDate));
    }, [panchangDate]);

    const scale = format.height / 1350;
    const watermark = getWatermarkForOrg(org, options.showWatermark);

    const body =
      templateId === "quote_box" ? (
        <QuoteBoxBody input={input} palette={palette} format={format} />
      ) : templateId === "traditional_vibrant" ? (
        <TraditionalVibrantBody
          input={input}
          palette={palette}
          format={format}
        />
      ) : (
        <ShlokaBody input={input} palette={palette} format={format} />
      );

    return (
      <div
        ref={ref}
        className="relative flex shrink-0 flex-col overflow-hidden"
        style={{
          width: format.width,
          height: format.height,
          fontFamily: getFontFamily(options.fontId),
        }}
      >
        <PosterHeader
          title={input.title}
          header={header}
          palette={palette}
          format={format}
        />

        {header.festival && (
          <div
            className="shrink-0 text-center font-black"
            style={{
              backgroundColor: palette.bar,
              color: palette.accent,
              fontSize: 22 * scale,
              padding: `${8 * scale}px 0`,
              borderTop: `${2 * scale}px solid ${palette.accent}`,
            }}
          >
            {header.festival}
          </div>
        )}

        {body}

        <PosterFooter org={org} palette={palette} format={format} />

        {watermark && (
          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 font-medium tracking-widest"
            style={{
              bottom: 150 * scale,
              fontSize: 18 * scale,
              color: palette.text,
              opacity: 0.25,
            }}
          >
            {watermark}
          </div>
        )}
      </div>
    );
  },
);