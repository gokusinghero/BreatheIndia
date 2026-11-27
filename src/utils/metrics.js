/**
 * Personalization, direct health/emission impact, room ACH, daily routine,
 * RWA multiplier, and WhatsApp circular calculations.
 * @module utils/metrics
 */

import {
  COMMUTE_OPTIONS,
  ECO_SWAPS_DATA,
  HOME_OPTIONS,
  INDOOR_HACKS_DATA
} from "../data/lifestyleData.js";

export const SCIENTIFIC_CONSTANTS = {
  BERKELEY_EARTH_UG_PER_CIG: 22,
  ADULT_TIDAL_VOLUME_M3_DAY: 12,
  WINTER_SMOG_DAYS: 120,
  WINTER_MONTHS: 4,
  GUARD_HEATER_PM25_KG_NIGHT: 2.4,
  DIY_HEPA_CADR_M3_HR: 280,
  CEILING_HEIGHT_M: 2.74,
  SQFT_TO_SQM: 0.0929
};

/**
 * Compute personalized baseline vs. protected indoor/daily exposure, Berkeley Earth
 * cigarette equivalence, mg PM2.5 avoided, and monthly CO₂ savings.
 */
export function computePersonalMetrics(
  airData,
  lifestyle,
  indoorActions = {},
  adoptedSwaps = [],
  routineCompleted = {}
) {
  const homeObj = HOME_OPTIONS.find((h) => h.id === lifestyle.homeType) || HOME_OPTIONS[0];
  const commuteObj = COMMUTE_OPTIONS.find((c) => c.id === lifestyle.commuteMode) || COMMUTE_OPTIONS[1];

  const cookingPenalty = lifestyle.cookingStyle === "gas_tadka" ? 32 : 8;
  const incensePenalty = lifestyle.burnsIncense ? 38 : 0;

  const unshieldedIndoorAQI = Math.max(
    40,
    Math.round(airData.aqi * homeObj.infiltration + cookingPenalty + incensePenalty)
  );

  // Sync overlapping indoor hacks & eco swaps without double-counting
  const effectiveIndoorActions = {
    ...indoorActions,
    wetMop: Boolean(indoorActions.wetMop || adoptedSwaps.includes("wet_pocha")),
    kitchenExhaust: Boolean(indoorActions.kitchenExhaust || adoptedSwaps.includes("cooking_induction")),
    zeroSmokePrayer: Boolean(indoorActions.zeroSmokePrayer || adoptedSwaps.includes("ritual_led"))
  };

  const scale = Math.min(1.15, Math.max(0.35, airData.aqi / 260));
  const indoorReduction = INDOOR_HACKS_DATA.reduce(
    (sum, hack) => (effectiveIndoorActions[hack.key] ? sum + Math.round(hack.aqiDrop * scale) : sum),
    0
  );

  const neighborhoodAmbientRelief =
    (adoptedSwaps.includes("guard_heater") ? 8 : 0) +
    (adoptedSwaps.includes("leaf_compost") ? 5 : 0);

  const protectedIndoorAQI = Math.max(
    24,
    unshieldedIndoorAQI - indoorReduction - neighborhoodAmbientRelief
  );

  const pmRatio = airData.pm25 / Math.max(1, airData.aqi);
  const clampedRatio = Math.max(0.45, Math.min(0.85, pmRatio));
  const unshieldedPM25 = Math.round(unshieldedIndoorAQI * clampedRatio);
  const protectedPM25 = Math.round(protectedIndoorAQI * clampedRatio);

  const swapCommuteSaved = adoptedSwaps.includes("commute_metro") ? 0.35 : 0;
  const effectiveCommuteMult = Math.max(0.5, commuteObj.mult - swapCommuteSaved);
  const baselineDailyPM25 = Math.round(unshieldedPM25 * 0.82 + airData.pm25 * 0.18 * commuteObj.mult);
  const routineBonus = Object.values(routineCompleted || {}).filter(Boolean).length * 3;
  const protectedDailyPM25 = Math.max(
    12,
    Math.round(protectedPM25 * 0.85 + airData.pm25 * 0.15 * effectiveCommuteMult - routineBonus)
  );

  const { BERKELEY_EARTH_UG_PER_CIG, ADULT_TIDAL_VOLUME_M3_DAY, WINTER_SMOG_DAYS, WINTER_MONTHS } =
    SCIENTIFIC_CONSTANTS;

  const outdoorCigarettes = +(airData.pm25 / BERKELEY_EARTH_UG_PER_CIG).toFixed(1);
  const baselineCigarettes = +(baselineDailyPM25 / BERKELEY_EARTH_UG_PER_CIG).toFixed(1);
  const protectedCigarettes = +(protectedDailyPM25 / BERKELEY_EARTH_UG_PER_CIG).toFixed(1);
  const cigarettesAvoided = Math.max(0, +(baselineCigarettes - protectedCigarettes).toFixed(1));

  const pm25AvoidedMg = Math.max(
    0,
    +(((baselineDailyPM25 - protectedDailyPM25) * ADULT_TIDAL_VOLUME_M3_DAY) / 1000).toFixed(2)
  );
  const familyCount = Math.max(1, Math.min(20, Number(lifestyle.familySize || 4)));
  const familyPm25AvoidedMgDay = +(pm25AvoidedMg * familyCount).toFixed(1);
  const winterFamilyPm25Grams = +((familyPm25AvoidedMgDay * WINTER_SMOG_DAYS) / 1000).toFixed(1);

  const commuteKm = Math.max(2, Math.min(100, Number(lifestyle.commuteKm || 12)));
  const activeSwaps = ECO_SWAPS_DATA.filter((s) => adoptedSwaps.includes(s.id));
  const totalCo2SavedMonth = activeSwaps.reduce((acc, s) => {
    if (s.id === "commute_metro") {
      return acc + Math.round((commuteKm / 12) * s.co2SavedKgMonth);
    }
    return acc + s.co2SavedKgMonth;
  }, 0);
  const winterCo2SavedKg = totalCo2SavedMonth * WINTER_MONTHS;
  const totalSwapPmDrop = activeSwaps.reduce((acc, s) => acc + s.pm25DropUg, 0);

  const exposureDropPct =
    baselineDailyPM25 > 0
      ? Math.max(
          0,
          Math.min(88, Math.round(((baselineDailyPM25 - protectedDailyPM25) / baselineDailyPM25) * 100))
        )
      : 0;

  return {
    unshieldedIndoorAQI,
    protectedIndoorAQI,
    unshieldedPM25,
    protectedPM25,
    baselineDailyPM25,
    protectedDailyPM25,
    outdoorCigarettes,
    baselineCigarettes,
    protectedCigarettes,
    cigarettesAvoided,
    pm25AvoidedMg,
    familyPm25AvoidedMgDay,
    winterFamilyPm25Grams,
    exposureDropPct,
    totalCo2SavedMonth,
    winterCo2SavedKg,
    totalSwapPmDrop,
    commuteObj,
    homeObj
  };
}

