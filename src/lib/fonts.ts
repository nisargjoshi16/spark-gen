import {
  Baloo_2,
  Hind,
  Mukta,
  Noto_Sans,
  Noto_Sans_Devanagari,
  Tiro_Devanagari_Hindi,
} from "next/font/google";
import type { FontId } from "@/types/poster";

export const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "700", "900"],
  variable: "--font-noto-devanagari",
});

export const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-noto-sans",
});

export const baloo2 = Baloo_2({
  subsets: ["devanagari", "latin"],
  weight: ["400", "700", "800"],
  variable: "--font-baloo",
});

export const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "700", "800"],
  variable: "--font-mukta",
});

export const hind = Hind({
  subsets: ["devanagari", "latin"],
  weight: ["400", "700"],
  variable: "--font-hind",
});

export const tiroDevanagari = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: ["400"],
  variable: "--font-tiro",
});

export const fontVariables = `${notoSansDevanagari.variable} ${notoSans.variable} ${baloo2.variable} ${mukta.variable} ${hind.variable} ${tiroDevanagari.variable}`;

export const fontOptions: { id: FontId; name: string }[] = [
  { id: "noto", name: "Noto Sans" },
  { id: "baloo", name: "Baloo 2" },
  { id: "mukta", name: "Mukta" },
  { id: "hind", name: "Hind" },
  { id: "tiro", name: "Tiro Devanagari" },
];

const fontFamilies: Record<FontId, string> = {
  noto: `${notoSansDevanagari.style.fontFamily}, ${notoSans.style.fontFamily}, sans-serif`,
  baloo: `${baloo2.style.fontFamily}, ${notoSansDevanagari.style.fontFamily}, sans-serif`,
  mukta: `${mukta.style.fontFamily}, ${notoSansDevanagari.style.fontFamily}, sans-serif`,
  hind: `${hind.style.fontFamily}, ${notoSansDevanagari.style.fontFamily}, sans-serif`,
  tiro: `${tiroDevanagari.style.fontFamily}, ${notoSansDevanagari.style.fontFamily}, serif`,
};

export function getFontFamily(id: FontId): string {
  return fontFamilies[id];
}

export function getGoogleFontsUrl(fontId: FontId): string {
  const urls: Record<FontId, string> = {
    noto: "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700;900&family=Noto+Sans:wght@400;700;900&display=swap",
    baloo:
      "https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;700;800&family=Noto+Sans+Devanagari:wght@400;700;900&display=swap",
    mukta:
      "https://fonts.googleapis.com/css2?family=Mukta:wght@400;700;800&family=Noto+Sans+Devanagari:wght@400;700;900&display=swap",
    hind: "https://fonts.googleapis.com/css2?family=Hind:wght@400;700&family=Noto+Sans+Devanagari:wght@400;700;900&display=swap",
    tiro: "https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Noto+Sans+Devanagari:wght@400;700;900&display=swap",
  };
  return urls[fontId];
}

export function getFontFamilyCss(fontId: FontId): string {
  const css: Record<FontId, string> = {
    noto: "'Noto Sans Devanagari','Noto Sans',sans-serif",
    baloo: "'Baloo 2','Noto Sans Devanagari',sans-serif",
    mukta: "'Mukta','Noto Sans Devanagari',sans-serif",
    hind: "'Hind','Noto Sans Devanagari',sans-serif",
    tiro: "'Tiro Devanagari Hindi','Noto Sans Devanagari',serif",
  };
  return css[fontId];
}