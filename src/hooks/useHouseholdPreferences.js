import { useCallback, useState } from "react";
import {
  DEFAULT_ADOPTED_SWAPS,
  DEFAULT_INDOOR_ACTIONS,
  DEFAULT_LIFESTYLE,
  DEFAULT_ROUTINE_COMPLETED,
  DEFAULT_RWA_PLEDGES
} from "../data/lifestyleData.js";
import {
  isValidAdoptedSwaps,
  isValidBooleanMap,
  isValidLifestyle
} from "../utils/schemas.js";
import { loadStored, sanitizeText } from "../utils/security.js";
import { useDebouncedStorage } from "./useDebouncedStorage.js";

const DEFAULT_SOCIETY = "Greenwood Residency RWA";

/**
 * Manages household profile, indoor hacks, eco swaps, routine checklist,
 * room size, and RWA society preferences with debounced localStorage persistence.
 */
export function useHouseholdPreferences() {
  const [lifestyle, setLifestyle] = useState(() =>
    loadStored("ap_lifestyle_profile", DEFAULT_LIFESTYLE, isValidLifestyle)
  );
  const [indoorActions, setIndoorActions] = useState(() =>
    loadStored("ap_indoor_actions", DEFAULT_INDOOR_ACTIONS, isValidBooleanMap)
  );
  const [adoptedSwaps, setAdoptedSwaps] = useState(() =>
    loadStored("ap_adopted_swaps", DEFAULT_ADOPTED_SWAPS, isValidAdoptedSwaps)
  );
  const [routineCompleted, setRoutineCompleted] = useState(() =>
    loadStored("ap_routine_completed", DEFAULT_ROUTINE_COMPLETED, isValidBooleanMap)
  );
  const [roomSqFt, setRoomSqFt] = useState(() =>
    loadStored("ap_room_sqft", 150, (v) => typeof v === "number" && v >= 60 && v <= 1000)
  );
  const [societyName, setSocietyName] = useState(() =>
    sanitizeText(
      loadStored("ap_society_name", DEFAULT_SOCIETY, (v) => typeof v === "string" && v.length <= 80),
      80
    ) || DEFAULT_SOCIETY
  );
  const [flatCount, setFlatCount] = useState(() =>
    loadStored("ap_flat_count", 60, (v) => typeof v === "number" && v >= 1 && v <= 500)
  );
  const [rwaPledges, setRwaPledges] = useState(() =>
    loadStored("ap_rwa_pledges", DEFAULT_RWA_PLEDGES, isValidBooleanMap)
  );

  useDebouncedStorage("ap_lifestyle_profile", lifestyle);
  useDebouncedStorage("ap_indoor_actions", indoorActions);
  useDebouncedStorage("ap_adopted_swaps", adoptedSwaps);
  useDebouncedStorage("ap_routine_completed", routineCompleted);
  useDebouncedStorage("ap_room_sqft", roomSqFt);
  useDebouncedStorage("ap_society_name", societyName);
  useDebouncedStorage("ap_flat_count", flatCount);
  useDebouncedStorage("ap_rwa_pledges", rwaPledges);

  const toggleEcoSwap = useCallback((id) => {
    setAdoptedSwaps((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const resetPreferences = useCallback(() => {
    setLifestyle(DEFAULT_LIFESTYLE);
    setIndoorActions(DEFAULT_INDOOR_ACTIONS);
    setAdoptedSwaps(DEFAULT_ADOPTED_SWAPS);
    setRoutineCompleted(DEFAULT_ROUTINE_COMPLETED);
    setRoomSqFt(150);
    setSocietyName(DEFAULT_SOCIETY);
    setFlatCount(60);
    setRwaPledges(DEFAULT_RWA_PLEDGES);
  }, []);

  return {
    lifestyle,
    setLifestyle,
    indoorActions,
    setIndoorActions,
    adoptedSwaps,
    toggleEcoSwap,
    routineCompleted,
    setRoutineCompleted,
    roomSqFt,
    setRoomSqFt,
    societyName,
    setSocietyName,
    flatCount,
    setFlatCount,
    rwaPledges,
    setRwaPledges,
    resetPreferences
  };
}
