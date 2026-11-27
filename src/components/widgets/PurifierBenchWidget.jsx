import React from "react";

/**
 * 3-Year Total Cost of Ownership benchmark comparing DIY Box-Fan vs commercial purifiers.
 */
export function PurifierBenchWidget() {
  const options = [
    {
      name: "DIY Box-Fan + HEPA H13",
      upfront: "₹1,800",
      filterYr: "₹650 / yr",
      tco3Yr: "₹3,100",
      cadr: "280 m³/hr",
      verdict: "Best Value (80% Cheaper)"
    },
    {
      name: "Mid-Range Commercial",
      upfront: "₹9,999",
      filterYr: "₹2,400 / yr",
      tco3Yr: "₹14,799",
      cadr: "320 m³/hr",
      verdict: "Quiet Sleep Mode"
    },
    {
      name: "Premium Brand Purifier",
      upfront: "₹26,500",
      filterYr: "₹4,500 / yr",
      tco3Yr: "₹35,500",
      cadr: "380 m³/hr",
      verdict: "App Telemetry Included"
    }
  ];

  return (
    <div className="p-5 rounded-2xl bg-[#161B19] border border-zinc-800 space-y-3">
      <h3 className="text-sm font-bold text-zinc-100">3-Year Total Cost of Ownership (TCO) Benchmark</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt) => (
          <div
            key={opt.name}
            className={`p-4 rounded-xl border space-y-1.5 ${
              opt.name.startsWith("DIY")
                ? "bg-teal-950/40 border-emerald-500/40"
                : "bg-[#1C2320] border-zinc-800"
            }`}
          >
            <span className="text-xs font-bold text-zinc-100 block">{opt.name}</span>
            <span className="font-mono font-black text-xl text-emerald-300 block">{opt.tco3Yr}</span>
            <span className="text-xs text-zinc-300 block">
              Upfront: {opt.upfront} • Filter: {opt.filterYr}
            </span>
            <span className="text-xs text-zinc-200 block">CADR: {opt.cadr}</span>
            <span className="text-[11px] font-mono font-bold text-teal-300 block pt-1">
              {opt.verdict}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
