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
  "सोमवार",
  "मंगलवार",
  "बुधवार",
  "गुरुवार",
  "शुक्रवार",
  "शनिवार",
  "रविवार",
];

export function getFallbackHeader(date = new Date()): HeaderInfo {
  const dateStr = date.toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
  const [y, m, d] = dateStr.split("-").map(Number);
  const weekdayShort = date.toLocaleDateString("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
  });
  const weekdayMap: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };

  return {
    gregDate: `${d}-${GREG_MONTHS[m - 1]}, ${y}`,
    vsMonth: "",
    vsYear: "",
    vaar: HINDI_DAYS[weekdayMap[weekdayShort] ?? 0],
    paksha: "",
    tithi: "",
    nakshatra: "",
    yoga: "",
    karana: "",
    festival: "",
  };
}