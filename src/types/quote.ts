export type TemplateId = "minimal" | "gradient" | "dark" | "warm";

export interface Template {
  id: TemplateId;
  name: string;
  background: string;
  titleColor: string;
  quoteColor: string;
  accentColor: string;
}

export interface QuoteInput {
  title: string;
  quote: string;
}