/**
 * US-EPA AQI categorization, GRAP stage mapping, and protective advice helper.
 * @module utils/aqi
 */

const AQI_BANDS = [
  {
    max: 50,
    status: "Good",
    label: "Saaf (Good)",
    badgeColor: "bg-emerald-500",
    glowColor: "rgba(16, 185, 129, 0.4)",
    ringTextClass: "text-emerald-400",
    badgeBorderClass: "border-emerald-500/40 text-emerald-300",
    grap: "Standard Safe",
    summary: "Air quality is pristine and poses virtually no health risk.",
    walkVerdict: "Safe",
    walkVerdictColor: "text-emerald-300 bg-emerald-950/60 border-emerald-500/40",
    walk: "Safe for all outdoor workouts & runs",
    schoolVerdict: "Safe",
    schoolVerdictColor: "text-emerald-300 bg-emerald-950/60 border-emerald-500/40",
    school: "Normal outdoor playtime allowed",
    windowsVerdict: "Open All Day",
    windowsVerdictColor: "text-emerald-300 bg-emerald-950/60 border-emerald-500/40",
    windows: "Safe to keep windows open throughout the day",
    purifierSpeed: "Eco Mode",
    mask: "No mask required"
  },
  {
    max: 100,
    status: "Moderate",
    label: "Theek (Moderate)",
    badgeColor: "bg-amber-950/600",
    glowColor: "rgba(245, 158, 11, 0.4)",
    ringTextClass: "text-amber-400",
    badgeBorderClass: "border-amber-500/40 text-amber-300",
    grap: "Advisory Level",
    summary: "Acceptable quality; sensitive individuals may experience mild throat tickle.",
    walkVerdict: "Caution",
    walkVerdictColor: "text-amber-300 bg-amber-950/60 border-amber-500/40",
    walk: "Safe for general public; asthmatics take caution",
    schoolVerdict: "Normal",
    schoolVerdictColor: "text-amber-300 bg-amber-950/60 border-amber-500/40",
    school: "Regular school sports acceptable",
    windowsVerdict: "Midday Window",
    windowsVerdictColor: "text-amber-300 bg-amber-950/60 border-amber-500/40",
    windows: "Best to ventilate between 12 PM - 3 PM",
    purifierSpeed: "Low / Auto",
    mask: "Optional for sensitive groups"
  },
  {
    max: 200,
    status: "Poor",
    label: "Kharab (Poor)",
    badgeColor: "bg-orange-950/600",
    glowColor: "rgba(249, 115, 22, 0.4)",
    ringTextClass: "text-orange-400",
    badgeBorderClass: "border-orange-500/40 text-orange-300",
    grap: "GRAP Stage I",
    summary: "Breathing discomfort to people with lung/heart conditions and children.",
    walkVerdict: "Restricted",
    walkVerdictColor: "text-orange-300 bg-orange-950/60 border-orange-500/40",
    walk: "Avoid intense outdoor jogging or cycling",
    schoolVerdict: "Restricted",
    schoolVerdictColor: "text-orange-300 bg-orange-950/60 border-orange-500/40",
    school: "Curtail prolonged outdoor assemblies",
    windowsVerdict: "12 PM - 3 PM",
    windowsVerdictColor: "text-orange-300 bg-orange-950/60 border-orange-500/40",
    windows: "Open only during peak sunlight (12 PM - 3 PM)",
    purifierSpeed: "Medium",
    mask: "N95 recommended for commute"
  },
  {
    max: 300,
    status: "Very Poor",
    label: "Bahut Kharab (Very Poor)",
    badgeColor: "bg-red-950/600",
    glowColor: "rgba(239, 68, 68, 0.4)",
    ringTextClass: "text-red-400",
    badgeBorderClass: "border-red-500/40 text-red-300",
    grap: "GRAP Stage II",
    summary: "Respiratory illness on prolonged exposure. Significant cardiovascular load.",
    walkVerdict: "Avoid",
    walkVerdictColor: "text-red-300 bg-red-950/60 border-red-500/40",
    walk: "Strictly avoid morning garden runs",
    schoolVerdict: "N95 Mandatory",
    schoolVerdictColor: "text-red-300 bg-red-950/60 border-red-500/40",
    school: "Ensure tight-fit N95 for bus transit",
    windowsVerdict: "Keep Sealed",
    windowsVerdictColor: "text-red-300 bg-red-950/60 border-red-500/40",
    windows: "Keep doors shut; ground inversion trapped",
    purifierSpeed: "High Speed",
    mask: "N95 / FFP2 mandatory"
  },
  {
    max: Infinity,
    status: "Severe / Hazardous",
    label: "Khatarnak (Hazardous)",
    badgeColor: "bg-rose-500",
    glowColor: "rgba(168, 85, 247, 0.5)",
    ringTextClass: "text-emerald-300",
    badgeBorderClass: "border-emerald-500/40 text-emerald-300",
    grap: "GRAP Stage IV Emergency",
    summary: "Health emergency. High toxic micro-particle density; immediate lung irritation.",
    walkVerdict: "Strictly Avoid",
    walkVerdictColor: "text-rose-200 bg-rose-950/70 border-rose-500/40",
    walk: "Do not exercise outside; walk in indoor hallways",
    schoolVerdict: "Stay Indoors",
    schoolVerdictColor: "text-rose-200 bg-rose-950/70 border-rose-500/40",
    school: "Recommend school online classes; seal bus windows",
    windowsVerdict: "Tightly Sealed",
    windowsVerdictColor: "text-rose-200 bg-rose-950/70 border-rose-500/40",
    windows: "Seal gaps with foam tape; do not open",
    purifierSpeed: "Turbo / Max",
    mask: "Certified tight-seal N95/FFP3"
  }
];

/**
 * Compute AQI severity category, styling tokens, and protective verdicts.
 * @param {number} rawAqi
 * @returns {object}
 */
export function getAQICategory(rawAqi) {
  const aqi = Number.isFinite(Number(rawAqi)) ? Math.max(0, Number(rawAqi)) : 0;
  return AQI_BANDS.find((band) => aqi <= band.max) || AQI_BANDS[AQI_BANDS.length - 1];
}
