import React from "react";

/**
 * Respiratory & Bronchial Precaution Protocol widget.
 */
export function AsthmaRiskWidget({ airData, protectedIndoorAQI }) {
  const pefrDropPct = airData.aqi > 300 ? "18–25%" : airData.aqi > 200 ? "12–17%" : "5–10%";
  return (
    <div className="p-5 rounded-2xl bg-[#161B19] border border-zinc-800 space-y-3 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-zinc-100">Respiratory &amp; Bronchial Precaution Protocol</h3>
        <span className="px-2.5 py-1 rounded-full bg-red-950/35 border border-red-500/30 text-red-200 font-mono font-bold">
          Estimated Outdoor PEFR Dip: {pefrDropPct}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-zinc-200">
        <div className="p-3 rounded-xl bg-[#1C2320] border border-zinc-800">
          <strong className="text-emerald-300 block mb-1">1. Pre-Exposure Buffer</strong>
          Keep prescribed reliever inhaler accessible; stay inside your {protectedIndoorAQI} AQI clean zone during 6–10 AM.
        </div>
        <div className="p-3 rounded-xl bg-[#1C2320] border border-zinc-800">
          <strong className="text-emerald-300 block mb-1">2. Warm Moisture Shield</strong>
          Use warm saline steam/hydration after outdoor transit to help mucociliary clearance of trapped dust.
        </div>
        <div className="p-3 rounded-xl bg-[#1C2320] border border-zinc-800">
          <strong className="text-emerald-300 block mb-1">3. Red-Flag Escalation</strong>
          If night cough, wheezing, or SpO₂ &lt;94% persists, consult a physician immediately.
        </div>
      </div>
    </div>
  );
}
