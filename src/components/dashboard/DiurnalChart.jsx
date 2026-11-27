import React from "react";
import { Sun } from "lucide-react";

/**
 * 24-Hour Smog Dispersion Flow bar chart with peak and safest window highlights.
 */
export default function DiurnalChart({ trend, peakPoint, safestPoint, safestWindowLabel }) {
  return (
    <div className="lg:col-span-7 bg-[#161B19]/90 p-5 rounded-2xl border border-zinc-800 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800 flex-wrap gap-2">
        <div>
          <h2 className="font-display font-bold text-sm text-zinc-100">
            24-Hour Smog Dispersion Flow
          </h2>
          <span className="text-[11px] text-zinc-300 font-medium">
            Thermal Inversion &amp; Boundary Layer Trajectory
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-950/40 border border-zinc-800 text-teal-300 text-[11px] font-bold">
          <Sun size={12} aria-hidden="true" />
          <span>Safest: {safestWindowLabel}</span>
        </div>
      </div>

      <div className="pt-6 pb-2" role="region" aria-label="24-hour AQI trajectory chart">
        <ul className="grid grid-cols-6 gap-2 sm:gap-3 items-end h-48">
          {trend.slice(0, 6).map((point) => {
            const isPeak = point.aqi === peakPoint.aqi;
            const isSafe = point.aqi === safestPoint.aqi && !isPeak;
            const heightPct = Math.min(95, Math.max(22, (point.aqi / 380) * 100));

            return (
              <li
                key={point.time}
                className="flex flex-col items-center h-full justify-end group"
                aria-label={`${point.time}: ${point.aqi} AQI`}
              >
                {isPeak ? (
                  <div className="mb-2 flex flex-col items-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-mono font-bold shadow-[0_0_15px_rgba(132,169,140,0.8)] whitespace-nowrap">
                      Peak {point.aqi}
                    </span>
                    <div
                      className="w-2 h-2 rounded-full bg-white ring-4 ring-emerald-400 shadow-[0_0_10px_white] mt-0.5"
                      aria-hidden="true"
                    />
                  </div>
                ) : (
                  <span className="text-[11px] font-mono text-zinc-300 mb-1">
                    {point.aqi}
                  </span>
                )}

                <div className="w-full max-w-[42px] bg-[#1C2320] rounded-full overflow-hidden p-1 flex flex-col justify-end h-32 border border-zinc-800">
                  <div
                    className={`w-full rounded-full transition-all duration-700 ${
                      isPeak
                        ? "bg-gradient-to-t from-emerald-600 via-emerald-400 to-teal-300 shadow-[0_0_20px_rgba(132,169,140,0.7)]"
                        : isSafe
                        ? "bg-gradient-to-t from-teal-700 to-emerald-400 shadow-[0_0_15px_rgba(132,169,140,0.5)]"
                        : "bg-gradient-to-t from-zinc-700 to-zinc-500"
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>

                <span
                  className={`text-[11px] font-mono mt-2 font-semibold ${
                    isPeak
                      ? "text-emerald-300 font-bold"
                      : isSafe
                      ? "text-teal-300 font-bold"
                      : "text-zinc-300"
                  }`}
                >
                  {point.time}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
