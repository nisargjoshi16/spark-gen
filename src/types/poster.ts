export type DesignTemplateId = "shloka" | "quote_box" | "traditional_vibrant";

export type PaletteId =
  | "hot_pink"
  | "deep_rose"
  | "magenta"
  | "purple"
  | "bright_blue"
  | "orange"
  | "golden_yellow"
  | "mint_green"
  | "neon_pink"
  | "cyan"
  | "coral"
  | "lime_green"
  | "saffron"
  | "indigo"
  | "earth_brown"
  | "forest_green";

export type FormatId = "portrait" | "square" | "story" | "twitter";

export type FontId = "noto" | "baloo" | "mukta" | "hind" | "tiro";

export interface Palette {
  id: PaletteId;
  name: string;
  bg: string;
  text: string;
  accent: string;
  bg2: string;
  wave: string;
  bar: string;
  barText: string;
}

export interface DesignTemplate {
  id: DesignTemplateId;
  name: string;
  description: string;
}

export interface Format {
  id: FormatId;
  name: string;
  label: string;
  width: number;
  height: number;
}

export interface PosterInput {
  title: string;
  quote: string;
  ref: string;
  author: string;
}

export interface HeaderInfo {
  gregDate: string;
  vsMonth: string;
  vsYear: string;
  vaar: string;
  paksha: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  festival: string;
}

export interface PosterOptions {
  fontId: FontId;
  showWatermark: boolean;
  footer: string;
}

export const DEFAULT_POSTER_INPUT: PosterInput = {
  title: "प्रचोदयात्",
  quote: "नींद को सूर्य के चक्र से जोड़ो — जो जागता है वही जीवन को पूर्णता देता है।",
  ref: "कठोपनिषद्",
  author: "",
};

export const DEFAULT_POSTER_OPTIONS: PosterOptions = {
  fontId: "noto",
  showWatermark: true,
  footer: "प्रचोदयात् | prachodayat.in",
};

export interface GeneratePosterRequest {
  input: PosterInput;
  templateId: DesignTemplateId;
  paletteId: PaletteId;
  formatId: FormatId;
  options: PosterOptions;
  /** YYYY-MM-DD or DD-MM-YYYY; defaults to today (IST) */
  panchangDate?: string;
}