export type DesignTemplateId =
  | "shloka"
  | "quote_box"
  | "traditional_vibrant"
  | "diagonal_split"
  | "mandala_circle"
  | "left_accent"
  | "sunrise_wave"
  | "image_bg";

export type TextPlacement = "top" | "bottom";

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

export type LanguageId = "hindi" | "sanskrit" | "gujarati" | "english";

export type FontId =
  | "noto_devanagari"
  | "baloo"
  | "mukta"
  | "hind"
  | "tiro_hindi"
  | "amita"
  | "kalam"
  | "yatra_one"
  | "martel"
  | "poppins"
  | "tiro_sanskrit"
  | "noto_serif_devanagari"
  | "sanskrit_text"
  | "noto_gujarati"
  | "baloo_bhai"
  | "hind_vadodara"
  | "mukta_vaani"
  | "shrikhand"
  | "playfair"
  | "merriweather"
  | "lora"
  | "montserrat"
  | "oswald"
  | "libre_baskerville"
  | "cormorant"
  | "noto_sans"
  | "roboto";

export type OrgId = "prachodayat" | "gurukul" | "shardul";

export interface Org {
  id: OrgId;
  name: string;
  website: string;
  footer: string;
  logoPath: string;
  pin?: string;
  /** undefined = default watermark, "" = hidden, string = custom */
  watermark?: string;
  isDefault?: boolean;
}

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
  languageId: LanguageId;
  fontId: FontId;
  showWatermark: boolean;
  /** Photo background template: multiplier on auto quote size (0.5–1.5, default 1). */
  imageBgQuoteScale: number;
  /** Photo background template: frosted quote box opacity (0.2–1, default 0.82). */
  imageBgBoxOpacity: number;
}

export const DEFAULT_POSTER_INPUT: PosterInput = {
  title: "प्रचोदयात्",
  quote: "नींद को सूर्य के चक्र से जोड़ो — जो जागता है वही जीवन को पूर्णता देता है।",
  ref: "कठोपनिषद्",
  author: "",
};

export const DEFAULT_POSTER_OPTIONS: PosterOptions = {
  languageId: "hindi",
  fontId: "noto_devanagari",
  showWatermark: true,
  imageBgQuoteScale: 1,
  imageBgBoxOpacity: 0.82,
};

export interface BackgroundImagePayload {
  base64: string;
  mimeType: string;
  textPlacement: TextPlacement;
}

/** Client-side background image state (data URL for preview). */
export interface BackgroundImageState {
  dataUrl: string;
  mimeType: string;
  textPlacement: TextPlacement;
}

export interface GeneratePosterRequest {
  input: PosterInput;
  templateId: DesignTemplateId;
  paletteId: PaletteId;
  formatId: FormatId;
  orgId: OrgId;
  options: PosterOptions;
  /** YYYY-MM-DD or DD-MM-YYYY; defaults to today (IST) */
  panchangDate?: string;
  /** Required when templateId is image_bg */
  backgroundImage?: BackgroundImagePayload;
}