import React from "react";
import { Sparkles } from "lucide-react";

/**
 * 4-Pillar Synthesized Custom AI Action Plan Card.
 */
export default function ActionPlanCard({ plan, onDismiss }) {
  if (!plan) return null;

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-[#161B19] border border-emerald-500/40 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-teal-300 font-bold inline-flex items-center gap-1">
            <Sparkles size={11} aria-hidden="true" />
            <span>{plan.source}</span>
          </span>
          <h3 className="text-sm font-bold text-zinc-100">{plan.headline}</h3>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs text-zinc-300 hover:text-white cursor-pointer"
        >
          Dismiss
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        <div className="p-3 rounded-xl bg-[#1C2320] border border-zinc-800">
          <strong className="text-emerald-300 block mb-1">1. Low-Emission Daily Routine</strong>
          <p className="text-zinc-200 leading-relaxed">{plan.routine}</p>
        </div>
        <div className="p-3 rounded-xl bg-[#1C2320] border border-zinc-800">
          <strong className="text-emerald-300 block mb-1">2. Priority Indoor Hacks</strong>
          <p className="text-zinc-200 leading-relaxed">{plan.indoorHack}</p>
        </div>
        <div className="p-3 rounded-xl bg-[#1C2320] border border-zinc-800">
          <strong className="text-emerald-300 block mb-1">3. Sustainable Alternatives</strong>
          <p className="text-zinc-200 leading-relaxed">{plan.ecoSwap}</p>
        </div>
        <div className="p-3 rounded-xl bg-teal-950/40 border border-zinc-800">
          <strong className="text-teal-300 block mb-1">4. Direct Measurable Impact</strong>
          <p className="text-teal-100 leading-relaxed">{plan.directImpact}</p>
        </div>
      </div>
    </div>
  );
}
