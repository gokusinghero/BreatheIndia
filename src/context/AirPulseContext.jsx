import React, { createContext, useContext } from "react";
import { useAirPulseState } from "../hooks/useAirPulseState.js";

const AirPulseContext = createContext(null);

/**
 * Provides BreatheSafe India state and actions to all descendant components,
 * eliminating multi-level prop drilling.
 */
export function AirPulseProvider({ children }) {
  const value = useAirPulseState();
  return <AirPulseContext.Provider value={value}>{children}</AirPulseContext.Provider>;
}

/**
 * Access the BreatheSafe India application state and actions.
 */
export function useAirPulse() {
  const ctx = useContext(AirPulseContext);
  if (!ctx) {
    throw new Error("useAirPulse must be used within an AirPulseProvider");
  }
  return ctx;
}
