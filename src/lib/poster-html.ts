import {
  resolveQuoteSize,
  resolveTitleSize,
} from "@/lib/auto-font-size";
import {
  escapeHtml,
  formatTextToHtml,
  stripFormatting,
} from "@/lib/format-text";
import {
  getFontFamilyCss,
  getGoogleFontsUrls,
  TEMPLATE_UI_FONT,
  TEMPLATE_UI_FONTS_URL,
} from "@/lib/fonts";
import { getHeaderInfoServer } from "@/lib/header";
import { getFormat } from "@/lib/formats";
import {
  getTextBoxGradient,
  hexToRgba,
  resolveImageBgQuoteSize,
} from "@/lib/image-bg";
import { getOrgLogoBase64 } from "@/lib/org-server";
import { getOrg, getWatermarkForOrg } from "@/lib/orgs";
import { getPalette } from "@/lib/palettes";
import {
  effectiveQuoteColor,
  effectiveQuoteFontId,
  effectiveQuoteScale,
  effectiveTitleColor,
  effectiveTitleFontId,
  type GeneratePosterRequest,
  type TextPlacement,
} from "@/types/poster";

function renderShlokaBody(
  quote: string,
  ref: string,
  palette: ReturnType<typeof getPalette>,
  format: ReturnType<typeof getFormat>,
  quoteColor: string,
  quoteScale = 1,
): string {
  const scale = format.height / 1350;
  const quoteSize = resolveQuoteSize(
    stripFormatting(quote).length,
    format.width - 140 * scale,
    format.height * 0.45,
    format.height,
    quoteScale,
  );

  return `
    <div class="body shloka" style="background:${palette.bg};padding:${70 * scale}px ${80 * scale}px;">
      <div class="border-outer" style="border-color:${palette.accent};top:${24 * scale}px;left:${24 * scale}px;right:${24 * scale}px;bottom:${24 * scale}px;"></div>
      <div class="border-inner" style="border-color:${palette.accent};top:${36 * scale}px;left:${36 * scale}px;right:${36 * scale}px;bottom:${36 * scale}px;"></div>
      <div class="om-top" style="color:${palette.accent};font-size:${28 * scale}px;letter-spacing:${20 * scale}px;top:${52 * scale}px;">ॐ ✦ ✦ ✦</div>
      <div class="text-group">
        <div class="main-text" id="mt" style="color:${quoteColor};font-size:${quoteSize}px;">${formatTextToHtml(quote, palette.accent)}</div>
        ${ref ? `<div class="ref-text" style="color:${palette.accent};font-size:${38 * scale}px;">${escapeHtml(ref)}</div>` : ""}
      </div>
      <div class="om-bottom" style="color:${palette.accent};font-size:${22 * scale}px;letter-spacing:${28 * scale}px;bottom:${52 * scale}px;">✦ ✦ ✦</div>
    </div>`;
}

function renderQuoteBoxBody(
  quote: string,
  ref: string,
  palette: ReturnType<typeof getPalette>,
  format: ReturnType<typeof getFormat>,
  quoteColor: string,
  quoteScale = 1,
): string {
  const scale = format.height / 1350;
  const quoteSize = resolveQuoteSize(
    stripFormatting(quote).length,
    format.width - 180 * scale,
    format.height * 0.42,
    format.height,
    quoteScale,
  );

  return `
    <div class="body quote-box" style="background:${palette.bg};padding:${80 * scale}px ${90 * scale}px;">
      <div class="quote-open" style="color:${palette.accent};font-size:${240 * scale}px;top:${30 * scale}px;left:${50 * scale}px;">&ldquo;</div>
      <div class="quote-close" style="color:${palette.accent};font-size:${240 * scale}px;bottom:${-30 * scale}px;right:${50 * scale}px;">&rdquo;</div>
      <div class="text-group">
        <div class="main-text" id="mt" style="color:${quoteColor};font-size:${quoteSize}px;">${formatTextToHtml(quote, palette.accent)}</div>
        ${ref ? `<div class="ref-text" style="color:${palette.accent};font-size:${38 * scale}px;">${escapeHtml(ref)}</div>` : ""}
      </div>
    </div>`;
}

