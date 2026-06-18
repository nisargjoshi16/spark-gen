import type { QuoteInput, Template } from "@/types/quote";

interface QuoteCardProps {
  input: QuoteInput;
  template: Template;
}

export function QuoteCard({ input, template }: QuoteCardProps) {
  const { title, quote } = input;

  return (
    <div
      className="relative flex aspect-square w-full max-w-[480px] flex-col justify-between overflow-hidden rounded-2xl p-10 shadow-2xl"
      style={{ background: template.background }}
    >
      <div
        className="absolute left-10 top-10 h-1 w-12 rounded-full"
        style={{ backgroundColor: template.accentColor }}
      />

      <div className="mt-6 flex flex-1 flex-col justify-center">
        {title && (
          <h2
            className="mb-6 text-2xl font-bold leading-tight tracking-tight"
            style={{ color: template.titleColor }}
          >
            {title}
          </h2>
        )}
        {quote && (
          <blockquote
            className="text-lg leading-relaxed"
            style={{ color: template.quoteColor }}
          >
            &ldquo;{quote}&rdquo;
          </blockquote>
        )}
        {!title && !quote && (
          <p
            className="text-center text-lg opacity-50"
            style={{ color: template.quoteColor }}
          >
            Your quote will appear here
          </p>
        )}
      </div>

      <div
        className="text-xs font-medium uppercase tracking-widest opacity-60"
        style={{ color: template.quoteColor }}
      >
        spark-gen
      </div>
    </div>
  );
}