import React from "react";
import {
  Activity,
  Bot,
  Clock,
  Crosshair,
  Leaf,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wind
} from "lucide-react";

export const NAV_TABS = [
  { id: "dashboard", label: "Dashboard", icon: Activity },
  { id: "routine", label: "Daily Routine", icon: Clock },
  { id: "indoor", label: "Indoor Hacks", icon: ShieldCheck },
  { id: "swaps", label: "Eco Swaps", icon: Leaf },
  { id: "whatsapp", label: "Community", icon: Users },
  { id: "ai", label: "AI Co-Pilot", icon: Bot }
];

function TabButtonList({ activeTab, setActiveTab, handleTabKeyDown, idPrefix, vertical = false }) {
  return NAV_TABS.map((tab) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return (
      <button
        key={tab.id}
        type="button"
        role="tab"
        id={`${idPrefix}-${tab.id}`}
        tabIndex={isActive ? 0 : -1}
        aria-selected={isActive}
        aria-controls={`panel-${tab.id}`}
        onClick={() => setActiveTab(tab.id)}
        onKeyDown={(e) => handleTabKeyDown(e, tab.id, idPrefix)}
        className={`flex items-center cursor-pointer whitespace-nowrap transition-all duration-200 font-semibold ${
          vertical
            ? "w-full gap-2.5 px-3.5 py-2.5 rounded-xl text-xs text-left"
            : "gap-1 px-3 py-1.5 rounded-full text-[11px]"
        } ${
          isActive
            ? "bg-emerald-600 text-white shadow-sm"
            : "text-zinc-300 hover:text-white hover:bg-zinc-800/70"
        }`}
      >
        <Icon size={vertical ? 15 : 12} aria-hidden="true" />
        <span>{tab.label}</span>
      </button>
    );
  });
}

/**
 * Responsive navigation: vertical editorial sidebar on desktop (lg+)
 * and compact sticky top bar + horizontal tabs on mobile.
 */
export default function Navbar({
  activeTab,
  setActiveTab,
  handleTabKeyDown,
  city,
  onOpenSearch,
  onDetectGPS,
  loading
}) {
  return (
    <>
      {/* Mobile / Tablet Top Bar */}
      <header className="lg:hidden sticky top-0 z-40 px-4 py-3 bg-[#0E1110]/90 backdrop-blur-xl border-b border-zinc-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-lime-600 flex items-center justify-center text-white shadow-sm">
              <Wind size={18} className="stroke-[2.5]" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-display font-bold text-base tracking-tight text-zinc-100 leading-none">
                  BreatheSafe India
                </span>
                <Sparkles size={11} className="text-emerald-300" aria-hidden="true" />
              </div>
              <span className="text-[11px] text-zinc-300 font-medium">Family Clean-Air Companion</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label={`Select city, currently ${city.name}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161B19] hover:bg-[#1C2320] rounded-full text-xs font-semibold text-zinc-200 border border-zinc-800 transition-all cursor-pointer"
            >
              <MapPin size={13} className="text-emerald-300" aria-hidden="true" />
              <span className="max-w-24 truncate">{city.name}</span>
              <Search size={12} className="text-zinc-300" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onDetectGPS}
              aria-label="Detect GPS Location"
              title="Detect GPS Location"
              className="p-2 bg-[#161B19] hover:bg-[#1C2320] rounded-full text-emerald-300 border border-zinc-800 transition-all cursor-pointer"
            >
              <Crosshair size={14} className={loading ? "animate-spin" : ""} aria-hidden="true" />
            </button>
          </div>
        </div>

        <nav
          aria-label="Mobile navigation"
          role="tablist"
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 pb-0.5"
        >
          <TabButtonList
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleTabKeyDown={handleTabKeyDown}
            idPrefix="mobile-tab"
          />
        </nav>
      </header>

      {/* Desktop Left Sidebar Rail */}
      <aside
        aria-label="Sidebar navigation and location"
        className="hidden lg:flex lg:flex-col lg:sticky lg:top-6 lg:self-start bg-[#161B19] border border-zinc-800 rounded-3xl p-5 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-lime-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Wind size={20} className="stroke-[2.5]" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg tracking-tight text-zinc-100 leading-none">
                BreatheSafe India
              </span>
              <Sparkles size={12} className="text-emerald-300" aria-hidden="true" />
            </div>
            <span className="text-xs text-zinc-300 font-medium block mt-0.5">
              Family Clean-Air Companion
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-semibold px-1 block">
            Location Telemetry
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label={`Select city, currently ${city.name}`}
              className="flex-1 flex items-center justify-between gap-2 px-3 py-2 bg-[#1C2320] hover:bg-[#232C28] rounded-xl text-xs font-semibold text-zinc-100 border border-zinc-800 transition-all cursor-pointer min-w-0"
            >
              <span className="flex items-center gap-1.5 truncate">
                <MapPin size={13} className="text-emerald-300 shrink-0" aria-hidden="true" />
                <span className="truncate">{city.name}</span>
              </span>
              <Search size={12} className="text-zinc-300 shrink-0" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onDetectGPS}
              aria-label="Detect GPS Location"
              title="Detect GPS Location"
              className="p-2 bg-[#1C2320] hover:bg-[#232C28] rounded-xl text-emerald-300 border border-zinc-800 transition-all cursor-pointer shrink-0"
            >
              <Crosshair size={15} className={loading ? "animate-spin" : ""} aria-hidden="true" />
            </button>
          </div>
        </div>

        <nav
          aria-label="Primary navigation"
          role="tablist"
          aria-orientation="vertical"
          className="flex flex-col gap-1"
        >
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-semibold px-1 mb-1 block">
            Modules
          </span>
          <TabButtonList
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleTabKeyDown={handleTabKeyDown}
            idPrefix="tab"
            vertical
          />
        </nav>
      </aside>
    </>
  );
}