function renderTraditionalBody(
  quote: string,
  ref: string,
  palette: ReturnType<typeof getPalette>,
  format: ReturnType<typeof getFormat>,
  quoteColor: string,
  quoteScale = 1,
): string {
  const scale = format.height / 1350;
  const quoteSize = resolveQuoteSize(
    stripFormatting(quote).length,
    format.width - 200 * scale,
    format.height * 0.38,
    format.height,
    quoteScale,
  );

  return `
    <div class="body traditional" style="background:linear-gradient(180deg,${palette.bar} 0%,${palette.bg} 100%);padding:${100 * scale}px ${80 * scale}px;">
      <div class="border-outer heavy" style="border-color:${palette.accent};top:${30 * scale}px;left:${30 * scale}px;right:${30 * scale}px;bottom:${30 * scale}px;"></div>
      <div class="border-inner heavy" style="border-color:${palette.accent};top:${50 * scale}px;left:${50 * scale}px;right:${50 * scale}px;bottom:${50 * scale}px;"></div>
      <div class="om-center" style="color:${palette.accent};font-size:${42 * scale}px;top:${240 * scale}px;">ॐ</div>
      <div class="text-group">
        <div class="main-text" id="mt" style="color:${quoteColor};font-size:${quoteSize}px;">${formatTextToHtml(quote, palette.accent)}</div>
        ${ref ? `<div class="ref-text traditional-ref" style="color:${palette.accent};font-size:${36 * scale}px;border-color:${palette.accent};">${escapeHtml(ref)}</div>` : ""}
      </div>
    </div>`;
}

function renderDiagonalSplitBody(
  quote: string,
  ref: string,
  palette: ReturnType<typeof getPalette>,
  format: ReturnType<typeof getFormat>,
  quoteColor: string,
  quoteScale = 1,
): string {
  const scale = format.height / 1350;
  const quoteSize = resolveQuoteSize(
    stripFormatting(quote).length,
    format.width - 180 * scale,
    format.height * 0.5,
    format.height,
    quoteScale,
  );

  return `
    <div class="body diagonal-split" style="background:${palette.bg};">
      <div class="diagonal-overlay" style="border-color:transparent transparent ${palette.bg2} transparent;border-width:0 0 ${1090 * scale}px ${1080 * scale}px;"></div>
      <div class="text-group" style="padding:${60 * scale}px ${90 * scale}px;">
        <div class="main-text" id="mt" style="color:${quoteColor};font-size:${quoteSize}px;">${formatTextToHtml(quote, palette.accent)}</div>
        ${ref ? `<div class="ref-text" style="color:${palette.accent};font-size:${38 * scale}px;">${escapeHtml(ref)}</div>` : ""}
      </div>
    </div>`;
}

function renderMandalaCircleBody(
  quote: string,
  ref: string,
  palette: ReturnType<typeof getPalette>,
  format: ReturnType<typeof getFormat>,
  quoteColor: string,
  quoteScale = 1,
): string {
  const scale = format.height / 1350;
  const quoteSize = resolveQuoteSize(
    stripFormatting(quote).length,
    680 * scale,
    format.height * 0.42,
    format.height,
    quoteScale,
  );
  const rings = [
    { size: 860, border: "3px solid", opacity: 0.5 },
    { size: 820, border: "1px dashed", opacity: 0.3 },
    { size: 760, border: "2px solid", opacity: 0.35 },
    { size: 700, border: "1px dotted", opacity: 0.2 },
  ];
  const ringHtml = rings
    .map(
      (ring) =>
        `<div class="mandala-ring" style="width:${ring.size * scale}px;height:${ring.size * scale}px;border:${ring.border} ${palette.accent};opacity:${ring.opacity};"></div>`,
    )
    .join("");

  return `
    <div class="body mandala-circle" style="background:${palette.bg};">
      ${ringHtml}
      <div class="text-group" style="max-width:${680 * scale}px;">
        <div class="main-text" id="mt" style="color:${quoteColor};font-size:${quoteSize}px;">${formatTextToHtml(quote, palette.accent)}</div>
        ${ref ? `<div class="ref-text" style="color:${palette.accent};font-size:${38 * scale}px;">${escapeHtml(ref)}</div>` : ""}
      </div>
    </div>`;
}

