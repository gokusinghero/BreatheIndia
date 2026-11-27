import React, { useState } from "react";

/**
 * 24-Hour Boundary Layer & Inversion Scrubber widget.
 */
export function DiurnalInversionWidget({ airData, safestWindowLabel }) {
  const [slotIdx, setSlotIdx] = useState(0);
  const points = airData.trend.slice(0, 6);
  const current = points[slotIdx] || points[0];
  const ceilingHeight =
    current.time.includes("12") || current.time.includes("3")
      ? 950
      : current.time.includes("9 AM") || current.time.includes("6 PM")
      ? 240
      : 65;

  return (
    <div className="p-5 rounded-2xl bg-[#161B19] border border-zinc-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-zinc-100">24-Hour Boundary Layer &amp; Inversion Scrubber</h3>
          <p className="text-xs text-zinc-300">
            Scrub across today&apos;s cycle — best cross-ventilation window: {safestWindowLabel}
          </p>
        </div>
        <span className="px-3 py-1 rounded-xl bg-emerald-950/50 border border-zinc-800 font-mono text-xs text-emerald-200">
          {current.time}: {current.aqi} AQI • Lid ~{ceilingHeight}m
        </span>
      </div>

      <label htmlFor="diurnal-inversion-slider" className="sr-only">
        Scrub time of day to inspect inversion ceiling height
      </label>
      <input
        id="diurnal-inversion-slider"
        type="range"
        min="0"
        max={Math.max(0, points.length - 1)}
        value={slotIdx}
        aria-valuetext={`${current.time}, ${current.aqi} AQI`}
        onChange={(e) => setSlotIdx(Number(e.target.value))}
        className="w-full accent-emerald-500 cursor-pointer"
      />

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-3 rounded-xl bg-[#1C2320] border border-zinc-800">
          <span className="text-[11px] text-zinc-300 block">Inversion Ceiling</span>
          <strong className="font-mono text-zinc-100">{ceilingHeight} meters</strong>
        </div>
        <div className="p-3 rounded-xl bg-[#1C2320] border border-zinc-800">
          <span className="text-[11px] text-zinc-300 block">Projected PM2.5</span>
          <strong className="font-mono text-zinc-100">{current.pm25} µg/m³</strong>
        </div>
        <div className="p-3 rounded-xl bg-[#1C2320] border border-zinc-800">
          <span className="text-[11px] text-zinc-300 block">Window Advice</span>
          <strong className="text-teal-300">
            {ceilingHeight > 500 ? "Open 20 mins" : "Keep Sealed"}
          </strong>
        </div>
      </div>
    </div>
  );
}
