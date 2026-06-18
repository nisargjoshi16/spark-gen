import type { LanguageId } from "@/types/poster";

export const languages: {
  id: LanguageId;
  name: string;
  nativeName: string;
}[] = [
  { id: "hindi", name: "Hindi", nativeName: "हिन्दी" },
  { id: "sanskrit", name: "Sanskrit", nativeName: "संस्कृत" },
  { id: "gujarati", name: "Gujarati", nativeName: "ગુજરાતી" },
  { id: "english", name: "English", nativeName: "English" },
];