function renderLeftAccentBody(
  quote: string,
  ref: string,
  palette: ReturnType<typeof getPalette>,
  format: ReturnType<typeof getFormat>,
  quoteColor: string,
  quoteScale = 1,
): string {
  const scale = format.height / 1350;
  const quoteSize = resolveQuoteSize(
    stripFormatting(quote).length,
    format.width - 200 * scale,
    format.height * 0.48,
    format.height,
    quoteScale,
  );

  return `
    <div class="body left-accent" style="background:${palette.bg};padding:${60 * scale}px ${100 * scale}px ${60 * scale}px 0;">
      <div class="accent-bar" style="background:${palette.accent};width:${10 * scale}px;min-height:${200 * scale}px;border-radius:0 ${6 * scale}px ${6 * scale}px 0;margin-right:${60 * scale}px;"></div>
      <div class="text-block">
        <div class="main-text left-align" id="mt" style="color:${quoteColor};font-size:${quoteSize}px;">${formatTextToHtml(quote, palette.accent)}</div>
        ${ref ? `<div class="ref-text left-align" style="color:${palette.accent};font-size:${38 * scale}px;margin-top:${16 * scale}px;">${escapeHtml(ref)}</div>` : ""}
      </div>
    </div>`;
}

function renderSunriseWaveBody(
  quote: string,
  ref: string,
  palette: ReturnType<typeof getPalette>,
  format: ReturnType<typeof getFormat>,
  quoteColor: string,
  quoteScale = 1,
): string {
  const scale = format.height / 1350;
  const waveColor = palette.wave || palette.bar;
  const quoteSize = resolveQuoteSize(
    stripFormatting(quote).length,
    format.width - 180 * scale,
    format.height * 0.4,
    format.height,
    quoteScale,
  );

  return `
    <div class="body sunrise-wave" style="background:${palette.bg};">
      <svg class="wave-band" viewBox="0 0 1080 80" preserveAspectRatio="none" style="height:${80 * scale}px;">
        <path d="M0,0 L1080,0 L1080,40 Q810,80 540,50 Q270,20 0,60 Z" fill="${waveColor}" opacity="0.6"/>
        <path d="M0,0 L1080,0 L1080,25 Q810,60 540,35 Q270,10 0,45 Z" fill="${waveColor}" opacity="0.35"/>
      </svg>
      <div class="wave-content" style="padding:${40 * scale}px ${90 * scale}px;">
        <div class="text-group">
          <div class="main-text" id="mt" style="color:${quoteColor};font-size:${quoteSize}px;">${formatTextToHtml(quote, palette.accent)}</div>
          ${ref ? `<div class="ref-text" style="color:${palette.accent};font-size:${38 * scale}px;">${escapeHtml(ref)}</div>` : ""}
        </div>
      </div>
      <svg class="wave-band" viewBox="0 0 1080 80" preserveAspectRatio="none" style="height:${80 * scale}px;">
        <path d="M0,80 L1080,80 L1080,40 Q810,0 540,30 Q270,60 0,20 Z" fill="${waveColor}" opacity="0.6"/>
        <path d="M0,80 L1080,80 L1080,55 Q810,20 540,45 Q270,70 0,35 Z" fill="${waveColor}" opacity="0.35"/>
      </svg>
    </div>`;
}

function renderCornerFrameBody(
  quote: string,
  ref: string,
  palette: ReturnType<typeof getPalette>,
  format: ReturnType<typeof getFormat>,
  quoteColor: string,
  quoteScale = 1,
): string {
  const scale = format.height / 1350;
  const quoteSize = resolveQuoteSize(
    stripFormatting(quote).length,
    format.width - 220 * scale,
    format.height * 0.48,
    format.height,
    quoteScale,
  );
  const inset = 56 * scale;
  const arm = 64 * scale;
  const stroke = 4 * scale;
  const corner = (styles: string) =>
    `<div class="corner-bracket" style="width:${arm}px;height:${arm}px;${styles}"></div>`;

  const corners = [
    corner(
      `top:${inset}px;left:${inset}px;border-top:${stroke}px solid ${palette.accent};border-left:${stroke}px solid ${palette.accent};`,
    ),
    corner(
      `top:${inset}px;right:${inset}px;border-top:${stroke}px solid ${palette.accent};border-right:${stroke}px solid ${palette.accent};`,
    ),
    corner(
      `bottom:${inset}px;left:${inset}px;border-bottom:${stroke}px solid ${palette.accent};border-left:${stroke}px solid ${palette.accent};`,
    ),
    corner(
      `bottom:${inset}px;right:${inset}px;border-bottom:${stroke}px solid ${palette.accent};border-right:${stroke}px solid ${palette.accent};`,
    ),
  ].join("");

  return `
    <div class="body corner-frame" style="background:${palette.bg};">
      ${corners}
      <div class="text-group" style="max-width:82%;padding:${40 * scale}px;">
        <div class="main-text" id="mt" style="color:${quoteColor};font-size:${quoteSize}px;">${formatTextToHtml(quote, palette.accent)}</div>
        ${ref ? `<div class="ref-text" style="color:${palette.accent};font-size:${38 * scale}px;">${escapeHtml(ref)}</div>` : ""}
      </div>
    </div>`;
}

