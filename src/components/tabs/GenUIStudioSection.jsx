import React from "react";
import { Calculator, Code2, Sparkles, Stethoscope, Sun, Users, Wrench } from "lucide-react";
import {
  AsthmaRiskWidget,
  DiurnalInversionWidget,
  PediatricExposureWidget,
  PurifierBenchWidget,
  RwaResolutionWidget
} from "../GenUIWidgets.jsx";

const GEN_WIDGETS = [
  { id: "pediatric", label: "Pediatric Exposure Calculator", icon: Calculator },
  { id: "purifier", label: "3-Year Purifier TCO Bench", icon: Wrench },
  { id: "diurnal", label: "Diurnal Inversion Scrubber", icon: Sun },
  { id: "asthma", label: "Asthma / PEFR Action Plan", icon: Stethoscope },
  { id: "rwa", label: "RWA Society Circular Builder", icon: Users }
];

/**
 * Generative UI Synthesis Studio section with interactive decision widgets and JSON spec inspector.
 */
export default function GenUIStudioSection({
  city,
  effectiveAirData,
  isSimulatingAQI,
  lifestyle,
  metrics,
  safestWindowLabel,
  societyName,
  setSocietyName,
  rwaMetrics,
  activeGenWidget,
  setActiveGenWidget,
  showGenSpec,
  setShowGenSpec,
  copyToClipboard
}) {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-[#161B19] border border-zinc-800 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold inline-flex items-center gap-1.5">
            <Sparkles size={11} aria-hidden="true" />
            <span>Generative UI Synthesis Studio</span>
          </span>
          <h2 className="font-display font-extrabold text-base text-zinc-100 mt-0.5">
            Interactive Decision Widgets
          </h2>
        </div>
        <button
          type="button"
          aria-expanded={showGenSpec}
          onClick={() => setShowGenSpec((prev) => !prev)}
          className="px-3 py-1.5 rounded-xl bg-[#1C2320] hover:bg-[#232C28] border border-zinc-800 text-xs font-mono text-emerald-200 flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
        >
          <Code2 size={13} aria-hidden="true" />
          <span>{showGenSpec ? "Hide GenUI JSON" : "Inspect GenUI JSON Spec"}</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Interactive decision widgets">
        {GEN_WIDGETS.map((w) => {
          const Icon = w.icon;
          const active = activeGenWidget === w.id;
          return (
            <button
              key={w.id}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveGenWidget(w.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                active
                  ? "bg-emerald-600 text-white border-emerald-400 shadow-[0_0_15px_rgba(132,169,140,0.5)]"
                  : "bg-[#161B19] text-zinc-300 border-zinc-800 hover:border-emerald-500/60"
              }`}
            >
              <Icon size={13} aria-hidden="true" />
              <span>{w.label}</span>
            </button>
          );
        })}
      </div>

      {activeGenWidget === "pediatric" && (
        <PediatricExposureWidget city={city} airData={effectiveAirData} />
      )}
      {activeGenWidget === "purifier" && <PurifierBenchWidget />}
      {activeGenWidget === "diurnal" && (
        <DiurnalInversionWidget airData={effectiveAirData} safestWindowLabel={safestWindowLabel} />
      )}
      {activeGenWidget === "asthma" && (
        <AsthmaRiskWidget airData={effectiveAirData} protectedIndoorAQI={metrics.protectedIndoorAQI} />
      )}
      {activeGenWidget === "rwa" && (
        <RwaResolutionWidget
          city={city}
          airData={effectiveAirData}
          societyName={societyName}
          setSocietyName={setSocietyName}
          rwaMetrics={rwaMetrics}
          onCopy={(txt) => copyToClipboard("rwaWidget", txt)}
        />
      )}

      {showGenSpec && (
        <pre className="p-4 rounded-2xl bg-[#1C2320] border border-zinc-800 text-[11px] font-mono text-emerald-200 overflow-x-auto">
          {JSON.stringify(
            {
              synthesizedComponent: activeGenWidget,
              context: {
                city: city.name,
                effectiveAQI: effectiveAirData.aqi,
                isSimulatingAQI,
                pm25: effectiveAirData.pm25,
                lifestyle,
                protectedIndoorAQI: metrics.protectedIndoorAQI,
                familyPm25AvoidedMgPerDay: metrics.familyPm25AvoidedMgDay,
                winterFamilyPm25Grams: metrics.winterFamilyPm25Grams,
                co2SavedKgPerMonth: metrics.totalCo2SavedMonth
              }
            },
            null,
            2
          )}
        </pre>
      )}
    </div>
  );
}
