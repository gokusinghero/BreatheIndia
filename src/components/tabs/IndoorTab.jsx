import React from "react";
import { CheckCircle2, XCircle, Zap } from "lucide-react";
import { useAirPulse } from "../../context/AirPulseContext.jsx";
import { INDOOR_HACKS_DATA } from "../../data/lifestyleData.js";
import DiyPurifierCard from "../indoor/DiyPurifierCard.jsx";

/**
 * Indoor Air Quality Hacks & Room ACH Simulator Tab.
 */
export default function IndoorTab() {
  const {
    city,
    effectiveAirData,
    indoorCategory,
    metrics,
    indoorActions,
    setIndoorActions,
    showDiyGuide,
    setShowDiyGuide,
    roomSqFt,
    setRoomSqFt,
    roomAchStats,
    askAiWithTopic
  } = useAirPulse();
  return (
    <div id="panel-indoor" role="tabpanel" aria-label="Indoor Hacks" className="space-y-6 animate-fadeIn">
      <div className="p-6 md:p-8 rounded-3xl bg-[#161B19] border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div>
            <h2 className="font-display font-extrabold text-lg text-zinc-100">
              Indoor Air Quality Hacks &amp; Room Simulator
            </h2>
            <p className="text-xs text-zinc-300 mt-0.5">
              Tailored for your <strong className="text-zinc-100">{metrics.homeObj.label}</strong> in{" "}
              <strong className="text-zinc-100">{city.name}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-zinc-300">Simulated Room:</span>
            <span className={`font-mono font-black text-2xl ${indoorCategory.ringTextClass}`}>
              ~{metrics.protectedIndoorAQI} AQI
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${indoorCategory.badgeBorderClass}`}>
              {indoorCategory.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-red-950/35 border border-red-500/30 text-center">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-300 inline-flex items-center gap-1.5">
              <XCircle size={13} aria-hidden="true" />
              <span>Unsealed + Sources</span>
            </span>
            <span className="font-mono font-black text-3xl md:text-4xl text-red-300 my-1.5 block">
              ~{metrics.unshieldedIndoorAQI} AQI
            </span>
            <p className="text-xs text-zinc-300">
              Draft infiltration + cooking &amp; incense smoke (~{metrics.unshieldedPM25} µg/m³ PM2.5)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-950/40 border border-zinc-800 text-center">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-300 inline-flex items-center gap-1.5">
              <CheckCircle2 size={13} aria-hidden="true" />
              <span>With Active IAQ Hacks</span>
            </span>
            <span className="font-mono font-black text-3xl md:text-4xl text-teal-300 my-1.5 block">
              ~{metrics.protectedIndoorAQI} AQI
            </span>
            <p className="text-xs text-zinc-300">
              Protected indoor air (~{metrics.protectedPM25} µg/m³ PM2.5)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-center flex flex-col justify-center">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-200 inline-flex items-center justify-center gap-1.5">
              <Zap size={13} aria-hidden="true" />
              <span>Direct Family Impact</span>
            </span>
            <span className="font-mono font-black text-3xl text-zinc-100 my-1 block">
              {metrics.pm25AvoidedMg} mg
            </span>
            <p className="text-xs text-emerald-200 font-medium">
              PM2.5 avoided/person/day ({metrics.cigarettesAvoided} fewer cigs eq)
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 block">
            Toggle low-cost indoor hacks applied in your home:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {INDOOR_HACKS_DATA.map((hack) => {
              const active = !!indoorActions[hack.key];
              return (
                <label
                  key={hack.key}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    active
                      ? "bg-teal-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(132,169,140,0.15)]"
                      : "bg-[#161B19] border-zinc-800 hover:border-emerald-500/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) =>
                      setIndoorActions({ ...indoorActions, [hack.key]: e.target.checked })
                    }
                    className="mt-1 h-4 w-4 rounded accent-emerald-500 cursor-pointer shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-zinc-100 leading-snug">{hack.title}</span>
                      <span className="font-mono text-[11px] font-extrabold text-teal-300 bg-teal-950/40 px-2 py-0.5 rounded-full border border-zinc-800 shrink-0">
                        {hack.badge}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-200 leading-relaxed">{hack.desc}</p>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-800">
                      <span className="text-zinc-300">{hack.why}</span>
                      <span className="font-mono font-bold text-emerald-300 shrink-0 ml-2">
                        {hack.cost}
                      </span>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <DiyPurifierCard
        effectiveAirData={effectiveAirData}
        showDiyGuide={showDiyGuide}
        setShowDiyGuide={setShowDiyGuide}
        roomSqFt={roomSqFt}
        setRoomSqFt={setRoomSqFt}
        roomAchStats={roomAchStats}
        askAiWithTopic={askAiWithTopic}
      />
    </div>
  );
}
