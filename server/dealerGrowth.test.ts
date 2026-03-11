import { describe, it, expect, vi } from "vitest";

/**
 * Dealer Growth CRM integration tests.
 * Validates that the router module loads correctly and that
 * the key sub-routers are wired up.
 */

describe("dealerGrowth router", () => {
  it("exports a valid dealerGrowthRouter", async () => {
    const mod = await import("./routers/dealerGrowth");
    expect(mod.dealerGrowthRouter).toBeDefined();
    expect(typeof mod.dealerGrowthRouter).toBe("object");
  });

  it("has the expected sub-routers", async () => {
    const mod = await import("./routers/dealerGrowth");
    const router = mod.dealerGrowthRouter as any;

    // The router should have _def.procedures or _def.record for sub-routers
    const routerDef = router._def;
    expect(routerDef).toBeDefined();

    // Check that the sub-routers exist in the record
    const record = routerDef.record;
    expect(record).toBeDefined();

    const expectedSubRouters = [
      "dealership",
      "contact",
      "visitLog",
      "proposal",
      "followUp",
      "tracking",
      "socialLink",
      "dashboard",
      "settings",
      "brandAsset",
      "group",
    ];

    for (const name of expectedSubRouters) {
      expect(record[name]).toBeDefined();
    }
  });

  it("dealership sub-router is a tRPC router", async () => {
    const mod = await import("./routers/dealerGrowth");
    const router = mod.dealerGrowthRouter as any;
    const dealershipRouter = router._def.record.dealership;
    expect(dealershipRouter).toBeDefined();
    // Verify it's a tRPC construct (router or merged router)
    expect(typeof dealershipRouter).toBe("object");
  });
});

describe("db helpers", () => {
  it("exports dealership-related db functions", async () => {
    const db = await import("./db");

    const expectedFunctions = [
      "listDealerships",
      "getDealership",
      "createDealership",
      "updateDealership",
      "deleteDealership",
      "getDashboardStats",
    ];

    for (const fn of expectedFunctions) {
      expect(typeof (db as any)[fn]).toBe("function");
    }
  });
});
