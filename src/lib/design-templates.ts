import type { DesignTemplate, DesignTemplateId } from "@/types/poster";

export const designTemplates: DesignTemplate[] = [
  {
    id: "shloka",
    name: "Shloka",
    description: "Om borders, corner marks, traditional frame",
  },
  {
    id: "quote_box",
    name: "Quote Box",
    description: "Giant decorative quotation marks",
  },
  {
    id: "traditional_vibrant",
    name: "Traditional",
    description: "Gradient, mandala ornaments, ornate borders",
  },
  {
    id: "image_bg",
    name: "Photo Background",
    description: "Upload a photo with frosted text overlay",
  },
];

export function getDesignTemplate(id: DesignTemplateId): DesignTemplate {
  return designTemplates.find((t) => t.id === id) ?? designTemplates[0];
}