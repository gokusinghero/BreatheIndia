import React from "react";
import { Bot, Wrench } from "lucide-react";

/**
 * DIY ₹1,800 Box-Fan HEPA Purifier Blueprint, Room ACH Calculator, and N95 Seal Guide.
 */
export default function DiyPurifierCard({
  effectiveAirData,
  showDiyGuide,
  setShowDiyGuide,
  roomSqFt,
  setRoomSqFt,
  roomAchStats,
  askAiWithTopic
}) {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-[#161B19]/90 border border-zinc-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Wrench size={18} className="text-emerald-300" aria-hidden="true" />
          <div>
            <h2 className="font-display font-extrabold text-base text-zinc-100">
              ₹1,800 DIY Box-Fan HEPA Purifier Blueprint
            </h2>
            <p className="text-xs text-zinc-300">
              Build a 280 m³/hr Clean Air Delivery Rate (CADR) room scrubber in 5 minutes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
          <button
            type="button"
            aria-expanded={showDiyGuide}
            onClick={() => setShowDiyGuide((prev) => !prev)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-500/40 text-xs font-bold text-emerald-200 cursor-pointer"
          >
            {showDiyGuide ? "Hide Build Steps" : "Show 5-Min Build Guide"}
          </button>
          <button
            type="button"
            onClick={() =>
              askAiWithTopic(`Compare DIY box-fan purifier cost and sizing for a ${roomSqFt} sq ft room`)
            }
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Bot size={13} aria-hidden="true" />
            <span>Ask AI Purifier Bench</span>
          </button>
        </div>
      </div>

      {showDiyGuide && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-[#161B19] border border-zinc-800 space-y-1.5">
            <span className="text-xs font-mono font-bold text-emerald-300">STEP 1 • PARTS (~₹1,800)</span>
            <p className="text-xs text-zinc-200 leading-relaxed">
              1x 12-inch high-RPM cabin/box fan (₹1,100) + 1x cylindrical or flat True HEPA H13 replacement filter (₹650) + wide masking tape (₹50).
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#161B19] border border-zinc-800 space-y-1.5">
            <span className="text-xs font-mono font-bold text-emerald-300">STEP 2 • SEAL AIRFLOW</span>
            <p className="text-xs text-zinc-200 leading-relaxed">
              Tape the HEPA filter tightly onto the INTAKE (suction) side of the fan with zero air gaps so all room air is forced through the H13 pleats.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#161B19] border border-zinc-800 space-y-1.5">
            <span className="text-xs font-mono font-bold text-teal-300">3-YEAR TCO IMPACT</span>
            <p className="text-xs text-zinc-200 leading-relaxed">
              DIY 3-Yr Total Cost: <strong className="text-teal-300">₹3,100</strong> vs. Commercial ₹14,500+ vs. Premium ₹34,000+ — same 99.95% PM2.5 capture.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
        <div className="p-4 rounded-2xl bg-[#161B19] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="room-sqft-slider" className="font-bold text-zinc-100">
              Room Volume &amp; Clean-Down Speed
            </label>
            <strong className="font-mono text-emerald-300">{roomSqFt} sq ft</strong>
          </div>
          <input
            id="room-sqft-slider"
            type="range"
            min="80"
            max="400"
            step="10"
            aria-valuetext={`${roomSqFt} square feet`}
            value={roomSqFt}
            onChange={(e) => setRoomSqFt(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-[#1C2320] border border-zinc-800">
              <span className="text-zinc-300 block">Room Volume</span>
              <strong className="font-mono text-zinc-100">{roomAchStats.volumeM3} m³</strong>
            </div>
            <div className="p-2 rounded-xl bg-[#1C2320] border border-zinc-800">
              <span className="text-zinc-300 block">Filtration Rate</span>
              <strong className="font-mono text-teal-300">{roomAchStats.ach} ACH</strong>
            </div>
            <div className="p-2 rounded-xl bg-[#1C2320] border border-zinc-800">
              <span className="text-zinc-300 block">1 Air Cycle</span>
              <strong className="font-mono text-emerald-300">{roomAchStats.cleanCycleMins} mins</strong>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#161B19] border border-zinc-800 space-y-2 text-xs">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-bold text-zinc-100">N95 / FFP2 Seal &amp; Lifespan Hack</span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/50 text-emerald-200 border border-zinc-800">
              ~{Math.max(12, Math.round(9000 / Math.max(50, effectiveAirData.aqi)))} hrs life at {effectiveAirData.aqi} AQI
            </span>
          </div>
          <p className="text-xs text-zinc-200 leading-relaxed">
            1) Pinch nose-bridge wire with both hands. 2) Exhale sharply — if air leaks near eyes, tighten head-loops. 3) Air-dry in shade after use; never wash electrostatic N95 meltblown layers with water.
          </p>
        </div>
      </div>
    </div>
  );
}
