import { fitFontSize, fitTitleFontSize } from "@/lib/auto-font-size";
import { getFontFamilyCss, getGoogleFontsUrl } from "@/lib/fonts";
import { getHeaderInfoServer } from "@/lib/header";
import { getFormat } from "@/lib/formats";
import { getPalette } from "@/lib/palettes";
import type { GeneratePosterRequest } from "@/types/poster";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderShlokaBody(
  quote: string,
  ref: string,
  palette: ReturnType<typeof getPalette>,
  format: ReturnType<typeof getFormat>,
): string {
  const scale = format.height / 1350;
  const quoteSize = fitFontSize(
    quote.length,
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
        <div class="main-text" id="mt" style="color:${palette.text};font-size:${quoteSize}px;">${escapeHtml(quote)}</div>
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
    quote.length,
    format.width - 180 * scale,
    format.height * 0.42,
    format.height,
  );

  return `
    <div class="body quote-box" style="background:${palette.bg};padding:${80 * scale}px ${90 * scale}px;">
      <div class="quote-open" style="color:${palette.accent};font-size:${240 * scale}px;top:${30 * scale}px;left:${50 * scale}px;">&ldquo;</div>
      <div class="quote-close" style="color:${palette.accent};font-size:${240 * scale}px;bottom:${-30 * scale}px;right:${50 * scale}px;">&rdquo;</div>
      <div class="text-group">
        <div class="main-text" id="mt" style="color:${palette.text};font-size:${quoteSize}px;">${escapeHtml(quote)}</div>
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
    quote.length,
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
        <div class="main-text" id="mt" style="color:${palette.text};font-size:${quoteSize}px;">${escapeHtml(quote)}</div>
        ${ref ? `<div class="ref-text traditional-ref" style="color:${palette.accent};font-size:${36 * scale}px;border-color:${palette.accent};">${escapeHtml(ref)}</div>` : ""}
      </div>
    </div>`;
}

export function buildPosterHtml(request: GeneratePosterRequest): string {
  const format = getFormat(request.formatId);
  const palette = getPalette(request.paletteId);
  const header = getHeaderInfoServer(request.panchangDate);
  const scale = format.height / 1350;
  const title = request.input.title.trim() || "प्रचोदयात्";
  const quote = request.input.quote.trim();
  const ref =
    request.input.ref.trim() || request.input.author.trim();
  const titleSize = fitTitleFontSize(title.length, 340 * scale, format.height);
  const fontFamily = getFontFamilyCss(request.options.fontId);
  const fontsUrl = getGoogleFontsUrl(request.options.fontId);

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
<link href="${fontsUrl}" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:${format.width}px; height:${format.height}px; overflow:hidden;
    font-family:${fontFamily};
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
  .title { font-size:${titleSize}px; font-weight:900; color:#FF6B00; max-width:${340 * scale}px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:center; }
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
  .main-text { font-weight:700; line-height:1.5; white-space:pre-wrap; word-wrap:break-word; }
  .ref-text { opacity:0.85; }
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
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .footer-text { font-size:${42 * scale}px; color:${palette.barText}; }
  .watermark {
    position:absolute; left:50%; transform:translateX(-50%);
    bottom:${150 * scale}px; font-size:${18 * scale}px; opacity:0.25;
    letter-spacing:0.2em; text-transform:uppercase;
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
  <div class="footer"><span class="footer-text">${escapeHtml(request.options.footer)}</span></div>
  ${request.options.showWatermark ? '<div class="watermark">प्रचोदयात्</div>' : ""}
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