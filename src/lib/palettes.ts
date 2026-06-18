import type { Palette, PaletteId } from "@/types/poster";

function hsvToHex(h: number, s: number, v: number): string {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0;
  let g = 0;
  let b = 0;
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }
  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

type PaletteDef = [
  hue: number,
  satBg: number,
  valBg: number,
  satBar: number,
  valBar: number,
  name: PaletteId,
  text: string,
  accent: string,
];

const PALETTE_DEFS: PaletteDef[] = [
  [0.92, 0.55, 0.98, 0.9, 0.28, "hot_pink", "#1A1A1A", "#FFFFFF"],
  [0.93, 0.75, 0.77, 0.9, 0.28, "deep_rose", "#FFFFFF", "#FFD6E7"],
  [0.95, 1.0, 1.0, 0.95, 0.28, "magenta", "#FFFFFF", "#FFB3D4"],
  [0.75, 0.78, 0.93, 0.88, 0.25, "purple", "#FFFFFF", "#D4B8FF"],
  [0.6, 0.77, 1.0, 0.88, 0.25, "bright_blue", "#FFFFFF", "#B8D4FF"],
  [0.05, 0.97, 0.98, 0.95, 0.28, "orange", "#FFFFFF", "#FFD0B8"],
  [0.13, 0.93, 1.0, 0.95, 0.3, "golden_yellow", "#1A1A1A", "#3A2800"],
  [0.43, 0.97, 1.0, 0.95, 0.25, "mint_green", "#1A1A1A", "#002A18"],
  [0.83, 0.93, 1.0, 0.95, 0.28, "neon_pink", "#FFFFFF", "#FFB3FC"],
  [0.53, 1.0, 1.0, 0.95, 0.28, "cyan", "#1A1A1A", "#003344"],
  [0.97, 0.74, 1.0, 0.9, 0.28, "coral", "#FFFFFF", "#FFB8C4"],
  [0.23, 0.79, 0.96, 0.9, 0.28, "lime_green", "#1A1A1A", "#2A4000"],
  [0.08, 0.8, 1.0, 0.9, 0.3, "saffron", "#FFFFFF", "#FFF0D6"],
  [0.8, 1.0, 0.4, 0.95, 0.15, "indigo", "#FFFFFF", "#D4A8FF"],
  [0.07, 0.85, 0.55, 0.9, 0.2, "earth_brown", "#FFFFFF", "#FFD9A8"],
  [0.43, 0.57, 0.42, 0.8, 0.18, "forest_green", "#FFFFFF", "#B7E4C7"],
];

const OVERRIDES: Partial<Record<PaletteId, Partial<Palette>>> = {
  coral: {
    bg: "#FF4365",
    bar: "#2D0010",
    barText: "#FFFFFF",
    text: "#FFFFFF",
  },
};

export const palettes: Palette[] = PALETTE_DEFS.map(
  ([hue, sb, vb, sbar, vbar, name, text, accent]) => {
    const base: Palette = {
      id: name,
      name: name.replace(/_/g, " "),
      bg: hsvToHex(hue, sb, vb),
      text,
      accent,
      bg2: hsvToHex(hue, sb, vb * 0.78),
      wave: hsvToHex(hue, sbar, vbar * 0.85),
      bar: hsvToHex(hue, sbar, vbar),
      barText: "#FFFFFF",
    };
    return OVERRIDES[name] ? { ...base, ...OVERRIDES[name] } : base;
  },
);

export function getPalette(id: PaletteId): Palette {
  return palettes.find((p) => p.id === id) ?? palettes[12]; // saffron default
}