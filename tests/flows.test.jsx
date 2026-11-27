import React, { useState } from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AirPulseApp from "../src/AirPulseApp.jsx";
import ErrorBoundary from "../src/components/ErrorBoundary.jsx";
import Modal from "../src/components/common/Modal.jsx";
import { useDebouncedStorage } from "../src/hooks/useDebouncedStorage.js";
import { aiRateLimiter } from "../src/services/geminiApi.js";

describe("BreatheSafe India Interactive User Flows", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          us_aqi: 245,
          pm2_5: 135,
          pm10: 195,
          nitrogen_dioxide: 42,
          sulphur_dioxide: 14,
          ozone: 32,
          carbon_monoxide: 480
        },
        hourly: { time: [], us_aqi: [] },
        results: []
      })
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("supports ArrowRight, ArrowLeft, Home, and End keyboard navigation across tabs", () => {
    render(<AirPulseApp />);
    const dashboardTab = screen.getAllByRole("tab", { name: /Dashboard/i })[0];
    const routineTab = screen.getAllByRole("tab", { name: /Daily Routine/i })[0];
    const aiTab = screen.getAllByRole("tab", { name: /AI Co-Pilot/i })[0];

    expect(dashboardTab).toHaveAttribute("tabindex", "0");
    expect(routineTab).toHaveAttribute("tabindex", "-1");

    fireEvent.keyDown(dashboardTab, { key: "ArrowRight" });
    expect(routineTab).toHaveAttribute("aria-selected", "true");
    expect(routineTab).toHaveAttribute("tabindex", "0");

    fireEvent.keyDown(routineTab, { key: "ArrowLeft" });
    expect(dashboardTab).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(dashboardTab, { key: "End" });
    expect(aiTab).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(aiTab, { key: "Home" });
    expect(dashboardTab).toHaveAttribute("aria-selected", "true");
  });

  it("toggles Smog Simulator, Household Lifestyle, and searches/selects a city via CitySearchModal", async () => {
    render(<AirPulseApp />);

    fireEvent.click(screen.getByRole("button", { name: /Simulate Smog/i }));
    const slider = screen.getByLabelText(/Severe Winter Smog Scenario Slider/i);
    fireEvent.click(screen.getByRole("button", { name: /GRAP IV • 450/i }));
    expect(slider).toHaveValue("450");

    const seniorBtn = screen.getByRole("button", { name: /Senior Citizens/i });
    fireEvent.click(seniorBtn);
    expect(seniorBtn).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: /Change City/i }));
    const dialog = await screen.findByRole("dialog");

    const searchInput = screen.getByLabelText(/Search for a city/i);
    fireEvent.change(searchInput, { target: { value: "Jaipur" } });

    await waitFor(() => {
      expect(screen.getByText(/No cities found matching/i)).toBeInTheDocument();
    });

    fireEvent.change(searchInput, { target: { value: "" } });
    fireEvent.click(within(dialog).getByRole("button", { name: /Kanpur/i }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("toggles Daily Routine, Indoor Hacks + DIY guide + room slider, Eco Swaps, and RWA pledges", () => {
    render(<AirPulseApp />);

    fireEvent.click(screen.getAllByRole("tab", { name: /Daily Routine/i })[0]);
    const morningCard = screen.getByRole("button", { name: /Morning Inversion Lockdown/i });
    expect(morningCard).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(morningCard);
    expect(morningCard).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(screen.getAllByRole("tab", { name: /Indoor Hacks/i })[0]);
    const hepaCheckbox = screen.getByRole("checkbox", { name: /Run HEPA Purifier/i });
    fireEvent.click(hepaCheckbox);
    expect(hepaCheckbox).toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: /Show 5-Min Build Guide/i }));
    expect(screen.getByText(/STEP 1 • PARTS/i)).toBeInTheDocument();

    const roomSlider = screen.getByLabelText(/Room Volume & Clean-Down Speed/i);
    fireEvent.change(roomSlider, { target: { value: "250" } });
    expect(screen.getByText(/250 sq ft/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("tab", { name: /Eco Swaps/i })[0]);
    const metroSwap = screen.getByRole("button", { name: /Low-Emission Commute/i });
    fireEvent.click(metroSwap);
    expect(metroSwap).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getAllByRole("tab", { name: /Community/i })[0]);
    const idlingPledge = screen.getByRole("button", { name: /No-Idling Gate Zone/i });
    fireEvent.click(idlingPledge);
    expect(idlingPledge).toHaveAttribute("aria-pressed", "true");
  });

  it("synthesizes Action Plan, responds in AI Co-Pilot, and interacts with all 5 GenUI widgets", async () => {
    render(<AirPulseApp />);

    fireEvent.click(screen.getAllByRole("tab", { name: /AI Co-Pilot/i })[0]);

    fireEvent.click(screen.getByRole("button", { name: /Synthesize Full Action Plan/i }));
    await waitFor(() => {
      expect(screen.getByText(/1\. Low-Emission Daily Routine/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /Dismiss/i }));
    expect(screen.queryByText(/1\. Low-Emission Daily Routine/i)).not.toBeInTheDocument();

    const input = screen.getByLabelText(/Ask BreatheSafe India AI Co-Pilot/i);
    fireEvent.change(input, { target: { value: "What mask should my kids wear?" } });
    fireEvent.click(screen.getByRole("button", { name: /Send message to AI Co-Pilot/i }));

    await waitFor(() => {
      expect(screen.getByRole("log").textContent).toMatch(/N95/i);
    });

    fireEvent.click(screen.getByRole("button", { name: /3-Year Purifier TCO Bench/i }));
    expect(screen.getByText(/3-Year Total Cost of Ownership/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Pediatric Exposure Calculator/i }));
    fireEvent.change(screen.getByLabelText(/Child Age:/i), { target: { value: "6" } });
    fireEvent.click(screen.getByRole("button", { name: /Metro Rail/i }));
    expect(screen.getByRole("button", { name: /Metro Rail/i })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: /Diurnal Inversion Scrubber/i }));
    expect(screen.getByText(/24-Hour Boundary Layer/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Scrub time of day/i), { target: { value: "2" } });

    fireEvent.click(screen.getByRole("button", { name: /Asthma \/ PEFR Action Plan/i }));
    expect(screen.getByText(/Respiratory & Bronchial Precaution Protocol/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /RWA Society Circular Builder/i }));
    expect(screen.getByText(/RWA Society Circular & Resolution Builder/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Ban Dry Sweeping/i }));
    fireEvent.click(screen.getByRole("button", { name: /Copy Circular/i }));

    const keyInput = screen.getByLabelText(/Optional Gemini API Key/i);
    fireEvent.change(keyInput, { target: { value: "bad" } });
    fireEvent.click(screen.getByRole("button", { name: /^Save$/i }));
    expect(screen.getByRole("status").textContent).toMatch(/Invalid API key format/i);

    fireEvent.change(keyInput, { target: { value: "AIzaSessionOnlyTest12345" } });
    fireEvent.click(screen.getByRole("button", { name: /^Save$/i }));
    expect(screen.getByRole("button", { name: /^Clear$/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^Clear$/i }));
    expect(screen.getByRole("button", { name: /^Save$/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Inspect GenUI JSON Spec/i }));
    expect(screen.getByText(/"synthesizedComponent": "rwa"/i)).toBeInTheDocument();
  });

  it("handles GPS detection gracefully when supported or denied", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (success) =>
          success({ coords: { latitude: 19.076, longitude: 72.8777 } })
      }
    });

    render(<AirPulseApp />);
    fireEvent.click(screen.getAllByRole("button", { name: /Detect GPS Location/i })[0]);
    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: /Select city, currently My GPS Location/i })[0]).toBeInTheDocument();
    });

    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (_success, error) => error(new Error("Denied"))
      }
    });
    fireEvent.click(screen.getAllByRole("button", { name: /Detect GPS Location/i })[0]);
    expect(screen.getByRole("status").textContent).toMatch(/location permissions/i);
  });

  it("renders ErrorBoundary safe fallback and recovers on Try Again", () => {
    const consoleErr = vi.spyOn(console, "error").mockImplementation(() => {});
    let shouldThrow = true;
    function FlakyChild() {
      if (shouldThrow) throw new Error("Simulated render crash");
      return <div>Recovered cleanly</div>;
    }
    render(
      <ErrorBoundary>
        <FlakyChild />
      </ErrorBoundary>
    );
    expect(screen.getByRole("alert")).toHaveTextContent(/Something went wrong/i);
    shouldThrow = false;
    fireEvent.click(screen.getByRole("button", { name: /Try Again/i }));
    expect(screen.getByText("Recovered cleanly")).toBeInTheDocument();
    consoleErr.mockRestore();
  });

  it("traps Tab/Shift+Tab focus in Modal, closes on Escape & backdrop click, and restores focus", async () => {
    function ModalHarness() {
      const [open, setOpen] = useState(false);
      return (
        <div>
          <button type="button" onClick={() => setOpen(true)}>Open Dialog</button>
          <Modal isOpen={open} onClose={() => setOpen(false)} titleId="test-modal-title">
            <h2 id="test-modal-title">Test Modal</h2>
            <button type="button">First Action</button>
            <button type="button" onClick={() => setOpen(false)}>Last Action</button>
          </Modal>
        </div>
      );
    }

    render(<ModalHarness />);
    const trigger = screen.getByRole("button", { name: "Open Dialog" });
    trigger.focus();
    fireEvent.click(trigger);

    const firstBtn = await screen.findByRole("button", { name: "First Action" });
    const lastBtn = screen.getByRole("button", { name: "Last Action" });

    lastBtn.focus();
    fireEvent.keyDown(window, { key: "Tab" });
    expect(document.activeElement).toBe(firstBtn);

    firstBtn.focus();
    fireEvent.keyDown(window, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(lastBtn);

    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(document.activeElement).toBe(trigger);

    fireEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(dialog.parentElement);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("opens PrivacyModal, closes via Done, and resets state on Clear All Local Data", async () => {
    render(<AirPulseApp />);

    fireEvent.click(screen.getByRole("button", { name: /Simulate Smog/i }));
    fireEvent.click(screen.getByRole("button", { name: /GRAP IV • 450/i }));

    fireEvent.click(screen.getByRole("button", { name: /Privacy, Terms & Clear Data/i }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^Done$/i }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Privacy, Terms & Clear Data/i }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Clear All Local Data/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(screen.queryByLabelText(/Severe Winter Smog Scenario Slider/i)).not.toBeInTheDocument();
    expect(screen.getByRole("status").textContent).toMatch(/Cleared all saved local preferences/i);
  });

  it("shows fallback toast when live air quality telemetry fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({ ok: false, status: 503 });
    render(<AirPulseApp />);

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toMatch(/Live telemetry unavailable/i);
    });
  });

  it("handles live Gemini handleSendMessage (success, 429 rate-limit, HTTP error) and handleGenerateCustomPlan", async () => {
    aiRateLimiter.timestamps = [];
    render(<AirPulseApp />);

    fireEvent.click(screen.getAllByRole("tab", { name: /AI Co-Pilot/i })[0]);
    const keyInput = screen.getByLabelText(/Optional Gemini API Key/i);
    fireEvent.change(keyInput, { target: { value: "AIzaLiveTestKey123456" } });
    fireEvent.click(screen.getByRole("button", { name: /^Save$/i }));

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "Live Gemini advice for Delhi." }] } }]
      })
    });

    const input = screen.getByLabelText(/Ask BreatheSafe India AI Co-Pilot/i);
    fireEvent.change(input, { target: { value: "How to reduce exposure?" } });
    fireEvent.click(screen.getByRole("button", { name: /Send message to AI Co-Pilot/i }));

    await waitFor(() => {
      expect(screen.getByRole("log").textContent).toMatch(/Live Gemini advice for Delhi/i);
    });

    // Immediate second call hits client-side cooldown -> 429 rate-limit toast
    fireEvent.change(input, { target: { value: "Another question" } });
    fireEvent.click(screen.getByRole("button", { name: /Send message to AI Co-Pilot/i }));

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toMatch(/AI rate limit reached/i);
      expect(screen.queryByText(/Synthesizing location/i)).not.toBeInTheDocument();
    });

    // Reset limiter and simulate HTTP 500 from both Gemini models
    aiRateLimiter.timestamps = [];
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: false, status: 500 });

    fireEvent.change(input, { target: { value: "Third question" } });
    fireEvent.click(screen.getByRole("button", { name: /Send message to AI Co-Pilot/i }));

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toMatch(/Gemini API returned HTTP 500/i);
      expect(screen.queryByText(/Synthesizing location/i)).not.toBeInTheDocument();
    });

    // Live handleGenerateCustomPlan
    aiRateLimiter.timestamps = [];
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{
              text: JSON.stringify({
                headline: "Custom Live Plan",
                routine: "Seal 6-9 AM",
                indoorHack: "Run HEPA",
                ecoSwap: "Take Metro",
                directImpact: "Saves 2 mg/day"
              })
            }]
          }
        }]
      })
    });

    fireEvent.click(screen.getByRole("button", { name: /Synthesize Full Action Plan/i }));
    await waitFor(() => {
      expect(screen.getByText("Custom Live Plan")).toBeInTheDocument();
    });
  });

  it("flushes pending useDebouncedStorage writes on unmount", () => {
    function StorageHarness({ val }) {
      useDebouncedStorage("vg_test_flush", val, 5000);
      return <span>{val}</span>;
    }

    const { rerender, unmount } = render(<StorageHarness val="initial" />);
    expect(localStorage.getItem("vg_test_flush")).toBeNull();

    rerender(<StorageHarness val="updated" />);
    expect(localStorage.getItem("vg_test_flush")).toBeNull();

    unmount();
    expect(JSON.parse(localStorage.getItem("vg_test_flush"))).toBe("updated");
  });

  it("handles unsupported navigator.geolocation and invalid GPS coordinates", () => {
    const originalGeo = navigator.geolocation;
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: undefined
    });

    const { unmount } = render(<AirPulseApp />);
    fireEvent.click(screen.getAllByRole("button", { name: /Detect GPS Location/i })[0]);
    expect(screen.getByRole("status").textContent).toMatch(/Geolocation is not supported/i);
    unmount();

    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (success) =>
          success({ coords: { latitude: 999, longitude: 999 } })
      }
    });

    render(<AirPulseApp />);
    fireEvent.click(screen.getAllByRole("button", { name: /Detect GPS Location/i })[0]);
    expect(screen.getByRole("status").textContent).toMatch(/invalid GPS coordinates/i);

    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: originalGeo
    });
  });
});
