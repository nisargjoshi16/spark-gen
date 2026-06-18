import { fitFontSize, fitTitleFontSize } from "@/lib/auto-font-size";
import {
  escapeHtml,
  formatTextToHtml,
  stripFormatting,
} from "@/lib/format-text";
import {
  getFontFamilyCss,
  getGoogleFontsUrl,
  TEMPLATE_UI_FONT,
  TEMPLATE_UI_FONTS_URL,
} from "@/lib/fonts";
import { getHeaderInfoServer } from "@/lib/header";
import { getFormat } from "@/lib/formats";
import {
  getTextBoxGradient,
  resolveImageBgQuoteSize,
} from "@/lib/image-bg";
import { getOrgLogoBase64 } from "@/lib/org-server";
import { getOrg, getWatermarkForOrg } from "@/lib/orgs";
import { getPalette } from "@/lib/palettes";
import type { GeneratePosterRequest, TextPlacement } from "@/types/poster";

function renderShlokaBody(
  quote: string,
  ref: string,
  palette: ReturnType<typeof getPalette>,
  format: ReturnType<typeof getFormat>,
): string {
  const scale = format.height / 1350;
  const quoteSize = fitFontSize(
    stripFormatting(quote).length,
    format.width - 140 * scale,
    format.height * 0.45,
    format.height,
  );

  return `
    <div class="body shloka" style="background:${palette.bg};padding:${70 * scale}px ${80 * scale}px;">
      <div class="border-outer" style="border-color:${palette.accent};top:${24 * scale}px;left:${24 * scale}px;right:${24 * scale}px;bottom:${24 * scale}px;"></div>
      <div class="border-inner" style="border-color:${palette.accent};top:${36 * scale}px;left:${36 * scale}px;right:${36 * scale}px;bottom:${36 * scale}px;"></div>
      <div class="om-top" style="color:${palette.accent};font-size:${28 * scale}px;letter-spacing:${20 * scale}px;top:${52 * scale}px;">ॐ ✦ ✦ ✦</div>
      <div class="text-group">
        <div class="main-text" id="mt" style="color:${palette.text};font-size:${quoteSize}px;">${formatTextToHtml(quote, palette.accent)}</div>
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
): string {
  const scale = format.height / 1350;
  const quoteSize = fitFontSize(
    stripFormatting(quote).length,
    format.width - 180 * scale,
    format.height * 0.42,
    format.height,
  );

  return `
    <div class="body quote-box" style="background:${palette.bg};padding:${80 * scale}px ${90 * scale}px;">
      <div class="quote-open" style="color:${palette.accent};font-size:${240 * scale}px;top:${30 * scale}px;left:${50 * scale}px;">&ldquo;</div>
      <div class="quote-close" style="color:${palette.accent};font-size:${240 * scale}px;bottom:${-30 * scale}px;right:${50 * scale}px;">&rdquo;</div>
      <div class="text-group">
        <div class="main-text" id="mt" style="color:${palette.text};font-size:${quoteSize}px;">${formatTextToHtml(quote, palette.accent)}</div>
        ${ref ? `<div class="ref-text" style="color:${palette.accent};font-size:${38 * scale}px;">${escapeHtml(ref)}</div>` : ""}
      </div>
    </div>`;
}

function renderTraditionalBody(
  quote: string,
  ref: string,
  palette: ReturnType<typeof getPalette>,
  format: ReturnType<typeof getFormat>,
): string {
  const scale = format.height / 1350;
  const quoteSize = fitFontSize(
    stripFormatting(quote).length,
    format.width - 200 * scale,
    format.height * 0.38,
    format.height,
  );

  return `
    <div class="body traditional" style="background:linear-gradient(180deg,${palette.bar} 0%,${palette.bg} 100%);padding:${100 * scale}px ${80 * scale}px;">
      <div class="border-outer heavy" style="border-color:${palette.accent};top:${30 * scale}px;left:${30 * scale}px;right:${30 * scale}px;bottom:${30 * scale}px;"></div>
      <div class="border-inner heavy" style="border-color:${palette.accent};top:${50 * scale}px;left:${50 * scale}px;right:${50 * scale}px;bottom:${50 * scale}px;"></div>
      <div class="om-center" style="color:${palette.accent};font-size:${42 * scale}px;top:${240 * scale}px;">ॐ</div>
      <div class="text-group">
        <div class="main-text" id="mt" style="color:${palette.text};font-size:${quoteSize}px;">${formatTextToHtml(quote, palette.accent)}</div>
        ${ref ? `<div class="ref-text traditional-ref" style="color:${palette.accent};font-size:${36 * scale}px;border-color:${palette.accent};">${escapeHtml(ref)}</div>` : ""}
      </div>
    </div>`;
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
  const titleSize = fitTitleFontSize(title.length, 340 * scale, format.height);
  const contentFont = getFontFamilyCss(request.options.fontId);
  const contentFontsUrl = getGoogleFontsUrl(request.options.fontId);
  const bg = request.backgroundImage!;
  const placement: TextPlacement = bg.textPlacement ?? "bottom";
  const quoteSize = resolveImageBgQuoteSize(
    stripFormatting(quote).length,
    format.height,
    request.options.imageBgQuoteScale ?? 1,
  );
  const refSize = Math.max(Math.round(18 * scale), Math.round(quoteSize * 0.52));
  const textPositionCss =
    placement === "top" ? "justify-content:flex-start;" : "justify-content:flex-end;";
  const textBoxGradient = getTextBoxGradient(palette.bg, placement);
  const bgDataUri = `data:${bg.mimeType};base64,${bg.base64}`;

  const festivalBanner = header.festival
    ? `<div class="festival">${escapeHtml(header.festival)}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<link href="${TEMPLATE_UI_FONTS_URL}" rel="stylesheet">
<link href="${contentFontsUrl}" rel="stylesheet">
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
  .title { font-size:${titleSize}px; font-weight:900; color:#FF6B00; max-width:${340 * scale}px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:center; font-family:${contentFont}; }
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
    font-size:${quoteSize}px; font-weight:700; color:${palette.text};
    text-align:center; line-height:${quoteSize > 60 * scale ? 1.4 : 1.35};
    white-space:pre-wrap; word-wrap:break-word;
    text-shadow:1px 1px 6px rgba(0,0,0,0.4);
    font-family:${contentFont};
  }
  .ref-text {
    font-size:${refSize}px; font-weight:400; color:${palette.accent};
    text-align:center; opacity:0.85; margin-top:${20 * scale}px;
    white-space:pre-wrap; word-wrap:break-word;
    font-family:${contentFont};
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
  .footer-text { font-size:${42 * scale}px; color:${palette.barText}; font-family:${contentFont}; }
  .watermark {
    position:absolute; left:50%; transform:translateX(-50%);
    bottom:${150 * scale}px; font-size:${18 * scale}px; opacity:0.25;
    letter-spacing:0.2em; text-transform:uppercase;
    font-family:${contentFont};
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
  const titleSize = fitTitleFontSize(title.length, 340 * scale, format.height);
  const contentFont = getFontFamilyCss(request.options.fontId);
  const contentFontsUrl = getGoogleFontsUrl(request.options.fontId);

  const bodyHtml =
    request.templateId === "quote_box"
      ? renderQuoteBoxBody(quote, ref, palette, format)
      : request.templateId === "traditional_vibrant"
        ? renderTraditionalBody(quote, ref, palette, format)
        : renderShlokaBody(quote, ref, palette, format);

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
<link href="${contentFontsUrl}" rel="stylesheet">
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
  .title { font-size:${titleSize}px; font-weight:900; color:#FF6B00; max-width:${340 * scale}px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:center; font-family:${contentFont}; }
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
  .main-text { font-weight:700; line-height:1.5; white-space:pre-wrap; word-wrap:break-word; font-family:${contentFont}; }
  .ref-text { opacity:0.85; font-family:${contentFont}; }
  .ref-text:not(:empty)::before { content:'— '; }
  .traditional-ref { letter-spacing:2px; border-bottom:3px solid; padding-bottom:8px; }
  .border-outer, .border-inner { position:absolute; border-style:solid; opacity:0.45; }
  .border-inner { opacity:0.25; border-width:1px; }
  .border-outer { border-width:2px; }
  .border-outer.heavy { border-width:${8 * scale}px; opacity:0.9; }
  .border-inner.heavy { border-width:${4 * scale}px; opacity:0.7; }
  .om-top, .om-bottom, .om-center { position:absolute; left:50%; transform:translateX(-50%); z-index:1; }
  .quote-open, .quote-close { position:absolute; font-family:Georgia,serif; font-weight:900; opacity:0.13; line-height:1; z-index:1; }
  .footer {
    height:${140 * scale}px; background:${palette.bar};
    display:flex; align-items:center; justify-content:center; gap:${24 * scale}px;
    padding:0 ${40 * scale}px; flex-shrink:0; overflow:visible;
  }
  .footer-logo {
    height:${145 * scale}px; margin-top:${-40 * scale}px; width:auto;
    object-fit:contain; background:transparent; mix-blend-mode:screen;
  }
  .footer-text { font-size:${42 * scale}px; color:${palette.barText}; font-family:${contentFont}; }
  .watermark {
    position:absolute; left:50%; transform:translateX(-50%);
    bottom:${150 * scale}px; font-size:${18 * scale}px; opacity:0.25;
    letter-spacing:0.2em; text-transform:uppercase;
    font-family:${contentFont};
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