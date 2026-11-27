import { useCallback, useEffect, useRef, useState } from "react";
import { POPULAR_CITIES } from "../data/cities.js";
import { ECO_SWAPS_DATA, INDOOR_HACKS_DATA } from "../data/lifestyleData.js";
import { sanitizeText } from "../utils/security.js";
import {
  MAX_CHAT_INPUT_LENGTH,
  buildAiContextSummary,
  buildOfflineAtmosphericReply,
  callGeminiModels,
  detectGenWidgetIntent,
  synthesizeCustomActionPlan
} from "../services/geminiApi.js";

function createWelcomeMessage(cityName) {
  return {
    id: `welcome-${Date.now()}`,
    role: "ai",
    text: `Namaste! I'm your BreatheSafe India family air guide. I've checked today's air for ${cityName} and your home setup — ask me anything about keeping kids, elders, and your home safe today, or try a tool below.`
  };
}

/**
 * Encapsulates GenAI Atmospheric Co-Pilot chat, custom plan synthesis,
 * abortable Gemini calls, and GenUI widget selection.
 */
export function useAiCopilot({
  city,
  locationProfile,
  effectiveAirData,
  aqiCategory,
  metrics,
  lifestyle,
  indoorActions,
  adoptedSwaps,
  routineBlocks,
  safestWindowLabel,
  safestPoint,
  peakPoint,
  roomSqFt,
  roomAchStats,
  societyName,
  flatCount,
  rwaMetrics,
  showToast
}) {
  const [apiKey, setApiKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [messages, setMessages] = useState(() => [createWelcomeMessage(POPULAR_CITIES[0].name)]);
  const [promptInput, setPromptInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [activeGenWidget, setActiveGenWidget] = useState("pediatric");
  const [showGenSpec, setShowGenSpec] = useState(false);
  const [customAiPlan, setCustomAiPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);

  const aiTimerRef = useRef(null);
  const planTimerRef = useRef(null);
  const aiAbortRef = useRef(null);
  const planAbortRef = useRef(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const abortInFlight = useCallback(() => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    if (planTimerRef.current) clearTimeout(planTimerRef.current);
    if (aiAbortRef.current) aiAbortRef.current.abort();
    if (planAbortRef.current) planAbortRef.current.abort();
  }, []);

  useEffect(() => abortInFlight, [abortInFlight]);

  const resetAiState = useCallback(() => {
    abortInFlight();
    setApiKey("");
    setInputKey("");
    setPromptInput("");
    setCustomAiPlan(null);
    setAiLoading(false);
    setPlanLoading(false);
    setMessages([createWelcomeMessage(POPULAR_CITIES[0].name)]);
  }, [abortInFlight]);

  const handleSendMessage = useCallback(
    async (textToSend) => {
      if (aiLoading) return;
      const userMsg = sanitizeText(textToSend || promptInput, MAX_CHAT_INPUT_LENGTH);
      if (!userMsg) return;

      if (aiAbortRef.current) aiAbortRef.current.abort();
      const controller = new AbortController();
      aiAbortRef.current = controller;

      const msgIdBase = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setMessages((prev) => [...prev, { id: `u-${msgIdBase}`, role: "user", text: userMsg }]);
      setPromptInput("");
      setAiLoading(true);

      const matchedWidget = detectGenWidgetIntent(userMsg);
      if (matchedWidget) setActiveGenWidget(matchedWidget);

      const activeHackNames =
        INDOOR_HACKS_DATA.filter((h) => indoorActions[h.key])
          .map((h) => h.key)
          .join(", ") || "none";
      const activeSwapNames =
        ECO_SWAPS_DATA.filter((s) => adoptedSwaps.includes(s.id))
          .map((s) => s.category)
          .join(", ") || "none";
      const recentHistory = messagesRef.current
        .slice(-4)
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${sanitizeText(m.text, 240)}`)
        .join("\n");

      const safeSociety = sanitizeText(societyName, 80);
      const contextSummary = buildAiContextSummary({
        city,
        locationProfile,
        effectiveAirData,
        aqiCategory,
        metrics,
        safestWindowLabel,
        lifestyle,
        activeHackNames,
        activeSwapNames,
        roomSqFt,
        roomAchStats,
        societyName: safeSociety,
        flatCount,
        rwaMetrics
      });

      try {
        if (apiKey.trim()) {
          const result = await callGeminiModels(apiKey, contextSummary, recentHistory, userMsg, {
            signal: controller.signal
          });
          if (controller.signal.aborted) return;
          if (result.text) {
            setMessages((prev) => [
              ...prev,
              { id: `a-${msgIdBase}`, role: "ai", text: result.text, source: `Gemini (${result.model})` }
            ]);
            setAiLoading(false);
            return;
          }
          if (result.rateLimited) {
            showToast("AI rate limit reached; using offline Atmospheric Engine.");
          } else if (result.errorStatus) {
            showToast(`Gemini API returned HTTP ${result.errorStatus}; using offline Atmospheric Engine.`);
          }
        }

        if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
        aiTimerRef.current = setTimeout(() => {
          if (controller.signal.aborted) return;
          const advice = buildOfflineAtmosphericReply({
            userMsg,
            city,
            effectiveAirData,
            aqiCategory,
            metrics,
            lifestyle,
            adoptedSwaps,
            safestWindowLabel,
            safestPoint,
            peakPoint,
            roomSqFt,
            roomAchStats,
            societyName: safeSociety,
            flatCount,
            rwaMetrics
          });
          setMessages((prev) => [
            ...prev,
            { id: `a-${msgIdBase}`, role: "ai", text: advice, source: "BreatheSafe India Atmospheric Engine" }
          ]);
          setAiLoading(false);
        }, 80);
      } catch {
        if (controller.signal.aborted) return;
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${msgIdBase}`,
            role: "ai",
            text: "Unable to reach the AI cloud right now. Switching to offline atmospheric guidance.",
            source: "BreatheSafe India Atmospheric Engine"
          }
        ]);
        setAiLoading(false);
      }
    },
    [
      aiLoading,
      promptInput,
      indoorActions,
      adoptedSwaps,
      societyName,
      city,
      locationProfile,
      effectiveAirData,
      aqiCategory,
      metrics,
      safestWindowLabel,
      lifestyle,
      roomSqFt,
      roomAchStats,
      flatCount,
      rwaMetrics,
      apiKey,
      showToast,
      safestPoint,
      peakPoint
    ]
  );

  const handleGenerateCustomPlan = useCallback(async () => {
    if (planLoading) return;
    if (planAbortRef.current) planAbortRef.current.abort();
    const controller = new AbortController();
    planAbortRef.current = controller;

    setPlanLoading(true);
    const planParams = {
      city,
      effectiveAirData,
      aqiCategory,
      lifestyle,
      routineBlocks,
      safestWindowLabel,
      roomSqFt,
      roomAchStats,
      metrics,
      societyName
    };
    if (apiKey.trim()) {
      const plan = await synthesizeCustomActionPlan(planParams, apiKey, {
        signal: controller.signal
      });
      if (!controller.signal.aborted) {
        setCustomAiPlan(plan);
        setPlanLoading(false);
      }
      return;
    }
    if (planTimerRef.current) clearTimeout(planTimerRef.current);
    planTimerRef.current = setTimeout(async () => {
      const plan = await synthesizeCustomActionPlan(planParams, "");
      if (!controller.signal.aborted) {
        setCustomAiPlan(plan);
        setPlanLoading(false);
      }
    }, 80);
  }, [
    planLoading,
    city,
    effectiveAirData,
    aqiCategory,
    lifestyle,
    routineBlocks,
    safestWindowLabel,
    roomSqFt,
    roomAchStats,
    metrics,
    societyName,
    apiKey
  ]);

  return {
    apiKey,
    setApiKey,
    inputKey,
    setInputKey,
    messages,
    promptInput,
    setPromptInput,
    aiLoading,
    handleSendMessage,
    activeGenWidget,
    setActiveGenWidget,
    showGenSpec,
    setShowGenSpec,
    customAiPlan,
    setCustomAiPlan,
    planLoading,
    handleGenerateCustomPlan,
    resetAiState
  };
}
