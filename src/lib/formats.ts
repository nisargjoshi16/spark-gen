import type { Format, FormatId } from "@/types/quote";

export const formats: Format[] = [
  {
    id: "square",
    name: "Square",
    label: "1080 × 1080",
    aspectRatio: "1 / 1",
    width: 1080,
    height: 1080,
  },
  {
    id: "story",
    name: "Story",
    label: "1080 × 1920",
    aspectRatio: "9 / 16",
    width: 1080,
    height: 1920,
  },
  {
    id: "twitter",
    name: "Wide",
    label: "1200 × 675",
    aspectRatio: "16 / 9",
    width: 1200,
    height: 675,
  },
];

export function getFormat(id: FormatId): Format {
  return formats.find((f) => f.id === id) ?? formats[0];
}