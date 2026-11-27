import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, Crosshair, RefreshCw, Search, X } from "lucide-react";
import { POPULAR_CITIES } from "../data/cities.js";
import { searchCitiesAPI } from "../services/airQualityApi.js";
import { sanitizeText } from "../utils/security.js";
import Modal from "./common/Modal.jsx";

/**
 * Accessible City Search Modal with debounced Open-Meteo geocoding lookup.
 */
export default function CitySearchModal({ isOpen, onClose, onSelectCity, onDetectGPS }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const clean = sanitizeText(query, 80);
    if (!clean || clean.length < 2) {
      setResults([]);
      setSearchError(null);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      setSearchError(null);
      try {
        const res = await searchCitiesAPI(clean, { signal: controller.signal });
        if (!controller.signal.aborted) {
          setResults(res);
          setSearching(false);
        }
      } catch (err) {
        if (!controller.signal.aborted && err?.name !== "AbortError") {
          setResults([]);
          setSearchError("City search is temporarily unavailable. Please pick a popular city below or try again.");
          setSearching(false);
        }
      }
    }, 280);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} titleId="city-search-title" initialFocusRef={inputRef}>
      <div className="space-y-4 flex flex-col min-h-0">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h2 id="city-search-title" className="font-display font-extrabold text-base text-zinc-100">
              Select City
            </h2>
            <p className="text-xs text-zinc-300">Live air quality across Indian &amp; global cities</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close city search dialog"
            className="p-2 rounded-full hover:bg-zinc-800/70 text-zinc-300 hover:text-white cursor-pointer"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={onDetectGPS}
          className="w-full py-2.5 px-3 bg-emerald-950/50 hover:bg-emerald-950/60 text-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-zinc-800 transition-all shadow-[0_0_15px_rgba(132,169,140,0.2)] cursor-pointer"
        >
          <Crosshair size={14} className="text-emerald-300" aria-hidden="true" />
          <span>Detect Current GPS Location</span>
        </button>

        <div className="relative">
          <label htmlFor="city-search-input" className="sr-only">
            Search for a city
          </label>
          <Search size={15} className="absolute left-3.5 top-3 text-zinc-300" aria-hidden="true" />
          <input
            ref={inputRef}
            id="city-search-input"
            type="text"
            maxLength={80}
            placeholder="Search any city (e.g. Kanpur, Pune, Jaipur, Patna...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 bg-[#1C2320] border border-zinc-800 rounded-xl text-xs font-medium text-zinc-100 placeholder-zinc-400 outline-none focus:border-emerald-400 transition-colors"
          />
          {searching && (
            <div className="absolute right-3.5 top-3" role="status" aria-label="Searching cities">
              <RefreshCw size={13} className="animate-spin text-emerald-300" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="overflow-y-auto space-y-1 flex-1 max-h-60 pr-1">
          {results.length > 0 ? (
            results.map((c) => (
              <button
                key={`${c.name}-${c.lat}-${c.lon}`}
                type="button"
                onClick={() => onSelectCity(c)}
                className="w-full p-2.5 rounded-xl text-left hover:bg-[#1C2320] flex items-center justify-between text-xs transition-colors border border-transparent hover:border-zinc-800 cursor-pointer"
              >
                <div>
                  <span className="font-bold text-zinc-100 block">{c.name}</span>
                  <span className="text-[11px] text-zinc-300">
                    {c.state ? `${c.state}, ` : ""}
                    {c.country}
                  </span>
                </div>
                <ChevronRight size={14} className="text-emerald-300" aria-hidden="true" />
              </button>
            ))
          ) : searchError ? (
            <p className="text-xs text-red-300 text-center py-4" role="status">
              {searchError}
            </p>
          ) : query.trim().length >= 2 && !searching ? (
            <p className="text-xs text-zinc-300 text-center py-4" role="status">
              No cities found matching &ldquo;{sanitizeText(query, 40)}&rdquo;.
            </p>
          ) : (
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300 mb-2 px-1 block">
                Popular Cities
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {POPULAR_CITIES.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => onSelectCity(c)}
                    className="p-2.5 rounded-xl bg-[#1C2320] hover:bg-[#232C28] text-left transition-colors border border-zinc-800 cursor-pointer"
                  >
                    <span className="font-bold text-xs text-zinc-100 block truncate">{c.name}</span>
                    <span className="text-[11px] text-zinc-300 block truncate">{c.state}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
