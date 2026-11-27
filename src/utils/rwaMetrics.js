/**
 * RWA society-scale pollution reduction and WhatsApp circular builders.
 * @module utils/rwaMetrics
 */

import { SCIENTIFIC_CONSTANTS } from "./metrics.js";
import { sanitizeText } from "./security.js";

/**
 * Compute RWA society-scale impact metrics from flat count and active pledges.
 */
export function computeRwaMetrics(
  flatCount,
  rwaPledges = {},
  totalCo2SavedMonth = 0,
  exposureDropPct = 0
) {
  const safeFlats = Math.max(1, Math.min(500, Number(flatCount || 40)));
  const gates = Math.max(1, Math.ceil(safeFlats / 30));
  const heaterPmSavedKgMonth = rwaPledges.guardHeaters
    ? gates * SCIENTIFIC_CONSTANTS.GUARD_HEATER_PM25_KG_NIGHT * 30
    : 0;
  const dampDustSavedKgMonth = rwaPledges.dampMopping ? safeFlats * 0.18 : 0;
  const leafPmSavedKgMonth = rwaPledges.noLeafBurning ? gates * 12 : 0;
  const idlingPmSavedKgMonth = rwaPledges.noIdling ? safeFlats * 0.12 : 0;

  const totalPmSavedKgMonth = +(
    heaterPmSavedKgMonth +
    dampDustSavedKgMonth +
    leafPmSavedKgMonth +
    idlingPmSavedKgMonth
  ).toFixed(1);

  const co2SavedKgMonth = Math.round(
    (rwaPledges.guardHeaters ? gates * 320 : 0) +
      (rwaPledges.noLeafBurning ? gates * 180 : 0) +
      (rwaPledges.noIdling ? safeFlats * 14 : 0) +
      safeFlats * (totalCo2SavedMonth * 0.4)
  );

  const cleanAirPersonDays = Math.round(safeFlats * 3.5 * 30 * (exposureDropPct / 100));
  const doctorVisitsAverted = Math.max(1, Math.round(totalPmSavedKgMonth * 0.65 + safeFlats * 0.12));

  return {
    gates,
    totalPmSavedKgMonth,
    co2SavedKgMonth,
    cleanAirPersonDays,
    doctorVisitsAverted
  };
}

/**
 * Build ready-to-send WhatsApp society and family broadcast circulars.
 */
export function buildWhatsAppBroadcasts({
  societyName,
  flatCount,
  city,
  effectiveAirData,
  aqiCategory,
  rwaPledges,
  rwaMetrics,
  metrics,
  safestWindowLabel
}) {
  const safeSociety = sanitizeText(societyName, 80) || "Our Society";
  const activeCount = Object.values(rwaPledges).filter(Boolean).length;

  return [
    {
      id: "rwaCircular",
      title: "Full RWA Clean-Air Resolution Circular",
      purpose: `Mobilize all ${flatCount} flats in ${safeSociety} with quantified pollution impact`,
      text:
        `*${safeSociety} — Winter Clean-Air Action Circular*\n` +
        `City: ${city.name} AQI: *${effectiveAirData.aqi} (${aqiCategory.status})*\n\n` +
        `By adopting ${activeCount} society-wide steps across ${flatCount} flats:\n` +
        `- *${rwaMetrics.totalPmSavedKgMonth} kg* of toxic PM2.5 prevented/month\n` +
        `- *${rwaMetrics.co2SavedKgMonth} kg* CO2 saved monthly\n\n` +
        `Proposed Actions:\n` +
        `${rwaPledges.guardHeaters ? "• Pool ₹150/flat for 800W guard heaters (stops 2.4 kg PM2.5/gate/night from scrap fires)\n" : ""}` +
        `${rwaPledges.dampMopping ? "• Mandate damp mopping (Geela Pocha) instead of dry jhadu in lobbies\n" : ""}` +
        `${rwaPledges.noLeafBurning ? "• Strict ban on dry leaf & waste burning; compost garden litter\n" : ""}` +
        `${rwaPledges.noIdling ? "• Enforce engine-off No-Idling rule at society entry gates\n" : ""}` +
        `\nReply 'YES' to co-sponsor!`
    },
    {
      id: "moppingNotice",
      title: "Estate Manager: Damp Mopping Mandate",
      purpose: "Stop dry broom micro-dust resuspension in corridors & basements",
      text:
        `*NOTICE TO ESTATE MANAGER & HOUSEKEEPING (${safeSociety})*\n` +
        `Due to ${aqiCategory.status} air quality in ${city.name} (AQI ${effectiveAirData.aqi}):\n` +
        `1. STOP all dry broom sweeping (Jhadu) in tower lobbies and corridors — it kicks fine PM2.5 back into children's lungs.\n` +
        `2. MANDATE damp mopping (Geela Pocha) twice daily.\n` +
        `Thank you for protecting our building's indoor air!`
    },
    {
      id: "familyWarning",
      title: "Family Smog Alert & Safe Routine",
      purpose: "Alert family group with today's cigarette equivalence & safest window",
      text:
        `*Family Air Alert (${city.name} AQI ${effectiveAirData.aqi})*\n` +
        `Outdoor air today = smoking *${metrics.outdoorCigarettes} cigarettes/day*.\n` +
        `• Morning walk: Shift indoors until *${safestWindowLabel}* (safest airing window).\n` +
        `• Commute: Wear tight-fit N95 & keep car vents on Recirculate.\n` +
        `• Evening: Run kitchen chimney 5 mins before tadka & skip agarbatti smoke.\n` +
        `Stay safe!`
    }
  ];
}
