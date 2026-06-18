import { computePanchang, computePanchangServer } from "@/lib/panchang";
import type { HeaderInfo } from "@/types/poster";

export function getHeaderInfo(panchangDate?: string): HeaderInfo {
  return computePanchang(panchangDate);
}

export function getHeaderInfoServer(panchangDate?: string): HeaderInfo {
  return computePanchangServer(panchangDate);
}