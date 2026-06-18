import { Inter, JetBrains_Mono, Lora, Playfair_Display } from "next/font/google";
import type { FontId } from "@/types/quote";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const fontVariables = `${inter.variable} ${lora.variable} ${playfair.variable} ${jetbrainsMono.variable}`;

export const fontOptions: { id: FontId; name: string }[] = [
  { id: "sans", name: "Sans" },
  { id: "serif", name: "Serif" },
  { id: "display", name: "Display" },
  { id: "mono", name: "Mono" },
];

const fontFamilies: Record<FontId, string> = {
  sans: inter.style.fontFamily,
  serif: lora.style.fontFamily,
  display: playfair.style.fontFamily,
  mono: jetbrainsMono.style.fontFamily,
};

export function getFontFamily(id: FontId): string {
  return fontFamilies[id];
}