import React from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { useAirPulse } from "../../context/AirPulseContext.jsx";
import { MAX_CHAT_INPUT_LENGTH } from "../../services/geminiApi.js";
import { isValidApiKeyFormat } from "../../utils/security.js";
import ActionPlanCard from "./ActionPlanCard.jsx";
import GenUIStudioSection from "./GenUIStudioSection.jsx";

const QUICK_PROMPTS = [
  "Plan my low-emission daily routine today",
  "How does my commute affect lung PM2.5?",
  "Best indoor air hacks under ₹2,000?",
  "Draft an RWA action plan for our society"
];

/**
 * GenAI Atmospheric Co-Pilot & Generative UI Synthesis Studio Tab.
 */
export default function AiCopilotTab() {
  const {
    city,
    effectiveAirData,
    isSimulatingAQI,
    lifestyle,
    metrics,
    safestWindowLabel,
    societyName,
    setSocietyName,
    rwaMetrics,
    apiKey,
    setApiKey,
    inputKey,
    setInputKey,
    messages,
    promptInput,
    setPromptInput,
    aiLoading,
    handleSendMessage,
    customAiPlan,
    setCustomAiPlan,
    planLoading,
    handleGenerateCustomPlan,
    activeGenWidget,
    setActiveGenWidget,
    showGenSpec,
    setShowGenSpec,
    copyToClipboard,
    showToast
  } = useAirPulse();
  const handleKeySaveOrClear = () => {
    const trimmed = inputKey.trim();
    if (trimmed) {
      if (!isValidApiKeyFormat(trimmed)) {
        showToast("Invalid API key format; please paste a valid Gemini key.");
        return;
      }
      setApiKey(trimmed);
      setInputKey("");
      showToast("Gemini API key active in session memory only (cleared on refresh).");
    } else if (apiKey) {
      setApiKey("");
      showToast("Cleared Gemini API key; using offline Atmospheric Engine.");
    }
  };

  return (
    <div id="panel-ai" role="tabpanel" aria-label="AI Co-Pilot" className="space-y-6 animate-fadeIn">
      <div className="p-6 md:p-8 rounded-3xl bg-[#161B19] border border-zinc-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shadow-[0_0_15px_rgba(132,169,140,0.4)]">
              <Bot size={18} aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base text-zinc-100">
                BreatheSafe India GenAI Atmospheric Co-Pilot
              </h2>
              <p className="text-xs text-zinc-300">
                Aware of {city.name} ({effectiveAirData.aqi} AQI), {lifestyle.familySize}-member household &amp; {metrics.commuteObj.label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleGenerateCustomPlan}
              disabled={planLoading}
              className="text-xs font-bold px-3 py-1.5 bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-200 border border-emerald-500/40 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles size={13} aria-hidden="true" />
              <span>{planLoading ? "Synthesizing..." : "Synthesize Full Action Plan"}</span>
            </button>
            <input
              type="password"
              autoComplete="off"
              spellCheck={false}
              aria-label="Optional Gemini API Key (held in memory only)"
              placeholder={apiKey ? "Gemini Key Active (Memory)" : "Gemini API Key (Session Only)"}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="text-xs px-3 py-1.5 bg-[#161B19] border border-zinc-800 rounded-xl outline-none focus:border-emerald-400 w-44 text-zinc-200 placeholder-zinc-400"
            />
            <button
              type="button"
              onClick={handleKeySaveOrClear}
              className="text-xs font-semibold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-[0_0_15px_rgba(132,169,140,0.5)] transition-all cursor-pointer"
            >
              {inputKey.trim() ? "Save" : apiKey ? "Clear" : "Save"}
            </button>
          </div>
        </div>

        <ActionPlanCard plan={customAiPlan} onDismiss={() => setCustomAiPlan(null)} />

        <div
          role="log"
          aria-live="polite"
          aria-label="AI Co-Pilot conversation"
          className="space-y-3 max-h-80 overflow-y-auto pr-1"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white rounded-br-sm shadow-[0_0_15px_rgba(132,169,140,0.4)]"
                    : "bg-[#1C2320] text-zinc-200 rounded-bl-sm border border-zinc-800"
                }`}
              >
                {msg.role === "ai" && msg.source && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 flex items-center gap-1 mb-1">
                    <Sparkles size={10} aria-hidden="true" />
                    <span>{msg.source}</span>
                  </span>
                )}
                {msg.text}
              </div>
            </div>
          ))}
          {aiLoading && (
            <div className="flex justify-start">
              <div className="p-3 bg-[#1C2320] rounded-2xl text-xs text-emerald-200 border border-zinc-800 animate-pulse">
                Synthesizing location, lifestyle &amp; atmospheric guidance...
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {QUICK_PROMPTS.map((chip) => (
            <button
              key={chip}
              type="button"
              disabled={aiLoading}
              onClick={() => handleSendMessage(chip)}
              className="px-3 py-1 rounded-full bg-[#1C2320] hover:bg-[#232C28] disabled:opacity-50 text-[11px] text-emerald-200 border border-zinc-800 whitespace-nowrap transition-colors cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="flex gap-2 pt-2 border-t border-zinc-800">
          <input
            type="text"
            aria-label="Ask BreatheSafe India AI Co-Pilot"
            maxLength={MAX_CHAT_INPUT_LENGTH}
            placeholder={`Ask about ${city.name} smog, child exposure, cooking swaps, or RWA rules...`}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !aiLoading && handleSendMessage()}
            className="flex-1 bg-[#161B19] border border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-400 outline-none focus:border-emerald-400 transition-colors"
          />
          <button
            type="button"
            aria-label="Send message to AI Co-Pilot"
            onClick={() => handleSendMessage()}
            disabled={aiLoading}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center shadow-[0_0_15px_rgba(132,169,140,0.5)] transition-all cursor-pointer"
          >
            <Send size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      <GenUIStudioSection
        city={city}
        effectiveAirData={effectiveAirData}
        isSimulatingAQI={isSimulatingAQI}
        lifestyle={lifestyle}
        metrics={metrics}
        safestWindowLabel={safestWindowLabel}
        societyName={societyName}
        setSocietyName={setSocietyName}
        rwaMetrics={rwaMetrics}
        activeGenWidget={activeGenWidget}
        setActiveGenWidget={setActiveGenWidget}
        showGenSpec={showGenSpec}
        setShowGenSpec={setShowGenSpec}
        copyToClipboard={copyToClipboard}
      />
    </div>
  );
}
