import type { FontId, LanguageId } from "@/types/poster";

export interface FontDefinition {
  id: FontId;
  name: string;
  languages: LanguageId[];
  family: string;
  googleFontsUrl: string;
}

export const FONT_DEFINITIONS: FontDefinition[] = [
  // Hindi (Devanagari)
  {
    id: "noto_devanagari",
    name: "Noto Sans Devanagari",
    languages: ["hindi", "sanskrit"],
    family: "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700;900&display=swap",
  },
  {
    id: "baloo",
    name: "Baloo 2",
    languages: ["hindi"],
    family: "'Baloo 2', 'Noto Sans Devanagari', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;700;800&display=swap",
  },
  {
    id: "mukta",
    name: "Mukta",
    languages: ["hindi"],
    family: "'Mukta', 'Noto Sans Devanagari', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Mukta:wght@400;700;800&display=swap",
  },
  {
    id: "hind",
    name: "Hind",
    languages: ["hindi"],
    family: "'Hind', 'Noto Sans Devanagari', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Hind:wght@400;700&display=swap",
  },
  {
    id: "tiro_hindi",
    name: "Tiro Devanagari Hindi",
    languages: ["hindi"],
    family: "'Tiro Devanagari Hindi', 'Noto Sans Devanagari', serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&display=swap",
  },
  {
    id: "amita",
    name: "Amita",
    languages: ["hindi"],
    family: "'Amita', 'Noto Sans Devanagari', serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Amita:wght@400;700&display=swap",
  },
  {
    id: "kalam",
    name: "Kalam",
    languages: ["hindi"],
    family: "'Kalam', 'Noto Sans Devanagari', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap",
  },
  {
    id: "yatra_one",
    name: "Yatra One",
    languages: ["hindi"],
    family: "'Yatra One', 'Noto Sans Devanagari', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Yatra+One&display=swap",
  },
  {
    id: "martel",
    name: "Martel",
    languages: ["hindi"],
    family: "'Martel', 'Noto Sans Devanagari', serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Martel:wght@400;700;800&display=swap",
  },
  {
    id: "poppins",
    name: "Poppins",
    languages: ["hindi", "english"],
    family: "'Poppins', 'Noto Sans Devanagari', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap",
  },
  // Sanskrit
  {
    id: "tiro_sanskrit",
    name: "Tiro Devanagari Sanskrit",
    languages: ["sanskrit"],
    family: "'Tiro Devanagari Sanskrit', 'Noto Sans Devanagari', serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Sanskrit&display=swap",
  },
  {
    id: "noto_serif_devanagari",
    name: "Noto Serif Devanagari",
    languages: ["sanskrit", "hindi"],
    family: "'Noto Serif Devanagari', 'Noto Sans Devanagari', serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400;700;900&display=swap",
  },
  {
    id: "sanskrit_text",
    name: "Sanskrit Text",
    languages: ["sanskrit"],
    family: "'Sanskrit Text', 'Noto Sans Devanagari', serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Sanskrit+Text&display=swap",
  },
  // Gujarati
  {
    id: "noto_gujarati",
    name: "Noto Sans Gujarati",
    languages: ["gujarati"],
    family: "'Noto Sans Gujarati', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;700;900&display=swap",
  },
  {
    id: "baloo_bhai",
    name: "Baloo Bhai 2",
    languages: ["gujarati"],
    family: "'Baloo Bhai 2', 'Noto Sans Gujarati', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Baloo+Bhai+2:wght@400;700;800&display=swap",
  },
  {
    id: "hind_vadodara",
    name: "Hind Vadodara",
    languages: ["gujarati"],
    family: "'Hind Vadodara', 'Noto Sans Gujarati', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Hind+Vadodara:wght@400;700&display=swap",
  },
  {
    id: "mukta_vaani",
    name: "Mukta Vaani",
    languages: ["gujarati"],
    family: "'Mukta Vaani', 'Noto Sans Gujarati', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Mukta+Vaani:wght@400;700;800&display=swap",
  },
  {
    id: "shrikhand",
    name: "Shrikhand",
    languages: ["gujarati"],
    family: "'Shrikhand', 'Noto Sans Gujarati', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Shrikhand&display=swap",
  },
  // English
  {
    id: "playfair",
    name: "Playfair Display",
    languages: ["english"],
    family: "'Playfair Display', Georgia, serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap",
  },
  {
    id: "merriweather",
    name: "Merriweather",
    languages: ["english"],
    family: "'Merriweather', Georgia, serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&display=swap",
  },
  {
    id: "lora",
    name: "Lora",
    languages: ["english"],
    family: "'Lora', Georgia, serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    languages: ["english"],
    family: "'Montserrat', 'Helvetica Neue', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap",
  },
  {
    id: "oswald",
    name: "Oswald",
    languages: ["english"],
    family: "'Oswald', 'Helvetica Neue', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap",
  },
  {
    id: "libre_baskerville",
    name: "Libre Baskerville",
    languages: ["english"],
    family: "'Libre Baskerville', Georgia, serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap",
  },
  {
    id: "cormorant",
    name: "Cormorant Garamond",
    languages: ["english"],
    family: "'Cormorant Garamond', Georgia, serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&display=swap",
  },
  {
    id: "noto_sans",
    name: "Noto Sans",
    languages: ["english"],
    family: "'Noto Sans', 'Helvetica Neue', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;900&display=swap",
  },
  {
    id: "roboto",
    name: "Roboto",
    languages: ["english"],
    family: "'Roboto', 'Helvetica Neue', sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap",
  },
];

export const DEFAULT_FONT_BY_LANGUAGE: Record<LanguageId, FontId> = {
  hindi: "noto_devanagari",
  sanskrit: "tiro_sanskrit",
  gujarati: "noto_gujarati",
  english: "playfair",
};

const fontById = new Map(FONT_DEFINITIONS.map((f) => [f.id, f]));

export function getFontDefinition(id: FontId): FontDefinition {
  return fontById.get(id) ?? fontById.get("noto_devanagari")!;
}

export function getFontsForLanguage(languageId: LanguageId): FontDefinition[] {
  return FONT_DEFINITIONS.filter((f) => f.languages.includes(languageId));
}

export function getFontFamily(id: FontId): string {
  return getFontDefinition(id).family;
}

export function getGoogleFontsUrl(fontId: FontId): string {
  return getFontDefinition(fontId).googleFontsUrl;
}

export function getFontFamilyCss(fontId: FontId): string {
  return getFontDefinition(fontId).family;
}

export function isFontValidForLanguage(
  fontId: FontId,
  languageId: LanguageId,
): boolean {
  return getFontDefinition(fontId).languages.includes(languageId);
}

/** @deprecated Use getFontsForLanguage */
export const fontOptions = FONT_DEFINITIONS.map((f) => ({
  id: f.id,
  name: f.name,
}));

export const fontVariables = "";