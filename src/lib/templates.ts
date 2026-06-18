import type { Template } from "@/types/quote";

export const templates: Template[] = [
  {
    id: "minimal",
    name: "Minimal",
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    titleColor: "#0f172a",
    quoteColor: "#475569",
    accentColor: "#3b82f6",
  },
  {
    id: "gradient",
    name: "Sunset",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    titleColor: "#ffffff",
    quoteColor: "rgba(255,255,255,0.9)",
    accentColor: "#fbbf24",
  },
  {
    id: "dark",
    name: "Midnight",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    titleColor: "#f8fafc",
    quoteColor: "#94a3b8",
    accentColor: "#38bdf8",
  },
  {
    id: "warm",
    name: "Warm",
    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)",
    titleColor: "#78350f",
    quoteColor: "#92400e",
    accentColor: "#b45309",
  },
];

export function getTemplate(id: string): Template {
  return templates.find((t) => t.id === id) ?? templates[0];
}