function renderGlowCenterBody(
  quote: string,
  ref: string,
  palette: ReturnType<typeof getPalette>,
  format: ReturnType<typeof getFormat>,
  quoteColor: string,
  quoteScale = 1,
): string {
  const scale = format.height / 1350;
  const quoteSize = resolveQuoteSize(
    stripFormatting(quote).length,
    format.width - 200 * scale,
    format.height * 0.46,
    format.height,
    quoteScale,
  );
  const glow = hexToRgba(palette.accent, 0.22);
  const glowOuter = hexToRgba(palette.accent, 0.08);
  const ringSize = 720 * scale;

  return `
    <div class="body glow-center" style="background:${palette.bg};">
      <div class="glow-orb" style="width:${ringSize}px;height:${ringSize}px;background:radial-gradient(circle, ${glow} 0%, ${glowOuter} 45%, transparent 72%);"></div>
      <div class="glow-ring" style="width:${ringSize * 0.72}px;height:${ringSize * 0.72}px;border:${2 * scale}px solid ${palette.accent};"></div>
      <div class="text-group glow-stack" style="max-width:80%;padding:${48 * scale}px;">
        <span class="glow-stars" style="color:${palette.accent};font-size:${32 * scale}px;">✦ ✦ ✦</span>
        <div class="main-text" id="mt" style="color:${quoteColor};font-size:${quoteSize}px;">${formatTextToHtml(quote, palette.accent)}</div>
        ${ref ? `<div class="ref-text" style="color:${palette.accent};font-size:${38 * scale}px;">${escapeHtml(ref)}</div>` : ""}
      </div>
    </div>`;
}

function renderMinimalRuleBody(
  quote: string,
  ref: string,
  palette: ReturnType<typeof getPalette>,
  format: ReturnType<typeof getFormat>,
  quoteColor: string,
  quoteScale = 1,
): string {
  const scale = format.height / 1350;
  const quoteSize = resolveQuoteSize(
    stripFormatting(quote).length,
    format.width - 200 * scale,
    format.height * 0.42,
    format.height,
    quoteScale,
  );

  return `
    <div class="body minimal-rule" style="background:${palette.bg};">
      <div class="text-group minimal-stack" style="max-width:84%;padding:${60 * scale}px;">
        <div class="rule-ornament">
          <div class="accent-rule wide" style="background:${palette.accent};height:${3 * scale}px;width:${140 * scale}px;"></div>
          <span class="rule-star" style="color:${palette.accent};font-size:${28 * scale}px;">✦</span>
        </div>
        <div class="main-text" id="mt" style="color:${quoteColor};font-size:${quoteSize}px;">${formatTextToHtml(quote, palette.accent)}</div>
        ${ref ? `<div class="accent-rule narrow" style="background:${palette.accent};height:${2 * scale}px;width:${100 * scale}px;"></div><div class="ref-text" style="color:${palette.accent};font-size:${38 * scale}px;">${escapeHtml(ref)}</div>` : ""}
      </div>
    </div>`;
}

function renderAccentCardBody(
  quote: string,
  ref: string,
  palette: ReturnType<typeof getPalette>,
  format: ReturnType<typeof getFormat>,
  quoteColor: string,
  quoteScale = 1,
): string {
  const scale = format.height / 1350;
  const quoteSize = resolveQuoteSize(
    stripFormatting(quote).length,
    format.width - 280 * scale,
    format.height * 0.38,
    format.height,
    quoteScale,
  );
  const panelBg = hexToRgba(palette.bg2, 0.72);

  return `
    <div class="body accent-card" style="background:${palette.bg};">
      <div class="accent-panel" style="background:${panelBg};border:${3 * scale}px solid ${palette.accent};padding:${56 * scale}px ${64 * scale}px;box-shadow:0 ${12 * scale}px ${40 * scale}px rgba(0,0,0,0.14);max-width:86%;">
        <div class="main-text" id="mt" style="color:${quoteColor};font-size:${quoteSize}px;">${formatTextToHtml(quote, palette.accent)}</div>
        ${ref ? `<div class="ref-text card-ref" style="color:${palette.accent};font-size:${38 * scale}px;border-top:${2 * scale}px solid ${palette.accent};padding-top:${20 * scale}px;">${escapeHtml(ref)}</div>` : ""}
      </div>
    </div>`;
}

