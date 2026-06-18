export type TemplateId =
  | "minimal"
  | "gradient"
  | "dark"
  | "warm"
  | "forest"
  | "ocean"
  | "rose"
  | "slate";

export type FormatId = "square" | "story" | "twitter";

export type FontId = "sans" | "serif" | "display" | "mono";

export type TextAlign = "left" | "center" | "right";

export type LayoutId = "classic" | "centered" | "editorial";

export interface Template {
  id: TemplateId;
  name: string;
  background: string;
  titleColor: string;
  quoteColor: string;
  accentColor: string;
}

export interface Format {
  id: FormatId;
  name: string;
  label: string;
  aspectRatio: string;
  width: number;
  height: number;
}

export interface QuoteInput {
  title: string;
  quote: string;
  author: string;
}

export interface Customization {
  fontId: FontId;
  textAlign: TextAlign;
  layoutId: LayoutId;
  quoteSize: number;
  showWatermark: boolean;
}

export const DEFAULT_CUSTOMIZATION: Customization = {
  fontId: "serif",
  textAlign: "left",
  layoutId: "classic",
  quoteSize: 1,
  showWatermark: true,
};