import type { Format, FormatId } from "@/types/poster";

export const formats: Format[] = [
  {
    id: "portrait",
    name: "Portrait",
    label: "1080 × 1350",
    width: 1080,
    height: 1350,
  },
  {
    id: "square",
    name: "Square",
    label: "1080 × 1080",
    width: 1080,
    height: 1080,
  },
  {
    id: "story",
    name: "Story",
    label: "1080 × 1920",
    width: 1080,
    height: 1920,
  },
  {
    id: "twitter",
    name: "Wide",
    label: "1200 × 675",
    width: 1200,
    height: 675,
  },
];

export function getFormat(id: FormatId): Format {
  return formats.find((f) => f.id === id) ?? formats[0];
}