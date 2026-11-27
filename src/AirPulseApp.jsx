import React from "react";
import { CheckCircle2 } from "lucide-react";
import { AirPulseProvider, useAirPulse } from "./context/AirPulseContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Navbar from "./components/Navbar.jsx";
import HeroBanner from "./components/HeroBanner.jsx";
import DashboardTab from "./components/tabs/DashboardTab.jsx";
import RoutineTab from "./components/tabs/RoutineTab.jsx";
import IndoorTab from "./components/tabs/IndoorTab.jsx";
import SwapsTab from "./components/tabs/SwapsTab.jsx";
import CommunityTab from "./components/tabs/CommunityTab.jsx";
import AiCopilotTab from "./components/tabs/AiCopilotTab.jsx";
import CitySearchModal from "./components/CitySearchModal.jsx";
import PrivacyModal from "./components/PrivacyModal.jsx";

const TAB_IDS = ["dashboard", "routine", "indoor", "swaps", "whatsapp", "ai"];

const TAB_PANELS = {
  dashboard: DashboardTab,
  routine: RoutineTab,
  indoor: IndoorTab,
  swaps: SwapsTab,
  whatsapp: CommunityTab,
  ai: AiCopilotTab
};

function AirPulseShell() {
  const s = useAirPulse();
  const ActivePanel = TAB_PANELS[s.activeTab] || DashboardTab;

  const handleTabKeyDown = (e, currentId, idPrefix = "tab") => {
    const idx = TAB_IDS.indexOf(currentId);
    if (idx === -1) return;

    let targetId = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      targetId = TAB_IDS[(idx + 1) % TAB_IDS.length];
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      targetId = TAB_IDS[(idx - 1 + TAB_IDS.length) % TAB_IDS.length];
    } else if (e.key === "Home") {
      targetId = TAB_IDS[0];
    } else if (e.key === "End") {
      targetId = TAB_IDS[TAB_IDS.length - 1];
    }

    if (targetId) {
      e.preventDefault();
      s.setActiveTab(targetId);
      document.getElementById(`${idPrefix}-${targetId}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1110] text-zinc-100 font-sans selection:bg-emerald-600 selection:text-white pb-20 relative">
      <div role="status" aria-live="polite" className="sr-only">
        {s.toastMsg || ""}
      </div>
      {s.toastMsg && (
        <div
          aria-hidden="true"
          className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-2xl bg-[#1A211E]/95 border border-emerald-500/60 text-xs font-semibold text-zinc-100 shadow-[0_10px_30px_rgba(132,169,140,0.4)] flex items-center gap-2 backdrop-blur-xl"
        >
          <CheckCircle2 size={14} className="text-teal-300 shrink-0" aria-hidden="true" />
          <span>{s.toastMsg}</span>
        </div>
      )}

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-xl focus:bg-emerald-600 focus:text-white focus:text-xs focus:font-bold"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 pt-4 lg:pt-6 lg:grid lg:grid-cols-[270px_1fr] lg:gap-6 items-start">
        <Navbar
          activeTab={s.activeTab}
          setActiveTab={s.setActiveTab}
          handleTabKeyDown={handleTabKeyDown}
          city={s.city}
          onOpenSearch={() => s.setIsSearchOpen(true)}
          onDetectGPS={s.handleDetectGPS}
          loading={s.loading}
        />

        <div className="min-w-0 space-y-6 mt-4 lg:mt-0">
          <HeroBanner
            city={s.city}
            setCity={s.setCity}
            onOpenSearch={() => s.setIsSearchOpen(true)}
          />

          <main id="main-content" tabIndex={-1} className="space-y-6 outline-none">
            <ActivePanel />
          </main>

          <footer className="pt-6 border-t border-zinc-800 text-xs text-zinc-300 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              BreatheSafe India — Transparent exposure math (Berkeley Earth 22 µg/m³ = 1 cig, 12 m³/day tidal volume).
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => s.setIsPrivacyOpen(true)}
                className="text-emerald-300 hover:text-white underline underline-offset-4 font-semibold cursor-pointer"
              >
                Privacy, Terms &amp; Clear Data
              </button>
            </div>
          </footer>
        </div>
      </div>

      {s.isSearchOpen && (
        <CitySearchModal
          isOpen={s.isSearchOpen}
          onClose={() => s.setIsSearchOpen(false)}
          onSelectCity={(newCity) => {
            s.setCity(newCity);
            s.setIsSearchOpen(false);
          }}
          onDetectGPS={() => {
            s.handleDetectGPS();
            s.setIsSearchOpen(false);
          }}
        />
      )}

      {s.isPrivacyOpen && (
        <PrivacyModal
          isOpen={s.isPrivacyOpen}
          onClose={() => s.setIsPrivacyOpen(false)}
          onClearAllData={s.handleClearAllData}
        />
      )}
    </div>
  );
}

/**
 * Root BreatheSafe India component wrapped in ErrorBoundary and AirPulseProvider.
 */
export default function AirPulseApp() {
  return (
    <ErrorBoundary>
      <AirPulseProvider>
        <AirPulseShell />
      </AirPulseProvider>
    </ErrorBoundary>
  );
}
