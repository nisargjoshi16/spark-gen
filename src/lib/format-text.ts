export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Strip inline markup for length / sizing estimates. */
export function stripFormatting(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/==(.+?)==/g, "$1")
    .replace(/--(.+?)--/g, "$1");
}

/**
 * Convert inline markup to HTML (ported from legacy prachodayat).
 * **bold-large** · *bold* · _italic_ · ==highlight== · --small--
 */
export function formatTextToHtml(text: string, accent = "#FF6B00"): string {
  let s = escapeHtml(text);
  s = s.replace(/\n/g, "<br>");
  s = s.replace(
    /\*\*(.+?)\*\*/g,
    `<span style="font-size:1.2em;font-weight:900;color:${accent}">$1</span>`,
  );
  s = s.replace(
    /\*(.+?)\*/g,
    `<span style="font-weight:900;color:${accent}">$1</span>`,
  );
  s = s.replace(/_(.+?)_/g, "<em>$1</em>");
  s = s.replace(
    /==(.+?)==/g,
    `<span style="color:${accent};font-weight:900">$1</span>`,
  );
  s = s.replace(
    /--(.+?)--/g,
    '<span style="font-size:0.78em">$1</span>',
  );
  return s;
}