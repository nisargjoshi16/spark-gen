"use client";

import { forwardRef, useEffect, useState } from "react";
import { FontLoader } from "@/components/FontLoader";
import { TemplateUiFontLoader } from "@/components/TemplateUiFontLoader";
import { PosterFooter } from "@/components/poster/PosterFooter";
import { PosterHeader } from "@/components/poster/PosterHeader";
import { ImageBgBody } from "@/components/poster/templates/ImageBgBody";
import { QuoteBoxBody } from "@/components/poster/templates/QuoteBoxBody";
import { ShlokaBody } from "@/components/poster/templates/ShlokaBody";
import { TraditionalVibrantBody } from "@/components/poster/templates/TraditionalVibrantBody";
import { getContentFontFamily, TEMPLATE_UI_FONT } from "@/lib/fonts";
import { getWatermarkForOrg } from "@/lib/orgs";
import { computePanchang } from "@/lib/panchang";
import { getFallbackHeader } from "@/lib/panchang-fallback";
import type {
  BackgroundImageState,
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
  backgroundImage?: BackgroundImageState | null;
}

export const PosterCard = forwardRef<HTMLDivElement, PosterCardProps>(
  function PosterCard(
    {
      input,
      templateId,
      palette,
      format,
      options,
      org,
      panchangDate,
      backgroundImage = null,
    },
    ref,
  ) {
    const [header, setHeader] = useState<HeaderInfo>(getFallbackHeader());

    useEffect(() => {
      setHeader(computePanchang(panchangDate));
    }, [panchangDate]);

    const scale = format.height / 1350;
    const watermark = getWatermarkForOrg(org, options.showWatermark);

    const isImageBg = templateId === "image_bg";
    const textPlacement = backgroundImage?.textPlacement ?? "bottom";
    const contentFont = getContentFontFamily(options.fontId);

    const body = isImageBg ? (
      <ImageBgBody
        input={input}
        palette={palette}
        format={format}
        backgroundImage={backgroundImage}
        textPlacement={textPlacement}
        contentFontFamily={contentFont}
        quoteScale={options.imageBgQuoteScale}
        boxOpacity={options.imageBgBoxOpacity}
      />
    ) : templateId === "quote_box" ? (
      <QuoteBoxBody
        input={input}
        palette={palette}
        format={format}
        contentFontFamily={contentFont}
      />
    ) : templateId === "traditional_vibrant" ? (
      <TraditionalVibrantBody
        input={input}
        palette={palette}
        format={format}
        contentFontFamily={contentFont}
      />
    ) : (
      <ShlokaBody
        input={input}
        palette={palette}
        format={format}
        contentFontFamily={contentFont}
      />
    );

    return (
      <>
        <TemplateUiFontLoader />
        <FontLoader fontId={options.fontId} />
        <div
          ref={ref}
          className="relative flex shrink-0 flex-col overflow-hidden"
        style={{
          width: format.width,
          height: format.height,
          fontFamily: TEMPLATE_UI_FONT,
          ...(isImageBg && backgroundImage
            ? {
                backgroundImage: `url(${backgroundImage.dataUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}),
        }}
      >
        <PosterHeader
          title={input.title}
          header={header}
          palette={palette}
          format={format}
          contentFontFamily={contentFont}
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

        <PosterFooter
          org={org}
          palette={palette}
          format={format}
          contentFontFamily={contentFont}
        />

        {watermark && (
          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 font-medium tracking-widest"
            style={{
              bottom: 150 * scale,
              fontSize: 18 * scale,
              color: palette.text,
              opacity: 0.25,
              fontFamily: contentFont,
            }}
          >
            {watermark}
          </div>
        )}
        </div>
      </>
    );
  },
);