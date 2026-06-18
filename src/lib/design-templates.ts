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
    id: "diagonal_split",
    name: "Diagonal Split",
    description: "Two-tone diagonal color split background",
  },
  {
    id: "mandala_circle",
    name: "Mandala Circle",
    description: "Concentric circles framing centered text",
  },
  {
    id: "left_accent",
    name: "Left Accent",
    description: "Bold left bar with left-aligned quote",
  },
  {
    id: "sunrise_wave",
    name: "Sunrise Wave",
    description: "Decorative wave bands top and bottom",
  },
  {
    id: "corner_frame",
    name: "Corner Frame",
    description: "Minimal L-bracket corners, open center",
  },
  {
    id: "horizon_split",
    name: "Horizon Split",
    description: "Horizontal two-tone landscape split",
  },
  {
    id: "minimal_rule",
    name: "Minimal Rule",
    description: "Elegant rules and ornament above quote",
  },
  {
    id: "accent_card",
    name: "Accent Card",
    description: "Quote on a raised accent-bordered panel",
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