import React, { useState } from "react";
import { Building2, Check, Copy } from "lucide-react";
import { sanitizeText } from "../../utils/security.js";
import WhatsAppLink from "../common/WhatsAppLink.jsx";

/**
 * RWA Society Circular & Resolution Builder widget.
 */
export function RwaResolutionWidget({ city, airData, societyName, setSocietyName, rwaMetrics, onCopy }) {
  const [heaters, setHeaters] = useState(true);
  const [banSweep, setBanSweep] = useState(true);
  const [dgRule, setDgRule] = useState(true);

  const safeSocietyName = sanitizeText(societyName, 80) || "Our Society";
  const circularText =
    `*${safeSocietyName} — Emergency Clean-Air Resolution*\n` +
    `City: ${city.name} (${airData.aqi} AQI)\n` +
    `${heaters ? "• Sponsor 800W Guard Heaters (₹150/flat) to eliminate 2.4 kg PM2.5/gate/night from scrap fires.\n" : ""}` +
    `${banSweep ? "• Ban dry broom sweeping; mandate Geela Pocha twice daily.\n" : ""}` +
    `${dgRule ? "• Enforce GRAP DG-set & leaf-burning restrictions across society premises.\n" : ""}` +
    `Collective Impact: *${rwaMetrics.totalPmSavedKgMonth} kg PM2.5* & *${rwaMetrics.co2SavedKgMonth} kg CO2* prevented/month!`;

  return (
    <div className="p-5 rounded-2xl bg-[#161B19] border border-zinc-800 space-y-3 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-emerald-300 shrink-0" aria-hidden="true" />
          <div>
            <h3 className="text-sm font-bold text-zinc-100">RWA Society Circular &amp; Resolution Builder</h3>
            <p className="text-xs text-zinc-300">
              Customize society directives &amp; copy ready-to-broadcast circular
            </p>
          </div>
        </div>
        <div>
          <label htmlFor="rwa-widget-society-name" className="sr-only">
            Society Name
          </label>
          <input
            id="rwa-widget-society-name"
            type="text"
            maxLength={80}
            value={societyName}
            onChange={(e) => setSocietyName(sanitizeText(e.target.value, 80))}
            className="px-3 py-1.5 rounded-xl bg-[#1C2320] border border-zinc-800 text-zinc-100 text-xs outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="RWA resolution directives">
        {[
          { label: "Guard Electric Heaters", val: heaters, set: setHeaters },
          { label: "Ban Dry Sweeping", val: banSweep, set: setBanSweep },
          { label: "DG & Leaf-Fire Ban", val: dgRule, set: setDgRule }
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={item.val}
            onClick={() => item.set(!item.val)}
            className={`px-3 py-1.5 rounded-xl border font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
              item.val
                ? "bg-emerald-950/60 border-emerald-400 text-zinc-100"
                : "bg-[#1C2320] border-zinc-800 text-zinc-300"
            }`}
          >
            {item.val && <Check size={12} aria-hidden="true" />}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-[#1C2320] border border-zinc-800 font-mono text-[11px] text-zinc-200 whitespace-pre-line">
        {circularText}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onCopy(circularText)}
          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Copy size={13} aria-hidden="true" />
          <span>Copy Circular</span>
        </button>
        <WhatsAppLink text={circularText} label="Share on WhatsApp" />
      </div>
    </div>
  );
}