function renderBodyHtml(
  templateId: GeneratePosterRequest["templateId"],
  quote: string,
  ref: string,
  palette: ReturnType<typeof getPalette>,
  format: ReturnType<typeof getFormat>,
  quoteColor: string,
  quoteScale = 1,
): string {
  switch (templateId) {
    case "quote_box":
      return renderQuoteBoxBody(quote, ref, palette, format, quoteColor, quoteScale);
    case "traditional_vibrant":
      return renderTraditionalBody(quote, ref, palette, format, quoteColor, quoteScale);
    case "diagonal_split":
      return renderDiagonalSplitBody(quote, ref, palette, format, quoteColor, quoteScale);
    case "mandala_circle":
      return renderMandalaCircleBody(quote, ref, palette, format, quoteColor, quoteScale);
    case "left_accent":
      return renderLeftAccentBody(quote, ref, palette, format, quoteColor, quoteScale);
    case "sunrise_wave":
      return renderSunriseWaveBody(quote, ref, palette, format, quoteColor, quoteScale);
    case "corner_frame":
      return renderCornerFrameBody(quote, ref, palette, format, quoteColor, quoteScale);
    case "glow_center":
      return renderGlowCenterBody(quote, ref, palette, format, quoteColor, quoteScale);
    case "minimal_rule":
      return renderMinimalRuleBody(quote, ref, palette, format, quoteColor, quoteScale);
    case "accent_card":
      return renderAccentCardBody(quote, ref, palette, format, quoteColor, quoteScale);
    default:
      return renderShlokaBody(quote, ref, palette, format, quoteColor, quoteScale);
  }
}

