import React from "react";
import { Bot, Check, Copy, Sun } from "lucide-react";
import { useAirPulse } from "../../context/AirPulseContext.jsx";
import { getAQICategory } from "../../utils/aqi.js";

/**
 * Low-Emission Daily Routine Tab: 24h diurnal planner & completion tracker.
 */
export default function RoutineTab() {
  const {
    city,
    effectiveAirData,
    metrics,
    routineBlocks,
    routineCompleted,
    setRoutineCompleted,
    completedRoutineCount,
    safestWindowLabel,
    safestPoint,
    peakPoint,
    copiedKey,
    copyToClipboard,
    askAiWithTopic
  } = useAirPulse();
  return (
    <div id="panel-routine" role="tabpanel" aria-label="Daily Routine" className="space-y-6 animate-fadeIn">
      <div className="p-6 md:p-8 rounded-3xl bg-[#161B19] border border-zinc-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
              Tailored to {city.name} ({effectiveAirData.aqi} AQI) • {metrics.commuteObj.label} • {metrics.homeObj.label}
            </span>
            <h2 className="font-display font-extrabold text-xl text-zinc-100 mt-1">
              Low-Emission Daily Defense Routine
            </h2>
            <p className="text-xs text-zinc-300 mt-0.5">
              Time-blocked actions synchronized with today&apos;s thermal inversion curve to cut lung dose &amp; neighborhood emissions
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="px-3.5 py-2 rounded-2xl bg-[#1C2320] border border-zinc-800 text-center">
              <span className="text-[11px] font-mono text-zinc-300 block">ADOPTED TODAY</span>
              <span className="font-mono font-black text-base text-emerald-300">
                {completedRoutineCount} / {routineBlocks.length}
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-teal-950/40 border border-zinc-800 text-center">
              <span className="text-[11px] font-mono text-teal-300 block">FAMILY AVOIDED</span>
              <span className="font-mono font-black text-base text-teal-300">
                {metrics.familyPm25AvoidedMgDay} mg
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const summary = `*BreatheSafe India Daily Routine — ${city.name} (${effectiveAirData.aqi} AQI)*\n${routineBlocks
                  .map((b) => `• *${b.time}* (${b.title}): ${b.action} [${b.directImpact}]`)
                  .join("\n")}\n\nImpact: Saves ${metrics.familyPm25AvoidedMgDay} mg PM2.5/day for our family!`;
                copyToClipboard("dailyRoutine", summary);
              }}
              className="px-3.5 py-2.5 rounded-2xl bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-500/40 text-xs font-bold text-emerald-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Copy size={13} aria-hidden="true" />
              <span>{copiedKey === "dailyRoutine" ? "Copied!" : "Share Routine"}</span>
            </button>
            <button
              type="button"
              onClick={() =>
                askAiWithTopic(
                  `Customize my daily routine in ${city.name} at ${effectiveAirData.aqi} AQI`
                )
              }
              className="px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Bot size={13} aria-hidden="true" />
              <span>Refine with AI</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {routineBlocks.map((block) => {
            const done = !!routineCompleted[block.id];
            return (
              <button
                key={block.id}
                type="button"
                aria-pressed={done}
                onClick={() =>
                  setRoutineCompleted((prev) => ({ ...prev, [block.id]: !prev[block.id] }))
                }
                className={`w-full text-left p-4 md:p-5 rounded-2xl border cursor-pointer transition-all ${
                  done
                    ? "bg-teal-950/40 border-emerald-500/60 shadow-[0_0_20px_rgba(132,169,140,0.15)]"
                    : "bg-[#161B19] border-zinc-800 hover:border-emerald-500/40"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    aria-hidden="true"
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                      done
                        ? "bg-emerald-600 border-emerald-400 text-white"
                        : "bg-[#1C2320] border-zinc-800 text-transparent"
                    }`}
                  >
                    <Check size={13} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#1C2320] border border-zinc-800 text-xs font-mono font-bold text-emerald-200">
                          {block.time}
                        </span>
                        <h3 className="text-sm font-bold text-zinc-100">{block.title}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-950/40 border border-zinc-800 text-[11px] font-mono font-bold text-teal-300">
                          {block.directImpact}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/40 text-[11px] font-mono font-bold text-amber-200">
                          {block.emissionImpact}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-200 leading-relaxed">{block.action}</p>

                    <div className="text-xs text-zinc-300 bg-[#1C2320] px-3 py-2 rounded-xl border border-zinc-800">
                      <strong className="text-emerald-300">Direct Impact &amp; Why:</strong> {block.why}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 md:p-8 rounded-3xl bg-[#161B19] border border-zinc-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div>
            <h2 className="font-display font-extrabold text-lg text-zinc-100">
              24-Hour Diurnal Dispersion Windows ({city.name})
            </h2>
            <p className="text-xs text-zinc-300 mt-0.5">
              Hourly AQI trajectory guiding when to seal doors vs. cross-ventilate
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/40 border border-zinc-800 text-teal-300 text-xs font-bold">
            <Sun size={13} aria-hidden="true" />
            <span>Safest Window: {safestWindowLabel}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {effectiveAirData.trend.slice(0, 6).map((point) => {
            const cat = getAQICategory(point.aqi);
            const isSafeWindow = point.aqi === safestPoint.aqi;
            const isPeak = point.aqi === peakPoint.aqi;

            return (
              <div
                key={point.time}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isPeak
                    ? "bg-teal-950/40 border-emerald-400 shadow-[0_0_20px_rgba(132,169,140,0.3)]"
                    : isSafeWindow
                    ? "bg-teal-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(132,169,140,0.2)]"
                    : "bg-[#161B19] border-zinc-800"
                }`}
              >
                <span className="text-xs font-mono font-bold text-zinc-300 block">{point.time}</span>
                <span className={`font-mono font-black text-3xl block my-1.5 ${cat.ringTextClass}`}>
                  {point.aqi}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider block text-zinc-200">
                  {cat.status}
                </span>
                {isSafeWindow && (
                  <span className="text-[11px] font-extrabold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full mt-2 inline-block border border-zinc-800">
                    Safe Air Out
                  </span>
                )}
                {isPeak && (
                  <span className="text-[11px] font-extrabold text-emerald-200 bg-emerald-950/60 px-2 py-0.5 rounded-full mt-2 inline-block border border-zinc-800">
                    Peak Smog
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-2xl bg-[#1C2320] border border-zinc-800 text-xs space-y-1.5">
          <span className="font-bold text-emerald-300 block">
            Atmospheric Science: Why does timing your routine cut exposure by 25–40%?
          </span>
          <p className="text-zinc-200 leading-relaxed">
            During winter nights, ground cooling forms a shallow Thermal Inversion Lid that traps
            exhaust and biomass smoke near street level. Midday solar warming triggers convective
            updrafts, expanding the boundary layer and diluting ground AQI briefly in the early afternoon.
          </p>
        </div>
      </div>
    </div>
  );
}
