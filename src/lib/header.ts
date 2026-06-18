import type { HeaderInfo } from "@/types/poster";

const GREG_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const HINDI_DAYS = [
  "रविवार",
  "सोमवार",
  "मंगलवार",
  "बुधवार",
  "गुरुवार",
  "शुक्रवार",
  "शनिवार",
];

/** Phase 1: Gregorian date + weekday. Full panchang arrives in Phase 2. */
export function getHeaderInfo(date = new Date()): HeaderInfo {
  const d = date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear();

  return {
    gregDate: `${d}-${GREG_MONTHS[m]}, ${y}`,
    vsMonth: "",
    vsYear: "",
    vaar: HINDI_DAYS[date.getDay()],
    paksha: "",
    tithi: "",
    nakshatra: "",
    yoga: "",
    karana: "",
    festival: "",
  };
}