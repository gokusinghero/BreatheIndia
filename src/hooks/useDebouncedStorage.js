import { useEffect, useRef } from "react";
import { saveStored } from "../utils/security.js";

/**
 * Persist a value to localStorage with a trailing debounce and unmount flush.
 * Skips the initial mount write since initial state is already loaded from storage.
 */
export function useDebouncedStorage(key, value, delayMs = 200) {
  const isFirstRender = useRef(true);
  const latestRef = useRef({ key, value });
  const timerRef = useRef(null);
  const pendingRef = useRef(false);

  latestRef.current = { key, value };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    pendingRef.current = true;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      pendingRef.current = false;
      saveStored(latestRef.current.key, latestRef.current.value);
    }, delayMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [key, value, delayMs]);

  useEffect(() => {
    return () => {
      if (pendingRef.current) {
        pendingRef.current = false;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        saveStored(latestRef.current.key, latestRef.current.value);
      }
    };
  }, []);
}
