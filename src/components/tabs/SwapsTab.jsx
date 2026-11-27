import React from "react";
import { Check, CheckCircle2, Star, X } from "lucide-react";
import { useAirPulse } from "../../context/AirPulseContext.jsx";
import { ECO_SWAPS_DATA } from "../../data/lifestyleData.js";

/**
 * Sustainable Alternatives & Direct Impact Explorer Tab.
 */
export default function SwapsTab() {
  const {
    city,
    locationProfile,
    lifestyle,
    metrics,
    adoptedSwaps,
    toggleEcoSwap
  } = useAirPulse();
  return (
    <div id="panel-swaps" role="tabpanel" aria-label="Eco Swaps" className="space-y-6 animate-fadeIn">
      <div className="p-6 md:p-8 rounded-3xl bg-[#161B19] border border-zinc-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
              Tailored to {city.name} &amp; {metrics.commuteObj.label}
            </span>
            <h2 className="font-display font-extrabold text-xl text-zinc-100 mt-1">
              Sustainable Alternatives &amp; Direct Impact Explorer
            </h2>
            <p className="text-xs text-zinc-300 mt-0.5">
              Select sustainable swaps below to see exactly how much pollution, CO₂, and lung damage your choices prevent
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="px-3.5 py-2 rounded-2xl bg-[#1C2320] border border-zinc-800">
              <span className="text-[11px] font-mono text-emerald-300 block">SWAP PM2.5 DROP</span>
              <span className="font-mono font-black text-lg text-emerald-200">
                -{metrics.totalSwapPmDrop} µg/m³
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-teal-950/40 border border-zinc-800">
              <span className="text-[11px] font-mono text-teal-300 block">WINTER CO₂ CUT</span>
              <span className="font-mono font-black text-lg text-teal-300">
                {metrics.winterCo2SavedKg} kg
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-teal-950/40 border border-zinc-800">
              <span className="text-[11px] font-mono text-teal-300 block">WINTER PM2.5 AVOIDED</span>
              <span className="font-mono font-black text-lg text-zinc-100">
                {metrics.winterFamilyPm25Grams} g
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ECO_SWAPS_DATA.map((swap) => {
            const isAdopted = adoptedSwaps.includes(swap.id);
            const isTopMatch =
              (swap.id === "commute_metro" &&
                (lifestyle.commuteMode === "two_wheeler" || lifestyle.commuteMode === "auto_bus")) ||
              (swap.id === "cooking_induction" && lifestyle.cookingStyle === "gas_tadka") ||
              (swap.id === "ritual_led" && lifestyle.burnsIncense) ||
              (swap.id === "guard_heater" &&
                (lifestyle.homeType === "ground_roadside" ||
                  locationProfile.regionType === "indo-gangetic" ||
                  locationProfile.regionType === "industrial"));
            return (
              <button
                key={swap.id}
                type="button"
                aria-pressed={isAdopted}
                onClick={() => toggleEcoSwap(swap.id)}
                className={`w-full text-left p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  isAdopted
                    ? "bg-teal-950/30 border-emerald-500/60 shadow-[0_0_20px_rgba(132,169,140,0.15)]"
                    : "bg-[#161B19] border-zinc-800 hover:border-emerald-500/60"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-300 bg-teal-950/40 px-2.5 py-0.5 rounded-full border border-zinc-800">
                        {swap.category}
                      </span>
                      {isTopMatch && (
                        <span className="text-[11px] font-mono font-bold text-amber-200 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/30 inline-flex items-center gap-1">
                          <Star size={10} aria-hidden="true" />
                          <span>Top Match</span>
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                        isAdopted
                          ? "bg-teal-900/50 border-emerald-400 text-emerald-200"
                          : "bg-[#1C2320] border-zinc-800 text-zinc-300"
                      }`}
                    >
                      {isAdopted && <CheckCircle2 size={11} aria-hidden="true" />}
                      <span>{isAdopted ? "Adopted" : "Adopt Swap"}</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-zinc-300 line-through flex items-center gap-1.5">
                      <X size={12} className="text-red-300 shrink-0" aria-hidden="true" />
                      <span>{swap.from}</span>
                    </span>
                    <span className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                      <Check size={14} className="text-emerald-300 shrink-0" aria-hidden="true" />
                      <span>{swap.to}</span>
                    </span>
                  </div>

                  <p className="text-xs text-zinc-200 leading-relaxed">{swap.why}</p>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs w-full">
                  <span className="font-mono font-bold text-emerald-300">{swap.impactBadge}</span>
                  <span className="font-mono text-zinc-300">{swap.rupeeDeltaMonth}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
