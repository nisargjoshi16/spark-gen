import { formatTextToHtml } from "@/lib/format-text";

interface FormattedQuoteProps {
  text: string;
  accent: string;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function FormattedQuote({
  text,
  accent,
  placeholder = "Your quote will appear here",
  className,
  style,
}: FormattedQuoteProps) {
  const html = text.trim()
    ? formatTextToHtml(text, accent)
    : escapePlaceholder(placeholder);

  return (
    <p
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function escapePlaceholder(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}