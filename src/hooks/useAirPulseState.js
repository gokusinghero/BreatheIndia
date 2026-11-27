import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAQICategory } from "../utils/aqi.js";
import {
  buildDailyRoutineBlocks,
  computePersonalMetrics,
  computeRoomAchStats,
  computeRwaMetrics
} from "../utils/metrics.js";
import { clearAllStored } from "../utils/security.js";
import { useAiCopilot } from "./useAiCopilot.js";
import { useAirTelemetry } from "./useAirTelemetry.js";
import { useHouseholdPreferences } from "./useHouseholdPreferences.js";

/**
 * Root BreatheSafe India state hook composing telemetry, household preferences,
 * derived exposure metrics, and the GenAI Co-Pilot.
 */
export function useAirPulseState() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showDiyGuide, setShowDiyGuide] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const toastTimerRef = useRef(null);
  const copyTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMsg(null), 3200);
  }, []);

  const telemetry = useAirTelemetry(showToast);
  const prefs = useHouseholdPreferences();

  const metrics = useMemo(
    () =>
      computePersonalMetrics(
        telemetry.effectiveAirData,
        prefs.lifestyle,
        prefs.indoorActions,
        prefs.adoptedSwaps,
        prefs.routineCompleted
      ),
    [
      telemetry.effectiveAirData,
      prefs.lifestyle,
      prefs.indoorActions,
      prefs.adoptedSwaps,
      prefs.routineCompleted
    ]
  );

  const indoorCategory = useMemo(
    () => getAQICategory(metrics.protectedIndoorAQI),
    [metrics.protectedIndoorAQI]
  );

  const routineBlocks = useMemo(
    () =>
      buildDailyRoutineBlocks(
        telemetry.city,
        telemetry.effectiveAirData,
        prefs.lifestyle,
        telemetry.safestWindowLabel
      ),
    [telemetry.city, telemetry.effectiveAirData, prefs.lifestyle, telemetry.safestWindowLabel]
  );

  const completedRoutineCount = useMemo(
    () => routineBlocks.filter((b) => prefs.routineCompleted[b.id]).length,
    [routineBlocks, prefs.routineCompleted]
  );

  const roomAchStats = useMemo(() => computeRoomAchStats(prefs.roomSqFt), [prefs.roomSqFt]);

  const rwaMetrics = useMemo(
    () =>
      computeRwaMetrics(
        prefs.flatCount,
        prefs.rwaPledges,
        metrics.totalCo2SavedMonth,
        metrics.exposureDropPct
      ),
    [prefs.flatCount, prefs.rwaPledges, metrics.totalCo2SavedMonth, metrics.exposureDropPct]
  );

  const ai = useAiCopilot({
    city: telemetry.city,
    locationProfile: telemetry.locationProfile,
    effectiveAirData: telemetry.effectiveAirData,
    aqiCategory: telemetry.aqiCategory,
    metrics,
    lifestyle: prefs.lifestyle,
    indoorActions: prefs.indoorActions,
    adoptedSwaps: prefs.adoptedSwaps,
    safestWindowLabel: telemetry.safestWindowLabel,
    safestPoint: telemetry.safestPoint,
    peakPoint: telemetry.peakPoint,
    roomSqFt: prefs.roomSqFt,
    roomAchStats,
    societyName: prefs.societyName,
    flatCount: prefs.flatCount,
    rwaMetrics,
    routineBlocks,
    showToast
  });

  const copyToClipboard = useCallback(
    (key, text) => {
      navigator.clipboard?.writeText(text);
      setCopiedKey(key);
      showToast("Copied message to clipboard!");
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopiedKey(null), 2500);
    },
    [showToast]
  );

  const handleClearAllData = useCallback(() => {
    clearAllStored("ap_");
    telemetry.resetTelemetry();
    prefs.resetPreferences();
    ai.resetAiState();
    setIsPrivacyOpen(false);
    showToast("Cleared all saved local preferences and session data.");
  }, [telemetry, prefs, ai, showToast]);

  const askAiWithTopic = useCallback(
    (topic) => {
      setActiveTab("ai");
      ai.handleSendMessage(topic);
    },
    [ai.handleSendMessage]
  );

  return {
    ...telemetry,
    ...prefs,
    ...ai,
    isSearchOpen,
    setIsSearchOpen,
    isPrivacyOpen,
    setIsPrivacyOpen,
    activeTab,
    setActiveTab,
    showDiyGuide,
    setShowDiyGuide,
    toastMsg,
    showToast,
    copiedKey,
    copyToClipboard,
    handleClearAllData,
    askAiWithTopic,
    metrics,
    indoorCategory,
    routineBlocks,
    completedRoutineCount,
    roomAchStats,
    rwaMetrics
  };
}
