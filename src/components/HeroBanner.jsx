import React from "react";
import { Search, Sparkles } from "lucide-react";
import { POPULAR_CITIES } from "../data/cities.js";

/**
 * Compact editorial masthead with headline and quick city switcher pills.
 */
export default function HeroBanner({ city, setCity, onOpenSearch }) {
  return (
    <section className="relative bg-[#161B19] border border-zinc-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <Sparkles size={13} className="text-emerald-300" aria-hidden="true" />
            <span>Daily Smog Companion • Made for Indian Homes</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display tracking-tight text-zinc-100 leading-tight">
            Safer Air for Your{" "}
            <span className="text-emerald-300">Family &amp; Neighbourhood</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
            Simple daily habits, budget-friendly indoor fixes, and community swaps shaped around
            your city and home — with clear numbers on what every step saves.
          </p>
        </div>
      </div>

      <div
        className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-zinc-800"
        role="group"
        aria-label="Quick city selector"
      >
        {POPULAR_CITIES.slice(0, 6).map((c) => {
          const isSelected = city.name === c.name;
          return (
            <button
              key={c.name}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setCity(c)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? "bg-emerald-600 text-white border border-orange-700 shadow-sm"
                  : "bg-[#1C2320] text-zinc-300 hover:text-white hover:bg-[#232C28] border border-zinc-800"
              }`}
            >
              {c.name}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onOpenSearch}
          className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1C2320] text-emerald-300 hover:bg-[#232C28] border border-emerald-500/40 flex items-center gap-1 cursor-pointer"
        >
          <Search size={11} aria-hidden="true" />
          <span>More Cities</span>
        </button>
      </div>
    </section>
  );
}
