import {
  EclipticGeoMoon,
  SearchMoonPhase,
  SunPosition,
} from "astronomy-engine";
import type { HeaderInfo } from "@/types/poster";
import { getFallbackHeader } from "@/lib/panchang-fallback";

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

const HINDI_MONTHS = [
  "चैत्र",
  "वैशाख",
  "ज्येष्ठ",
  "आषाढ़",
  "श्रावण",
  "भाद्रपद",
  "आश्विन",
  "कार्तिक",
  "मार्गशीर्ष",
  "पौष",
  "माघ",
  "फाल्गुन",
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

const HINDI_TITHIS = [
  "प्रतिपदा",
  "द्वितीया",
  "तृतीया",
  "चतुर्थी",
  "पंचमी",
  "षष्ठी",
  "सप्तमी",
  "अष्टमी",
  "नवमी",
  "दशमी",
  "एकादशी",
  "द्वादशी",
  "त्रयोदशी",
  "चतुर्दशी",
  "पूर्णिमा",
];

const HINDI_NAKSHATRAS = [
  "अश्विनी",
  "भरणी",
  "कृत्तिका",
  "रोहिणी",
  "मृगशिरा",
  "आर्द्रा",
  "पुनर्वसु",
  "पुष्य",
  "आश्लेषा",
  "मघा",
  "पूर्वाफाल्गुनी",
  "उत्तराफाल्गुनी",
  "हस्त",
  "चित्रा",
  "स्वाती",
  "विशाखा",
  "अनुराधा",
  "ज्येष्ठा",
  "मूल",
  "पूर्वाषाढ़ा",
  "उत्तराषाढ़ा",
  "श्रवण",
  "धनिष्ठा",
  "शतभिषा",
  "पूर्वाभाद्रपद",
  "उत्तराभाद्रपद",
  "रेवती",
];

const HINDI_YOGAS = [
  "विष्कम्भ",
  "प्रीति",
  "आयुष्मान",
  "सौभाग्य",
  "शोभन",
  "अतिगण्ड",
  "सुकर्मा",
  "धृति",
  "शूल",
  "गण्ड",
  "वृद्धि",
  "ध्रुव",
  "व्याघात",
  "हर्षण",
  "वज्र",
  "सिद्धि",
  "व्यतीपात",
  "वरीयान",
  "परिघ",
  "शिव",
  "सिद्ध",
  "साध्य",
  "शुभ",
  "शुक्ल",
  "ब्रह्म",
  "इन्द्र",
  "वैधृति",
];

const HINDI_KARANAS = [
  "बव",
  "बालव",
  "कौलव",
  "तैतिल",
  "गर",
  "वणिज",
  "विष्टि",
  "शकुनि",
  "चतुष्पद",
  "नाग",
  "किंस्तुघ्न",
];

/** Lahiri ayanamsha — matches legacy generator.py (~2026) */
const AYANAMSHA = 24.1;

const FESTIVALS: Record<string, string> = {
  "शुक्ल|प्रतिपदा|चैत्र": "चैत्र नवरात्रि आरम्भ",
  "शुक्ल|नवमी|चैत्र": "राम नवमी",
  "शुक्ल|तृतीया|वैशाख": "अक्षय तृतीया",
  "शुक्ल|एकादशी|आषाढ़": "देवशयनी एकादशी",
  "शुक्ल|पूर्णिमा|आषाढ़": "गुरु पूर्णिमा",
  "शुक्ल|षष्ठी|भाद्रपद": "हल षष्ठी",
  "शुक्ल|अष्टमी|भाद्रपद": "राधाष्टमी",
  "शुक्ल|चतुर्थी|भाद्रपद": "गणेश चतुर्थी",
  "कृष्ण|अष्टमी|भाद्रपद": "जन्माष्टमी",
  "शुक्ल|प्रतिपदा|आश्विन": "शारदीय नवरात्रि आरम्भ",
  "शुक्ल|दशमी|आश्विन": "दशहरा",
  "शुक्ल|पूर्णिमा|आश्विन": "शरद पूर्णिमा",
  "कृष्ण|त्रयोदशी|कार्तिक": "धनतेरस",
  "कृष्ण|चतुर्दशी|कार्तिक": "नरक चतुर्दशी",
  "कृष्ण|अमावस्या|कार्तिक": "दीपावली",
  "शुक्ल|प्रतिपदा|कार्तिक": "गोवर्धन पूजा",
  "शुक्ल|द्वितीया|कार्तिक": "भाई दूज",
  "शुक्ल|पूर्णिमा|कार्तिक": "कार्तिक पूर्णिमा / देव दीपावली",
  "शुक्ल|पञ्चमी|माघ": "वसंत पञ्चमी",
  "शुक्ल|पूर्णिमा|माघ": "माघ पूर्णिमा",
  "शुक्ल|चतुर्दशी|फाल्गुन": "होलिका दहन",
  "शुक्ल|पूर्णिमा|फाल्गुन": "होली",
  "शुक्ल|पूर्णिमा|चैत्र": "हनुमान जयंती",
  "शुक्ल|पूर्णिमा|वैशाख": "बुद्ध पूर्णिमा",
};

function getFestival(
  tithiIdx: number,
  tithiName: string,
  paksha: string,
  month: string,
): string {
  const krishna = paksha === "कृष्ण";

  if (tithiName === "एकादशी") return "एकादशी व्रत";
  if (tithiName === "त्रयोदशी") return "प्रदोष व्रत";
  if (tithiName === "चतुर्थी" && krishna) return "संकष्टी चतुर्थी";

  return FESTIVALS[`${paksha}|${tithiName}|${month}`] ?? "";
}

function istCalendarDate(reference = new Date()): {
  y: number;
  m: number;
  d: number;
  weekday: number;
} {
  const dateStr = reference.toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
  const [y, m, d] = dateStr.split("-").map(Number);
  const weekdayShort = reference.toLocaleDateString("en-US", {
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
  return { y, m, d, weekday: weekdayMap[weekdayShort] ?? 0 };
}

/** 6:00 AM IST on given calendar day */
function ist6amDate(y: number, m: number, d: number): Date {
  return new Date(Date.UTC(y, m - 1, d, 0, 30, 0));
}

function weekdayForIstDate(y: number, m: number, d: number): number {
  const anchor = new Date(
    `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}T06:00:00+05:30`,
  );
  const weekdayShort = anchor.toLocaleDateString("en-US", {
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
  return weekdayMap[weekdayShort] ?? 0;
}

function parsePanchangDate(input?: string): {
  y: number;
  m: number;
  d: number;
  weekday: number;
} {
  if (!input) return istCalendarDate();

  const iso = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const y = Number(iso[1]);
    const m = Number(iso[2]);
    const d = Number(iso[3]);
    return { y, m, d, weekday: weekdayForIstDate(y, m, d) };
  }

  const dmy = input.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (dmy) {
    const y = Number(dmy[3]);
    const m = Number(dmy[2]);
    const d = Number(dmy[1]);
    return { y, m, d, weekday: weekdayForIstDate(y, m, d) };
  }

  return istCalendarDate();
}

export function computePanchang(panchangDate?: string): HeaderInfo {
  if (typeof window === "undefined") {
    return getFallbackHeader();
  }

  try {
    return computePanchangCore(panchangDate);
  } catch (error) {
    console.error("Panchang calculation failed:", error);
    return getFallbackHeader();
  }
}

function computePanchangCore(panchangDate?: string): HeaderInfo {
  const parsed = parsePanchangDate(panchangDate);
  const { y, m, d, weekday: pyWeekday } = parsed;

  const gregDate = `${d}-${GREG_MONTHS[m - 1]}, ${y}`;
  const calcTime = ist6amDate(y, m, d);
  const epDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));

  const moonLon = EclipticGeoMoon(calcTime).lon % 360;
  const sunLon = SunPosition(calcTime).elon % 360;

  const tithiDiff = (moonLon - sunLon + 360) % 360;
  const tithiIdx = Math.floor(tithiDiff / 12);

  const paksha = tithiIdx < 15 ? "शुक्ल" : "कृष्ण";
  const tithiNum = tithiIdx < 15 ? tithiIdx + 1 : tithiIdx - 14;
  const tithi =
    paksha === "कृष्ण" && tithiNum === 15
      ? "अमावस्या"
      : HINDI_TITHIS[tithiNum - 1];

  const nextNm = SearchMoonPhase(0, epDate, 35);
  let hindiMonth = HINDI_MONTHS[0];
  let vsYear = String(y + 56 + (m > 3 || (m === 3 && d >= 15) ? 1 : 0));

  if (nextNm) {
    const sunLonAtNm = SunPosition(nextNm.date).elon % 360;
    const nirayanaLon = (sunLonAtNm - AYANAMSHA + 360) % 360;
    let monthIdx = Math.floor(nirayanaLon / 30) % 12;
    if (tithiIdx >= 15) monthIdx = (monthIdx + 1) % 12;
    hindiMonth = HINDI_MONTHS[monthIdx];
  }

  const moonNirayana = (moonLon - AYANAMSHA + 360) % 360;
  const sunNirayana = (sunLon - AYANAMSHA + 360) % 360;
  const nakshatra =
    HINDI_NAKSHATRAS[Math.floor(moonNirayana / (360 / 27)) % 27];
  const yoga =
    HINDI_YOGAS[
      Math.floor(((moonNirayana + sunNirayana) % 360) / (360 / 27)) % 27
    ];

  const karanaIdxRaw = Math.floor(tithiDiff / 6);
  const fixedKaranas: Record<number, string> = {
    57: "शकुनि",
    58: "चतुष्पद",
    59: "नाग",
    0: "किंस्तुघ्न",
  };
  const karana =
    fixedKaranas[karanaIdxRaw] ??
    HINDI_KARANAS[(karanaIdxRaw - 1) % 7];

  const vaar = HINDI_DAYS[pyWeekday];
  const festival = getFestival(tithiIdx, tithi, paksha, hindiMonth);

  return {
    gregDate,
    vsMonth: hindiMonth,
    vsYear,
    vaar,
    paksha,
    tithi,
    nakshatra,
    yoga,
    karana,
    festival,
  };
}

/** Server-side panchang for Playwright export (Node only) */
export function computePanchangServer(panchangDate?: string): HeaderInfo {
  try {
    return computePanchangCore(panchangDate);
  } catch (error) {
    console.error("Server panchang calculation failed:", error);
    return getFallbackHeader();
  }
}