import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { POPULAR_CITIES, inferLocationProfile } from "../data/cities.js";
import { INITIAL_AIR_DATA } from "../data/lifestyleData.js";
import { fetchLiveAirQuality } from "../services/airQualityApi.js";
import { getAQICategory } from "../utils/aqi.js";
import { isValidCity } from "../utils/schemas.js";
import { loadStored, sanitizeErrorMessage, validateCoordinates } from "../utils/security.js";
import { useDebouncedStorage } from "./useDebouncedStorage.js";

/**
 * Manages city selection, live Open-Meteo telemetry, GPS detection,
 * and smog scenario simulation.
 */
export function useAirTelemetry(showToast) {
  const [city, setCity] = useState(() =>
    loadStored("ap_selected_city", POPULAR_CITIES[0], isValidCity)
  );
  const [airData, setAirData] = useState(INITIAL_AIR_DATA);
  const [loading, setLoading] = useState(false);
  const [isSimulatingAQI, setIsSimulatingAQI] = useState(false);
  const [simulatedAQI, setSimulatedAQI] = useState(320);

  const isMountedRef = useRef(true);
  const fetchAbortRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (fetchAbortRef.current) fetchAbortRef.current.abort();
    };
  }, []);

  useDebouncedStorage("ap_selected_city", city);

  const loadCityData = useCallback(
    async (targetCity) => {
      if (fetchAbortRef.current) fetchAbortRef.current.abort();
      const controller = new AbortController();
      fetchAbortRef.current = controller;

      setLoading(true);
      try {
        const data = await fetchLiveAirQuality(targetCity.lat, targetCity.lon, {
          signal: controller.signal
        });
        if (!controller.signal.aborted && isMountedRef.current) {
          setAirData(data);
        }
      } catch (err) {
        if (err?.name !== "AbortError" && isMountedRef.current) {
          showToast(`Live telemetry unavailable (${sanitizeErrorMessage(err)}); showing cached baseline.`);
        }
      } finally {
        if (!controller.signal.aborted && isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [showToast]
  );

  useEffect(() => {
    loadCityData(city);
  }, [city, loadCityData]);

  const handleDetectGPS = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!isMountedRef.current) return;
        const coords = validateCoordinates(pos.coords.latitude, pos.coords.longitude);
        if (!coords.valid) {
          showToast("Received invalid GPS coordinates.");
          setLoading(false);
          return;
        }
        setCity({
          name: "My GPS Location",
          state: "Detected Coordinates",
          lat: coords.lat,
          lon: coords.lon
        });
        showToast("Synced air quality to your live GPS coordinates.");
      },
      () => {
        if (!isMountedRef.current) return;
        showToast("Enable browser location permissions to detect local air quality.");
        setLoading(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, [showToast]);

  const resetTelemetry = useCallback(() => {
    setCity(POPULAR_CITIES[0]);
    setIsSimulatingAQI(false);
    setSimulatedAQI(320);
  }, []);

  const effectiveAirData = useMemo(() => {
    if (!isSimulatingAQI) return airData;
    const ratio = simulatedAQI / Math.max(1, airData.aqi);
    return {
      ...airData,
      aqi: simulatedAQI,
      pm25: Math.round(simulatedAQI * 0.58),
      pm10: Math.round(simulatedAQI * 0.82),
      trend: airData.trend.map((p) => ({
        ...p,
        aqi: Math.min(500, Math.max(25, Math.round(p.aqi * ratio))),
        pm25: Math.min(350, Math.max(12, Math.round(p.pm25 * ratio)))
      }))
    };
  }, [airData, isSimulatingAQI, simulatedAQI]);

  const locationProfile = useMemo(
    () => inferLocationProfile(city, effectiveAirData),
    [city, effectiveAirData]
  );
  const aqiCategory = useMemo(() => getAQICategory(effectiveAirData.aqi), [effectiveAirData.aqi]);

  const peakPoint = useMemo(
    () =>
      effectiveAirData.trend.reduce(
        (max, p) => (p.aqi > max.aqi ? p : max),
        effectiveAirData.trend[0] || { time: "6 AM", aqi: effectiveAirData.aqi }
      ),
    [effectiveAirData.trend, effectiveAirData.aqi]
  );

  const safestPoint = useMemo(
    () =>
      effectiveAirData.trend.reduce(
        (min, p) => (p.aqi < min.aqi ? p : min),
        effectiveAirData.trend[0] || { time: "12 PM", aqi: effectiveAirData.aqi }
      ),
    [effectiveAirData.trend, effectiveAirData.aqi]
  );

  const safestWindowLabel = useMemo(() => {
    const t = (safestPoint?.time || "").toLowerCase();
    return t.includes("12 pm") || t.includes("3 pm")
      ? "12:30 PM – 3:00 PM"
      : `${safestPoint?.time || "1:00 PM"} Window`;
  }, [safestPoint]);

  return {
    city,
    setCity,
    loading,
    isSimulatingAQI,
    setIsSimulatingAQI,
    simulatedAQI,
    setSimulatedAQI,
    loadCityData,
    handleDetectGPS,
    resetTelemetry,
    effectiveAirData,
    locationProfile,
    aqiCategory,
    peakPoint,
    safestPoint,
    safestWindowLabel
  };
}