function buildImageBgPosterHtml(request: GeneratePosterRequest): string {
  const format = getFormat(request.formatId);
  const palette = getPalette(request.paletteId);
  const org = getOrg(request.orgId);
  const logoB64 = getOrgLogoBase64(org.id);
  const watermark = getWatermarkForOrg(org, request.options.showWatermark);
  const header = getHeaderInfoServer(request.panchangDate);
  const scale = format.height / 1350;
  const title = request.input.title.trim() || "प्रचोदयात्";
  const quote = request.input.quote.trim();
  const ref =
    request.input.ref.trim() || request.input.author.trim();
  const titleScale = request.options.titleScale ?? 1;
  const quoteScale = effectiveQuoteScale(request.options);
  const titleFontId = effectiveTitleFontId(request.options);
  const quoteFontId = effectiveQuoteFontId(request.options);
  const titleFont = getFontFamilyCss(titleFontId);
  const quoteFont = getFontFamilyCss(quoteFontId);
  const titleColor = effectiveTitleColor(request.options);
  const quoteColor = effectiveQuoteColor(request.options, palette);
  const titleSize = resolveTitleSize(
    title.length,
    340 * scale,
    format.height,
    titleScale,
  );
  const fontLinks = getGoogleFontsUrls(titleFontId, quoteFontId, request.options.fontId)
    .map((url) => `<link href="${url}" rel="stylesheet">`)
    .join("\n");
  const bg = request.backgroundImage!;
  const placement: TextPlacement = bg.textPlacement ?? "bottom";
  const quoteSize = resolveImageBgQuoteSize(
    stripFormatting(quote).length,
    format.height,
    quoteScale,
  );
  const refSize = Math.max(Math.round(18 * scale), Math.round(quoteSize * 0.52));
  const textPositionCss =
    placement === "top" ? "justify-content:flex-start;" : "justify-content:flex-end;";
  const textBoxGradient = getTextBoxGradient(
    palette.bg,
    placement,
    request.options.imageBgBoxOpacity ?? 0.82,
  );
  const bgDataUri = `data:${bg.mimeType};base64,${bg.base64}`;

  const festivalBanner = header.festival
    ? `<div class="festival">${escapeHtml(header.festival)}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<link href="${TEMPLATE_UI_FONTS_URL}" rel="stylesheet">
${fontLinks}
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:${format.width}px; height:${format.height}px; overflow:hidden;
    font-family:${TEMPLATE_UI_FONT};
    background-image:url("${bgDataUri}");
    background-size:cover; background-position:center;
    display:flex; flex-direction:column;
  }
  .header {
    height:${180 * scale}px; background:${palette.bar};
    display:grid; grid-template-columns:1fr auto 1fr; align-items:center;
    padding:0 ${40 * scale}px; gap:${8 * scale}px; flex-shrink:0; overflow:hidden;
  }
  .header-left, .header-right { display:flex; flex-direction:column; gap:${4 * scale}px; min-width:0; }
  .header-right { align-items:flex-end; text-align:right; }
  .greg { font-size:${28 * scale}px; font-weight:700; color:${palette.barText}; white-space:nowrap; }
  .vs { font-size:${26 * scale}px; color:${palette.barText}; opacity:0.7; white-space:nowrap; }
  .nakshatra { font-size:${20 * scale}px; font-weight:700; color:${palette.barText}; opacity:0.85; white-space:nowrap; }
  .title { font-size:${titleSize}px; font-weight:900; color:${titleColor}; max-width:${340 * scale}px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:center; font-family:${titleFont}; }
  .vaar, .tithi, .yoga { color:${palette.barText}; white-space:nowrap; }
  .vaar { font-size:${22 * scale}px; opacity:0.7; font-weight:700; }
  .tithi { font-size:${26 * scale}px; font-weight:700; }
  .yoga { font-size:${18 * scale}px; opacity:0.85; font-weight:700; }
  .festival {
    width:100%; background:${palette.bar}; color:${palette.accent};
    font-size:${22 * scale}px; font-weight:900; text-align:center;
    padding:${8 * scale}px 0; border-top:2px solid ${palette.accent}; flex-shrink:0;
  }
  .content {
    flex:1; display:flex; flex-direction:column; ${textPositionCss}
    overflow:hidden;
  }
  .text-box {
    background:${textBoxGradient};
    backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
    padding:${16 * scale}px ${28 * scale}px;
    width:100%; max-height:72%; overflow:hidden;
    display:flex; flex-direction:column; justify-content:center;
  }
  .main-text {
    font-size:${quoteSize}px; font-weight:700; color:${quoteColor};
    text-align:center; line-height:${quoteSize > 60 * scale ? 1.4 : 1.35};
    white-space:pre-wrap; word-wrap:break-word;
    text-shadow:1px 1px 6px rgba(0,0,0,0.4);
    font-family:${quoteFont};
  }
  .ref-text {
    font-size:${refSize}px; font-weight:400; color:${palette.accent};
    text-align:center; opacity:0.85; margin-top:${20 * scale}px;
    white-space:pre-wrap; word-wrap:break-word;
    font-family:${quoteFont};
  }
  .ref-text:empty { display:none; }
  .ref-text:not(:empty)::before { content:'— '; }
  .footer {
    height:${140 * scale}px; background:${palette.bar};
    display:flex; align-items:center; justify-content:center; gap:${24 * scale}px;
    padding:0 ${40 * scale}px; flex-shrink:0; overflow:visible;
  }
  .footer-logo {
    height:${145 * scale}px; margin-top:${-40 * scale}px; width:auto;
    object-fit:contain; background:transparent; mix-blend-mode:screen;
  }
  .footer-text { font-size:${42 * scale}px; color:${palette.barText}; font-family:${quoteFont}; }
  .watermark {
    position:absolute; left:50%; transform:translateX(-50%);
    bottom:${150 * scale}px; font-size:${18 * scale}px; opacity:0.25;
    letter-spacing:0.2em; text-transform:uppercase;
    font-family:${quoteFont};
  }
</style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <span class="greg">${header.gregDate}</span>
      <span class="vs">${header.vsMonth} ${header.vsYear}</span>
      <span class="nakshatra">${header.nakshatra}</span>
    </div>
    <span class="title">${escapeHtml(title)}</span>
    <div class="header-right">
      <span class="tithi">${header.paksha} ${header.tithi}</span>
      <span class="vaar">${header.vaar}</span>
      <span class="yoga">${header.yoga} | ${header.karana}</span>
    </div>
  </div>
  ${festivalBanner}
  <div class="content">
    <div class="text-box">
      <div class="main-text" id="mt">${formatTextToHtml(quote, palette.accent)}</div>
      ${ref ? `<div class="ref-text" id="rt">${escapeHtml(ref)}</div>` : '<div class="ref-text" id="rt"></div>'}
    </div>
  </div>
  <div class="footer">
    ${logoB64 ? `<img src="data:image/png;base64,${logoB64}" class="footer-logo" alt="">` : ""}
    <span class="footer-text">${escapeHtml(org.footer)}</span>
  </div>
  ${watermark ? `<div class="watermark">${escapeHtml(watermark)}</div>` : ""}
</body>
<script>
  document.fonts.ready.then(function() {
    var titleEl = document.querySelector('.title');
    if (titleEl) {
      var maxWidth = ${340 * scale};
      var fontSize = ${titleSize};
      while (fontSize > ${24 * scale}) {
        titleEl.style.fontSize = fontSize + 'px';
        if (titleEl.scrollWidth <= maxWidth - 4) break;
        fontSize -= ${2 * scale};
      }
    }
  });
</script>
</html>`;
}