/**
 * Compute bedroom volume, Air Changes Per Hour (ACH), and clean-down cycle time
 * for a 280 m³/hr DIY Box-Fan + HEPA H13 unit.
 * @param {number} roomSqFt
 */
export function computeRoomAchStats(roomSqFt) {
  const safeSqFt = Math.max(60, Math.min(1000, Number(roomSqFt || 150)));
  const volumeM3 = Math.max(
    15,
    Math.round(safeSqFt * SCIENTIFIC_CONSTANTS.SQFT_TO_SQM * SCIENTIFIC_CONSTANTS.CEILING_HEIGHT_M)
  );
  const ach = +(SCIENTIFIC_CONSTANTS.DIY_HEPA_CADR_M3_HR / volumeM3).toFixed(1);
  const cleanCycleMins = Math.max(
    8,
    Math.round((volumeM3 / SCIENTIFIC_CONSTANTS.DIY_HEPA_CADR_M3_HR) * 60)
  );
  return { volumeM3, ach, cleanCycleMins };
}

/**
 * Build 5 time-blocked low-emission daily routine steps synchronized to diurnal inversion.
 */
export function buildDailyRoutineBlocks(city, airData, lifestyle, safestWindow) {
  const isSevere = airData.aqi > 200;
  const isModeratePlus = airData.aqi > 100;

  const morningSwap =
    lifestyle.hasSeniors || lifestyle.hasKids
      ? "Replace outdoor park walks with 20-minute indoor corridor strolls, pranayama, or mobility stretches."
      : isSevere
      ? "Move running/cardio indoors; deep inhalation above 200 AQI drives fine PM2.5 past nasal cilia."
      : "Keep outdoor exercise light and avoid main arterial roads before 9:30 AM.";

  const commuteGuidanceMap = {
    two_wheeler:
      "High-priority swap: take Metro/carpool today if possible, or wear a sealed N95 + wraparound glasses.",
    auto_bus: "Seat children away from open side curtains; ensure nose-clip N95 seal before boarding.",
    metro_car: "Switch car climate control to Internal Recirculate (never fresh-air intake in traffic).",
    wfh: "Keep work desk near sealed window away from main-road cross-drafts."
  };
  const commuteGuidance = commuteGuidanceMap[lifestyle.commuteMode] || commuteGuidanceMap.wfh;

  const cookingGuidance =
    lifestyle.cookingStyle === "gas_tadka"
      ? "Start kitchen chimney/exhaust 5 mins BEFORE heating oil, keep a lid on tadka, and avoid burning incense."
      : "Run induction + exhaust hood; swap evening agarbatti/dhoop for an LED or pure ghee diya.";

  const homeSealNote =
    lifestyle.homeType === "ground_roadside"
      ? "Low-floor priority: press foam weatherstrip along balcony & main door gaps to stop vehicle plume drift."
      : "Close bedroom doors and run HEPA / DIY box-fan filter on High for 4 air changes/hour.";

  return [
    {
      id: "morning_lockdown",
      time: "06:00 – 09:00 AM",
      title: "Morning Inversion Lockdown",
      category: "Zero-Exposure Start",
      action: morningSwap,
      why: `Winter ground cooling in ${city.name} traps overnight exhaust within 50m of the street until solar lift.`,
      directImpact: isSevere ? "-45% Morning Lung Dose" : "-25% Peak Inhalation",
      emissionImpact: "Zero cold-start idle trips"
    },
    {
      id: "commute_defense",
      time: "08:30 – 10:30 AM",
      title: "Low-Emission Commute Protocol",
      category: "Tailored Transit",
      action: commuteGuidance,
      why: "Traffic corridors register 2–3x higher ultrafine black carbon and NO₂ than ambient rooftop monitors.",
      directImpact: lifestyle.commuteMode === "metro_car" ? "-65% Commute PM2.5" : "-55% with N95/Metro",
      emissionImpact: "Cuts street-level NO₂"
    },
    {
      id: "solar_ventilation",
      time: safestWindow,
      title: "Solar Thermal Ventilation Window",
      category: "Smart Airing",
      action: `Open cross-windows for 15–20 minutes ONLY during ${safestWindow} when live AQI dips, then immediately damp-mop floors.`,
      why: "Peak midday sunlight expands the atmospheric boundary layer, dropping ground-level smog by 25–40%.",
      directImpact: "Flushes stale CO₂ safely",
      emissionImpact: "Passive natural airing (0W)"
    },
    {
      id: "evening_cooking",
      time: "06:30 – 08:30 PM",
      title: "Low-Smoke Kitchen & Ritual Routine",
      category: "Indoor Source Control",
      action: cookingGuidance,
      why: "Unvented frying & incense combustion in sealed winter flats create spikes worse than outdoor traffic.",
      directImpact: "-78% Indoor PM2.5 Spike",
      emissionImpact: "Eliminates indoor PAHs"
    },
    {
      id: "night_recovery",
      time: "09:00 PM – 06:00 AM",
      title: "Night Bedroom Seal & RWA Guard Care",
      category: "8-Hour Lung Recovery",
      action: `${homeSealNote} Confirm society security guards use electric heaters instead of scrap wood fires.`,
      why: "Sleeping in <40 AQI bedroom air gives bronchial cilia 8 uninterrupted hours to clear daytime particulates.",
      directImpact: isModeratePlus ? "-115 AQI Bedroom Drop" : "Clean 8h Recovery",
      emissionImpact: "Stops 2.4 kg PM2.5/gate"
    }
  ];
}

export { buildWhatsAppBroadcasts, computeRwaMetrics } from "./rwaMetrics.js";
