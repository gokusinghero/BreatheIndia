import React from "react";
import { AlertTriangle, Bot, Cigarette, Clock, MapPin, RefreshCw, Sliders } from "lucide-react";
import DiurnalChart from "./DiurnalChart.jsx";

/**
 * Live AQI & Smog Simulator centerpiece card with 24-hour diurnal dispersion chart
 * and location smog drivers.
 */
export default function TelemetryHeroCard({
  city,
  effectiveAirData,
  aqiCategory,
  locationProfile,
  metrics,
  isSimulatingAQI,
  setIsSimulatingAQI,
  simulatedAQI,
  setSimulatedAQI,
  loading,
  loadCityData,
  peakPoint,
  safestPoint,
  safestWindowLabel,
  setActiveTab,
  setIsSearchOpen,
  askAiWithTopic
}) {
  return (
    <div className="relative rounded-3xl bg-[#161B19] backdrop-blur-2xl border border-zinc-800 p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.65)] overflow-hidden">
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ background: aqiCategory.glowColor }}
        aria-hidden="true"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-800">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div
            aria-hidden="true"
            className={`w-2.5 h-2.5 rounded-full ${
              isSimulatingAQI ? "bg-emerald-400 animate-pulse" : "bg-emerald-400"
            }`}
          />
          <span className="text-xs font-mono font-bold tracking-wider text-zinc-200 uppercase">
            {isSimulatingAQI ? "SIMULATED SMOG EPISODE" : "LIVE SENSOR TELEMETRY"} — {city.name.toUpperCase()}
          </span>
          <span className="text-xs text-zinc-300 font-mono">
            ({isSimulatingAQI ? "Scenario Stress Test" : `Updated ${effectiveAirData.updatedAt}`})
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            aria-pressed={isSimulatingAQI}
            onClick={() => setIsSimulatingAQI((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
              isSimulatingAQI
                ? "bg-emerald-600 text-white border-emerald-400 shadow-[0_0_12px_rgba(132,169,140,0.5)]"
                : "bg-[#1C2320] hover:bg-[#232C28] text-emerald-200 border-zinc-800"
            }`}
          >
            <Sliders size={12} aria-hidden="true" />
            <span>{isSimulatingAQI ? "Exit Simulator" : "Simulate Smog (50-500)"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSimulatingAQI(false);
              loadCityData(city);
            }}
            disabled={loading}
            aria-busy={loading}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C2320] hover:bg-[#232C28] text-xs font-semibold text-zinc-200 border border-zinc-800 transition-colors cursor-pointer"
          >
            <RefreshCw size={12} className={loading ? "animate-spin text-emerald-300" : ""} aria-hidden="true" />
            <span>Sync Feed</span>
            <span className="sr-only">{loading ? "Syncing live air quality..." : ""}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C2320] hover:bg-[#232C28] text-xs font-semibold text-emerald-200 border border-zinc-800 transition-colors cursor-pointer"
          >
            <MapPin size={12} aria-hidden="true" />
            <span>Change City</span>
          </button>
        </div>
      </div>

      {isSimulatingAQI && (
        <div className="mt-4 p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <label htmlFor="smog-simulator-slider" className="font-mono font-bold text-emerald-200">
              Severe Winter Smog Scenario Slider: {simulatedAQI} AQI ({aqiCategory.grap})
            </label>
            <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Smog scenario presets">
              {[
                { label: "Moderate 95", val: 95 },
                { label: "GRAP I • 180", val: 180 },
                { label: "GRAP II • 285", val: 285 },
                { label: "GRAP IV • 450", val: 450 }
              ].map((preset) => (
                <button
                  key={preset.val}
                  type="button"
                  aria-pressed={simulatedAQI === preset.val}
                  onClick={() => setSimulatedAQI(preset.val)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border cursor-pointer ${
                    simulatedAQI === preset.val
                      ? "bg-emerald-600 border-emerald-400 text-white"
                      : "bg-[#1C2320] border-zinc-800 text-zinc-300 hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <input
            id="smog-simulator-slider"
            type="range"
            min="50"
            max="500"
            step="5"
            aria-valuetext={`${simulatedAQI} AQI`}
            value={simulatedAQI}
            onChange={(e) => setSimulatedAQI(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-center">
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C2320] border border-zinc-800">
            <span className={`w-2 h-2 rounded-full ${aqiCategory.badgeColor}`} aria-hidden="true" />
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-200">
              {aqiCategory.status}
            </span>
            <span className="text-[11px] text-teal-300 font-bold px-1.5 py-0.5 rounded bg-teal-950/40">
              {aqiCategory.grap}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-widest block">
              US-EPA Air Quality Index
            </span>
            <div className="flex items-baseline gap-3">
              <span
                className={`font-mono font-black text-6xl sm:text-7xl md:text-8xl tracking-tighter ${aqiCategory.ringTextClass}`}
              >
                {effectiveAirData.aqi}
              </span>
              <span className="text-sm font-bold text-zinc-300 uppercase font-mono">AQI</span>
            </div>
          </div>

          <p className="text-sm text-zinc-200 leading-relaxed font-medium">{aqiCategory.summary}</p>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1C2320] border border-zinc-800 text-xs text-zinc-200 shadow-inner">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/50 border border-zinc-800 flex items-center justify-center shrink-0">
              <Cigarette size={18} className="text-emerald-300" aria-hidden="true" />
            </div>
            <div>
              <span className="text-[11px] text-zinc-300 block font-medium">
                Berkeley Earth Equivalence ({effectiveAirData.pm25} µg/m³ ÷ 22)
              </span>
              <span className="font-medium">
                Outdoor air = smoking{" "}
                <strong className="font-mono text-emerald-300 text-sm font-bold">
                  {metrics.outdoorCigarettes} cigarettes
                </strong>{" "}
                / day
              </span>
            </div>
          </div>
        </div>

        <DiurnalChart
          trend={effectiveAirData.trend}
          peakPoint={peakPoint}
          safestPoint={safestPoint}
          safestWindowLabel={safestWindowLabel}
        />
      </div>

      <div className="mt-6 p-4 rounded-2xl bg-[#1C2320] border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-1.5">
            <MapPin size={12} aria-hidden="true" />
            <span>{city.name} Smog Fingerprint</span>
          </span>
          <p className="text-xs text-zinc-200 font-medium">{locationProfile.smogDrivers}</p>
          <p className="text-xs text-zinc-300">{locationProfile.localTip}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap self-start md:self-center">
          <button
            type="button"
            onClick={() => setActiveTab("routine")}
            className="px-3.5 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-500/40 text-xs font-bold text-emerald-200 whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Clock size={13} aria-hidden="true" />
            <span>Daily Routine</span>
          </button>
          <button
            type="button"
            onClick={() =>
              askAiWithTopic(
                `Plan my low-emission daily routine today in ${city.name} at ${effectiveAirData.aqi} AQI`
              )
            }
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white whitespace-nowrap flex items-center gap-1.5 shadow-[0_0_15px_rgba(132,169,140,0.4)] transition-colors cursor-pointer"
          >
            <Bot size={13} aria-hidden="true" />
            <span>Ask AI Co-Pilot</span>
          </button>
        </div>
      </div>

      {effectiveAirData.aqi >= 201 && (
        <div
          role="region"
          aria-label="GRAP smog advisory"
          className="mt-4 p-4 rounded-2xl bg-red-950/35 border border-red-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-300 flex items-center gap-1.5">
              <AlertTriangle size={12} aria-hidden="true" />
              <span>{aqiCategory.grap} Family &amp; Community Advisory</span>
            </span>
            <p className="text-xs text-zinc-200">
              {effectiveAirData.aqi > 300
                ? "Emergency protocol: Stop all outdoor exercise, enforce child N95/hybrid school alerts, halt RWA leaf/guard wood fires, and keep HEPA/DIY fan running 24x7."
                : "Elevated inversion episode: Seal balcony gaps, mandate damp corridor mopping in your RWA, and restrict outdoor transit to tight-seal N95."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("whatsapp")}
            className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-400/40 text-xs font-bold text-red-200 whitespace-nowrap self-start sm:self-center cursor-pointer"
          >
            Alert RWA &amp; Family
          </button>
        </div>
      )}
    </div>
  );
}
