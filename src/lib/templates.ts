import type { Template, TemplateId } from "@/types/quote";

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
  {
    id: "forest",
    name: "Forest",
    background: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)",
    titleColor: "#ecfdf5",
    quoteColor: "#a7f3d0",
    accentColor: "#34d399",
  },
  {
    id: "ocean",
    name: "Ocean",
    background: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #38bdf8 100%)",
    titleColor: "#f0f9ff",
    quoteColor: "#bae6fd",
    accentColor: "#7dd3fc",
  },
  {
    id: "rose",
    name: "Rose",
    background: "linear-gradient(135deg, #881337 0%, #be123c 50%, #fb7185 100%)",
    titleColor: "#fff1f2",
    quoteColor: "#fecdd3",
    accentColor: "#fda4af",
  },
  {
    id: "slate",
    name: "Slate",
    background: "linear-gradient(135deg, #18181b 0%, #3f3f46 50%, #71717a 100%)",
    titleColor: "#fafafa",
    quoteColor: "#d4d4d8",
    accentColor: "#a1a1aa",
  },
];

export function getTemplate(id: TemplateId): Template {
  return templates.find((t) => t.id === id) ?? templates[0];
}