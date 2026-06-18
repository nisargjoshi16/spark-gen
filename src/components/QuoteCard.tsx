import { getFontFamily } from "@/lib/fonts";
import type {
  Customization,
  Format,
  QuoteInput,
  Template,
} from "@/types/quote";

interface QuoteCardProps {
  input: QuoteInput;
  template: Template;
  format: Format;
  customization: Customization;
}

function getFontSizes(format: Format, quoteSize: number) {
  const base = format.width / 28;
  return {
    title: base * 1.35,
    quote: base * quoteSize,
    author: base * 0.75,
    watermark: base * 0.32,
    accent: base * 0.12,
  };
}

export function QuoteCard({
  input,
  template,
  format,
  customization,
}: QuoteCardProps) {
  const { title, quote, author } = input;
  const { fontId, textAlign, layoutId, quoteSize, showWatermark } =
    customization;
  const sizes = getFontSizes(format, quoteSize);
  const padding = format.width * 0.08;
  const fontFamily = getFontFamily(fontId);
  const isEmpty = !title && !quote;

  const alignClass =
    textAlign === "center"
      ? "items-center text-center"
      : textAlign === "right"
        ? "items-end text-right"
        : "items-start text-left";

  const accentStyle = {
    backgroundColor: template.accentColor,
    width: sizes.accent * 10,
    height: sizes.accent,
  };

  function renderClassic() {
    return (
      <>
        <div
          className={`absolute top-0 ${textAlign === "center" ? "left-1/2 -translate-x-1/2" : textAlign === "right" ? "right-0" : "left-0"} rounded-full`}
          style={{
            ...accentStyle,
            top: padding,
            ...(textAlign === "left" && { left: padding }),
            ...(textAlign === "right" && { right: padding }),
          }}
        />
        <div
          className={`flex flex-1 flex-col justify-center ${alignClass}`}
          style={{ marginTop: sizes.accent * 4 }}
        >
          {title && (
            <h2
              className="font-bold leading-tight tracking-tight"
              style={{ color: template.titleColor, fontSize: sizes.title, marginBottom: sizes.quote * 0.5 }}
            >
              {title}
            </h2>
          )}
          {quote && (
            <blockquote
              className="leading-relaxed"
              style={{ color: template.quoteColor, fontSize: sizes.quote }}
            >
              &ldquo;{quote}&rdquo;
            </blockquote>
          )}
          {author && (
            <p
              className="font-medium opacity-80"
              style={{
                color: template.quoteColor,
                fontSize: sizes.author,
                marginTop: sizes.quote * 0.6,
              }}
            >
              — {author}
            </p>
          )}
        </div>
      </>
    );
  }

  function renderCentered() {
    return (
      <div className={`flex flex-1 flex-col items-center justify-center text-center`}>
        {quote && (
          <blockquote
            className="leading-relaxed"
            style={{
              color: template.quoteColor,
              fontSize: sizes.quote * 1.1,
              maxWidth: "90%",
            }}
          >
            &ldquo;{quote}&rdquo;
          </blockquote>
        )}
        {title && (
          <h2
            className="font-bold tracking-tight"
            style={{
              color: template.titleColor,
              fontSize: sizes.title * 0.85,
              marginTop: sizes.quote * 0.7,
            }}
          >
            {title}
          </h2>
        )}
        {author && (
          <p
            className="opacity-70"
            style={{
              color: template.quoteColor,
              fontSize: sizes.author,
              marginTop: sizes.quote * 0.5,
            }}
          >
            — {author}
          </p>
        )}
        <div
          className="rounded-full"
          style={{ ...accentStyle, marginTop: sizes.quote * 0.8 }}
        />
      </div>
    );
  }

  function renderEditorial() {
    return (
      <div className={`flex flex-1 flex-col justify-center ${alignClass}`}>
        {quote && (
          <blockquote
            className="font-bold leading-tight"
            style={{
              color: template.titleColor,
              fontSize: sizes.quote * 1.35,
              lineHeight: 1.2,
            }}
          >
            {quote}
          </blockquote>
        )}
        {(title || author) && (
          <div style={{ marginTop: sizes.quote * 0.8 }}>
            {title && (
              <p
                className="font-semibold uppercase tracking-widest"
                style={{
                  color: template.accentColor,
                  fontSize: sizes.author,
                }}
              >
                {title}
              </p>
            )}
            {author && (
              <p
                className="opacity-70"
                style={{
                  color: template.quoteColor,
                  fontSize: sizes.author * 0.9,
                  marginTop: sizes.author * 0.3,
                }}
              >
                {author}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative flex w-full flex-col justify-between overflow-hidden"
      style={{
        background: template.background,
        aspectRatio: format.aspectRatio,
        padding,
        fontFamily,
      }}
    >
      {isEmpty ? (
        <p
          className="flex flex-1 items-center justify-center opacity-50"
          style={{ color: template.quoteColor, fontSize: sizes.quote }}
        >
          Your quote will appear here
        </p>
      ) : layoutId === "centered" ? (
        renderCentered()
      ) : layoutId === "editorial" ? (
        renderEditorial()
      ) : (
        renderClassic()
      )}

      {showWatermark && (
        <div
          className="font-medium uppercase tracking-widest opacity-50"
          style={{
            color: template.quoteColor,
            fontSize: sizes.watermark,
            textAlign: textAlign,
          }}
        >
          spark-gen
        </div>
      )}
    </div>
  );
}