export function buildPosterHtml(request: GeneratePosterRequest): string {
  if (request.templateId === "image_bg") {
    return buildImageBgPosterHtml(request);
  }

  const format = getFormat(request.formatId);
  const palette = getPalette(request.paletteId);
  const org = getOrg(request.orgId);
  const logoB64 = getOrgLogoBase64(org.id);
  const watermark = getWatermarkForOrg(org, request.options.showWatermark);
  const header = getHeaderInfoServer(request.panchangDate);
  const scale = format.height / 1350;
  const title = request.input.title.trim() || "प्रचोदयात्";
  const quote = request.input.quote.trim();
  const ref =
    request.input.ref.trim() || request.input.author.trim();
  const titleScale = request.options.titleScale ?? 1;
  const quoteScale = effectiveQuoteScale(request.options);
  const titleFontId = effectiveTitleFontId(request.options);
  const quoteFontId = effectiveQuoteFontId(request.options);
  const titleFont = getFontFamilyCss(titleFontId);
  const quoteFont = getFontFamilyCss(quoteFontId);
  const titleColor = effectiveTitleColor(request.options);
  const quoteColor = effectiveQuoteColor(request.options, palette);
  const titleSize = resolveTitleSize(
    title.length,
    340 * scale,
    format.height,
    titleScale,
  );
  const fontLinks = getGoogleFontsUrls(titleFontId, quoteFontId, request.options.fontId)
    .map((url) => `<link href="${url}" rel="stylesheet">`)
    .join("\n");

  const bodyHtml = renderBodyHtml(
    request.templateId,
    quote,
    ref,
    palette,
    format,
    quoteColor,
    quoteScale,
  );

  const panchangRight = `<span class="tithi">${header.paksha} ${header.tithi}</span>
       <span class="vaar">${header.vaar}</span>
       <span class="yoga">${header.yoga} | ${header.karana}</span>`;

  const festivalBanner = header.festival
    ? `<div class="festival">${escapeHtml(header.festival)}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<link href="${TEMPLATE_UI_FONTS_URL}" rel="stylesheet">
${fontLinks}
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:${format.width}px; height:${format.height}px; overflow:hidden;
    font-family:${TEMPLATE_UI_FONT};
    display:flex; flex-direction:column;
  }
  .header {
    height:${180 * scale}px; background:${palette.bar};
    display:grid; grid-template-columns:1fr auto 1fr; align-items:center;
    padding:0 ${40 * scale}px; gap:${8 * scale}px; flex-shrink:0;
  }
  .header-left, .header-right { display:flex; flex-direction:column; gap:${4 * scale}px; }
  .header-right { align-items:flex-end; text-align:right; }
  .greg { font-size:${28 * scale}px; font-weight:700; color:${palette.barText}; }
  .vs { font-size:${26 * scale}px; color:${palette.barText}; opacity:0.7; }
  .nakshatra { font-size:${20 * scale}px; font-weight:700; color:${palette.barText}; opacity:0.85; }
  .title { font-size:${titleSize}px; font-weight:900; color:${titleColor}; max-width:${340 * scale}px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:center; font-family:${titleFont}; }
  .vaar, .tithi, .yoga { color:${palette.barText}; }
  .vaar { font-size:${22 * scale}px; opacity:0.7; font-weight:700; }
  .tithi { font-size:${26 * scale}px; font-weight:700; }
  .yoga { font-size:${18 * scale}px; opacity:0.85; font-weight:700; }
  .festival {
    width:100%; background:${palette.bar}; color:${palette.accent};
    font-size:${22 * scale}px; font-weight:900; text-align:center;
    padding:${8 * scale}px 0; border-top:2px solid ${palette.accent}; flex-shrink:0;
  }
  .body { flex:1; position:relative; display:flex; align-items:center; justify-content:center; overflow:hidden; }
  .text-group { position:relative; z-index:2; display:flex; flex-direction:column; align-items:center; gap:${20 * scale}px; text-align:center; max-width:90%; }
  .main-text { font-weight:700; line-height:1.5; white-space:pre-wrap; word-wrap:break-word; font-family:${quoteFont}; }
  .ref-text { opacity:0.85; font-family:${quoteFont}; }
  .ref-text:not(:empty)::before { content:'— '; }
  .traditional-ref { letter-spacing:2px; border-bottom:3px solid; padding-bottom:8px; }
  .border-outer, .border-inner { position:absolute; border-style:solid; opacity:0.45; }
  .border-inner { opacity:0.25; border-width:1px; }
  .border-outer { border-width:2px; }
  .border-outer.heavy { border-width:${8 * scale}px; opacity:0.9; }
  .border-inner.heavy { border-width:${4 * scale}px; opacity:0.7; }
  .om-top, .om-bottom, .om-center { position:absolute; left:50%; transform:translateX(-50%); z-index:1; }
  .quote-open, .quote-close { position:absolute; font-family:Georgia,serif; font-weight:900; opacity:0.13; line-height:1; z-index:1; }
  .diagonal-overlay { position:absolute; bottom:0; right:0; width:0; height:0; border-style:solid; opacity:0.55; }
  .mandala-ring { position:absolute; border-radius:50%; left:50%; top:50%; transform:translate(-50%,-50%); }
  .body.left-accent { flex-direction:row; align-items:center; padding-right:0; }
  .accent-bar { flex-shrink:0; align-self:center; }
  .text-block { flex:1; display:flex; flex-direction:column; justify-content:center; min-width:0; }
  .left-align { text-align:left; }
  .body.sunrise-wave { flex-direction:column; align-items:stretch; justify-content:flex-start; }
  .wave-band { width:100%; flex-shrink:0; display:block; margin:0; }
  .wave-content { flex:1; display:flex; align-items:center; justify-content:center; overflow:hidden; position:relative; }
  .corner-bracket { position:absolute; opacity:0.75; }
  .body.glow-center { position:relative; }
  .glow-orb, .glow-ring { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); border-radius:50%; pointer-events:none; }
  .glow-ring { opacity:0.18; }
  .glow-stack { position:relative; z-index:2; gap:${20 * scale}px; }
  .glow-stars { opacity:0.65; letter-spacing:0.35em; }
  .minimal-stack { gap:${24 * scale}px; }
  .rule-ornament { display:flex; flex-direction:column; align-items:center; gap:${12 * scale}px; width:100%; }
  .accent-rule { opacity:0.65; border-radius:1px; }
  .accent-rule.narrow { opacity:0.45; }
  .rule-star { opacity:0.8; letter-spacing:0.2em; }
  .accent-panel { display:flex; flex-direction:column; align-items:center; gap:${20 * scale}px; text-align:center; position:relative; z-index:2; }
  .ref-text.card-ref { width:100%; opacity:0.85; }
  .footer {
    height:${140 * scale}px; background:${palette.bar};
    display:flex; align-items:center; justify-content:center; gap:${24 * scale}px;
    padding:0 ${40 * scale}px; flex-shrink:0; overflow:visible;
  }
  .footer-logo {
    height:${145 * scale}px; margin-top:${-40 * scale}px; width:auto;
    object-fit:contain; background:transparent; mix-blend-mode:screen;
  }
  .footer-text { font-size:${42 * scale}px; color:${palette.barText}; font-family:${quoteFont}; }
  .watermark {
    position:absolute; left:50%; transform:translateX(-50%);
    bottom:${150 * scale}px; font-size:${18 * scale}px; opacity:0.25;
    letter-spacing:0.2em; text-transform:uppercase;
    font-family:${quoteFont};
  }
</style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <span class="greg">${header.gregDate}</span>
      <span class="vs">${header.vsMonth} ${header.vsYear}</span>
      <span class="nakshatra">${header.nakshatra}</span>
    </div>
    <span class="title">${escapeHtml(title)}</span>
    <div class="header-right">${panchangRight}</div>
  </div>
  ${festivalBanner}
  ${bodyHtml}
  <div class="footer">
    ${logoB64 ? `<img src="data:image/png;base64,${logoB64}" class="footer-logo" alt="">` : ""}
    <span class="footer-text">${escapeHtml(org.footer)}</span>
  </div>
  ${watermark ? `<div class="watermark">${escapeHtml(watermark)}</div>` : ""}
</body>
<script>
  document.fonts.ready.then(function() {
    var el = document.getElementById('mt');
    if (!el) return;
    var body = el.closest('.body');
    var maxH = body.clientHeight - 120;
    var maxW = body.clientWidth - 140;
    var size = parseFloat(getComputedStyle(el).fontSize);
    while (size > 28 && (el.scrollHeight > maxH || el.scrollWidth > maxW)) {
      size -= 2;
      el.style.fontSize = size + 'px';
    }
  });
</script>
</html>`;
}