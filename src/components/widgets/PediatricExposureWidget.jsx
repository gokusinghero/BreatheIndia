import React, { useState } from "react";

/**
 * Pediatric Commute Lung Deposition Simulator widget.
 */
export function PediatricExposureWidget({ city, airData }) {
  const [age, setAge] = useState(8);
  const [commuteMins, setCommuteMins] = useState(40);
  const [transit, setTransit] = useState("bus");
  const [hasN95, setHasN95] = useState(true);

  const modeFactor = { rickshaw: 1.5, bus: 1.25, metro: 0.65, car: 0.7 }[transit];
  const ageFactor = age <= 10 ? 1.45 : 1.2;
  const maskFactor = hasN95 ? 0.18 : 1.0;
  const inhaledUg = Math.round(
    airData.pm25 * (commuteMins / 60) * 0.55 * modeFactor * ageFactor * maskFactor
  );
  const unmaskedUg = Math.round(
    airData.pm25 * (commuteMins / 60) * 0.55 * modeFactor * ageFactor
  );

  return (
    <div className="p-5 rounded-2xl bg-[#161B19] border border-zinc-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-zinc-100">
            Pediatric Commute Lung Deposition Simulator ({city.name})
          </h3>
          <p className="text-xs text-zinc-300">
            Adjust child age, transit mode, and N95 seal to see exact commute particulate load
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-teal-950/40 border border-zinc-800 text-right">
          <span className="text-[11px] font-mono text-emerald-300 block">COMMUTE LUNG DOSE</span>
          <span className="font-mono font-black text-lg text-teal-300">{inhaledUg} µg PM2.5</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="pediatric-age-slider" className="text-zinc-200">
              Child Age:
            </label>
            <strong className="font-mono text-emerald-300">{age} yrs</strong>
          </div>
          <input
            id="pediatric-age-slider"
            type="range"
            min="3"
            max="16"
            value={age}
            aria-valuetext={`${age} years`}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />

          <div className="flex justify-between pt-1">
            <label htmlFor="pediatric-transit-slider" className="text-zinc-200">
              Daily School Transit:
            </label>
            <strong className="font-mono text-emerald-300">{commuteMins} mins</strong>
          </div>
          <input
            id="pediatric-transit-slider"
            type="range"
            min="10"
            max="120"
            step="5"
            value={commuteMins}
            aria-valuetext={`${commuteMins} minutes`}
            onChange={(e) => setCommuteMins(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        <div className="space-y-2.5">
          <span className="text-zinc-200 block">Transit Mode:</span>
          <div className="grid grid-cols-2 gap-1.5" role="group" aria-label="Child transit mode">
            {[
              { id: "rickshaw", label: "Open Rickshaw" },
              { id: "bus", label: "School Bus" },
              { id: "metro", label: "Metro Rail" },
              { id: "car", label: "AC Car (Recirc)" }
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={transit === m.id}
                onClick={() => setTransit(m.id)}
                className={`p-2 rounded-xl border text-[11px] font-semibold cursor-pointer ${
                  transit === m.id
                    ? "bg-emerald-950/60 border-emerald-400 text-zinc-100"
                    : "bg-[#1C2320] border-zinc-800 text-zinc-300"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={hasN95}
              onChange={(e) => setHasN95(e.target.checked)}
              className="accent-emerald-500 cursor-pointer"
            />
            <span className="text-zinc-200 font-medium">
              Tight-Seal Child N95 Mask (cuts deposition by 82%: {unmaskedUg} µg → {inhaledUg} µg)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
