/**
 * GA4 Measurement ID validation test
 * Ensures the VITE_GA4_MEASUREMENT_ID env var is set and in the correct format.
 */
import { describe, it, expect } from "vitest";

describe("GA4 Measurement ID", () => {
  it("VITE_GA4_MEASUREMENT_ID is set and matches G-XXXXXXXXXX format", () => {
    const id = process.env.VITE_GA4_MEASUREMENT_ID;
    expect(id, "VITE_GA4_MEASUREMENT_ID must be set").toBeTruthy();
    expect(id).toMatch(/^G-[A-Z0-9]{6,12}$/);
  });
});
